import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, useWindowDimensions, Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useEffect, useState} from "react";
import { Header } from "@/components/Header";
import { NewButton } from "@/components/Button";
import { getJobOfferById, deleteJobOffer, JobOffer } from "@/src/api/joboffer";
import { jwtDecode } from "jwt-decode";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useResponsive() {
	const { width, height } = useWindowDimensions();
	const scale = (size: number) => (width / 390) * size;
	const scaleFont = (size: number) => Math.min(scale(size), size * 1.4);
	return { width, height, scale, scaleFont };
}

export default function JobOfferDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const colors = useThemeColors();
	const { scale, scaleFont } = useResponsive();
	const router = useRouter();
	const queryClient = useQueryClient();
	const [role, setRole] = useState<string | null>(null);

	// Récupérer les détails de l'offre d'emploi
	const { data: jobOffer, isLoading } = useQuery<JobOffer>({
		queryKey: ["joboffer", id],
		queryFn: () => getJobOfferById(Number(id)),
		enabled: id !=null, // S'assure que la requête ne s'exécute que si l'id est disponible
	});

	// Récupérer le rôle de l'utilisateur à partir du token JWT
	useEffect(() => {
		SecureStore.getItemAsync('access_token').then((token) => {
			if (token) {
				const decoded: any = jwtDecode(token);
				setRole(decoded.role);
			}
		});
	}, []);

	// Mutation pour annuler la candidature
	const { mutate: cancelApply, isPending: isCancelling } = useMutation({
		mutationFn: () => {
        if (!jobOffer) throw new Error("JobOffer introuvable");
        return deleteJobOffer(Number(jobOffer.job.id));
    },
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["dashboard-worker-joboffers"] });
			if (jobOffer?.job?.id) {
        queryClient.invalidateQueries({ queryKey: ["job", jobOffer.job.id] });
      }
			router.push('/(tabs-worker)/dashboard-worker');
		},
		onError: (err: any) => {
			console.error("Erreur lors de l'annulation :", err);
			Alert.alert("Erreur", "Impossible d'annuler la candidature.");
		}
	});

	if (isLoading) {
		return (
			<View style={[styles.container, { backgroundColor: colors.background }]}>
				<ActivityIndicator size="large" color={colors.primary} />
			</View>
		);
	}

	if (!jobOffer) {
		return (
			<View style={[styles.container, { backgroundColor: colors.background }]}>
				<Text style={{ color: colors.primary }}>Candidature non trouvée</Text>
			</View>
		);
	}

	return (
		<View style={{ flex: 1, backgroundColor: colors.background }}>
			<Header />
			<ScrollView style={styles.main}>

				{/* INFOS DU JOB ASSOCIÉ */}
				<View style={[styles.jobCard, { backgroundColor: "white", margin: scale(25) }]}>
					<View style={styles.jobHeader}>
						<Text style={[styles.jobTitle, { fontSize: scaleFont(20) }]}>{jobOffer.job.title}</Text>
						<View style={styles.salaryBadge}>
							<Text style={[styles.salaryText, { fontSize: scaleFont(15) }]}>{jobOffer.job.salary}€</Text>
						</View>
					</View>

					{/* Adresse */}
					<View style={styles.addressRow}>
						<Text style={[styles.label, { fontSize: scaleFont(14) }]}>Adresse:</Text>
						</View>
						<Text style={[styles.addressText, { fontSize: scaleFont(13), marginLeft: scale(10) }]} numberOfLines={2} ellipsizeMode="tail">
							{jobOffer.job.company?.address}, {jobOffer.job.company?.city} ({jobOffer.job.company?.postalCode})
						</Text>

						{/* Description */}
						<Text style={[styles.label, { fontSize: scaleFont(14), marginTop: scale(10) }]}>Description:</Text>
						<Text style={[styles.jobDescription, { fontSize: scaleFont(13), marginLeft: scale(10) }]} numberOfLines={2} ellipsizeMode="tail">
							{jobOffer.job.description}
					</Text>

					<View style={styles.separator} />

					<View style={styles.dateRow}>
						<View style={styles.dateItem}>
							<Text style={[styles.dateLabel, { fontSize: scaleFont(11) }]}>Début</Text>
							<Text style={[styles.dateValue, { fontSize: scaleFont(12) }]}>
								{new Date(jobOffer.job.start_time).toLocaleDateString("fr-FR")}
							</Text>
							<Text style={[styles.timeText, { fontSize: scaleFont(11) }]}>
								{new Date(jobOffer.job.start_time).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
							</Text>
						</View>
						<View style={styles.dateSeparator} />
						<View style={styles.dateItem}>
							<Text style={[styles.dateLabel, { fontSize: scaleFont(11) }]}>Fin</Text>
							<Text style={[styles.dateValue, { fontSize: scaleFont(12) }]}>
								{new Date(jobOffer.job.end_time).toLocaleDateString("fr-FR")}
							</Text>
							<Text style={[styles.timeText, { fontSize: scaleFont(11) }]}>
								{new Date(jobOffer.job.end_time).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
							</Text>
						</View>
					</View>
					<View style={styles.separator} />
					<Text style={[styles.jobStatus, { fontSize: scaleFont(12), color: jobOffer.status === "PENDING" ? "#e67e22" : "#27ae60" }]}>
							● {jobOffer.status}
						</Text>
				</View>

				{/* ACTIONS */}
				<View style={styles.buttonContainer}>
					{jobOffer.status === 'COMPLETED' && !jobOffer.hasReviewed && (
							<NewButton
									title="Laisser un avis"
									onPress={() => router.push({ pathname: '/review/[id]', params: { id: Number(id) } })}
									style={{ backgroundColor: '#C9A961' }}
							/>
					)}
					{jobOffer.status === 'COMPLETED' && jobOffer.hasReviewed && (
							<View style={styles.infoBox}>
								<Text style={styles.infoText}>Vous avez déjà laissé un avis</Text>
							</View>
					)}
					{jobOffer.status !== 'COMPLETED' && (
						<View style={styles.alreadyAppliedBadge}>
							<Text style={styles.alreadyAppliedText}>
								Vous avez déjà postulé pour cette offre
							</Text>
						</View>
					)}
					{jobOffer.status !== 'COMPLETED' && role === 'WORKER' && (
							<NewButton
									title={isCancelling ? "Annulation..." : "Annuler ma candidature"}
									onPress={() => cancelApply()}
									disabled={isCancelling}
									style={{ backgroundColor: '#FF3B30', marginTop: 15 }}
							/>
					)}
			</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	main: { flex: 1 },
	container: { flex: 1, justifyContent: "center", alignItems: "center" },
	jobCard: {
		borderRadius: 12,
		padding: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	jobHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	jobTitle: {
		fontWeight: "bold",
		flex: 1,
		marginRight: 10,
		color: "#264D84",
	},
	jobStatus: {
		fontWeight: "600",
		alignSelf: "center",
	},
	salaryBadge: {
		backgroundColor: "#4a90d9",
		paddingHorizontal: 12,
		paddingVertical: 4,
		borderRadius: 20,
	},
	salaryText: {
		color: "#fff",
		fontWeight: "600",
	},
	jobDescription: {
		color: "#777",
		lineHeight: 20,
	},
	addressRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	label: {
		marginRight: 6,
		fontWeight: "600",
	},
	addressText: {
		color: "#777",
	},
	separator: {
		height: 1,
		backgroundColor: "#e0e0e0",
		marginVertical: 15,
	},
	dateRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	dateItem: {
		flex: 1,
		alignItems: "center",
	},
	dateLabel: {
		color: "#999",
		fontWeight: "500",
		marginBottom: 2,
	},
	dateValue: {
		color: "#333",
		fontWeight: "600",
	},
	timeText: {
		color: "#666",
	},
	dateSeparator: {
		width: 1,
		height: 40,
		backgroundColor: "#e0e0e0",
	},
	buttonContainer: {
		width: "100%",
		paddingHorizontal: "6.5%",
		paddingBottom: 30,
	},
	infoBox: {
		backgroundColor: "#f0f0f0",
		padding: 15,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#ccc",
		alignItems: "center",
	},
	infoText: {
		color: "#666",
		fontWeight: "600",
		fontSize: 14,
		textAlign: "center",
	},
	alreadyAppliedBadge: {
		backgroundColor: "#f0f0f0",
		padding: 15,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#ccc",
		alignItems: "center",
	},
	alreadyAppliedText: {
		color: "#777",
		fontWeight: "600",
		fontSize: 14,
		textAlign: "center",
	},
});
