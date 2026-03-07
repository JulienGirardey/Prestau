import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, useWindowDimensions, Alert } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useEffect, useState, useCallback } from "react";
import { Header } from "@/components/Header";
import { NewButton } from "@/components/Button";
import { getJobOfferById, deleteJobOffer } from "@/src/api/joboffer";
import { router } from "expo-router";

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

	const [jobOffer, setJobOffer] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [isCancelling, setIsCancelling] = useState(false);

	const handleCancel = async () => {
		setIsCancelling(true);
		try {
			await deleteJobOffer(jobOffer.job.id);
			router.push("/(tabs-worker)/dashboard-worker");
		} catch {
			Alert.alert("Erreur", "Impossible d'annuler la candidature.");
		} finally {
			setIsCancelling(false);
		}
	};

	const fetchJobOffer = useCallback(() => {
		setLoading(true);
		getJobOfferById(Number(id))
			.then((data) => setJobOffer(data))
			.catch((err) => console.error(err))
			.finally(() => setLoading(false));
	}, [id]);

	useEffect(() => {
		if (id) fetchJobOffer();
	}, [id, fetchJobOffer]);

	if (loading) {
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

	const { job } = jobOffer;

	return (
		<View style={{ flex: 1, backgroundColor: colors.background }}>
			<Header />
			<ScrollView style={styles.main}>

				{/* INFOS DU JOB ASSOCIÉ */}
				<View style={[styles.jobCard, { backgroundColor: "white", margin: scale(25) }]}>
					<View style={styles.jobHeader}>
						<Text style={[styles.jobTitle, { fontSize: scaleFont(20) }]}>{job.title}</Text>
						<Text style={[styles.jobStatus, { fontSize: scaleFont(12), color: job.status === "OPEN" ? "#27ae60" : "#e67e22" }]}>
							● {job.status}
						</Text>
						<View style={styles.salaryBadge}>
							<Text style={[styles.salaryText, { fontSize: scaleFont(15) }]}>{job.salary}€</Text>
						</View>
					</View>

					<View style={styles.addressRow}>
						<Text style={[styles.label, { fontSize: scaleFont(14) }]}>Adresse:</Text>
						<Text style={[styles.addressText, { fontSize: scaleFont(13) }]}>{job.address}</Text>
					</View>

					<Text style={[styles.label, { fontSize: scaleFont(14), marginTop: 10 }]}>Description:</Text>
					<Text style={[styles.jobDescription, { fontSize: scaleFont(13) }]}>{job.description}</Text>

					<View style={styles.separator} />

					<View style={styles.dateRow}>
						<View style={styles.dateItem}>
							<Text style={[styles.dateLabel, { fontSize: scaleFont(11) }]}>Début</Text>
							<Text style={[styles.dateValue, { fontSize: scaleFont(12) }]}>
								{new Date(job.start_time).toLocaleDateString("fr-FR")}
							</Text>
							<Text style={[styles.timeText, { fontSize: scaleFont(11) }]}>
								{new Date(job.start_time).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
							</Text>
						</View>
						<View style={styles.dateSeparator} />
						<View style={styles.dateItem}>
							<Text style={[styles.dateLabel, { fontSize: scaleFont(11) }]}>Fin</Text>
							<Text style={[styles.dateValue, { fontSize: scaleFont(12) }]}>
								{new Date(job.end_time).toLocaleDateString("fr-FR")}
							</Text>
							<Text style={[styles.timeText, { fontSize: scaleFont(11) }]}>
								{new Date(job.end_time).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
							</Text>
						</View>
					</View>
				</View>

				{/* ANNULER LA CANDIDATURE */}
				<View style={styles.buttonContainer}>
					<NewButton
						title={isCancelling ? "Annulation..." : "Annuler ma candidature"}
						onPress={handleCancel}
						disabled={isCancelling}
						style={{ backgroundColor: "#FF3B30" }}
					/>
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
	jobTitle: { fontWeight: "bold", flex: 1, marginRight: 10, color: "#264D84" },
	jobStatus: { fontWeight: "600", marginRight: 55 },
	salaryBadge: { backgroundColor: "#4a90d9", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
	salaryText: { color: "#fff", fontWeight: "600" },
	jobDescription: { color: "#666", lineHeight: 20 },
	addressRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
	label: { marginRight: 6, fontWeight: "600" },
	addressText: { color: "#888", fontStyle: "italic" },
	separator: { height: 1, backgroundColor: "#e0e0e0", marginVertical: 15 },
	dateRow: { flexDirection: "row", alignItems: "center" },
	dateItem: { flex: 1, alignItems: "center" },
	dateLabel: { color: "#999", fontWeight: "500", marginBottom: 2 },
	dateValue: { color: "#333", fontWeight: "600" },
	timeText: { color: "#666" },
	dateSeparator: { width: 1, height: 40, backgroundColor: "#e0e0e0" },
	buttonContainer: { width: "100%", paddingHorizontal: "6.5%", paddingBottom: 30 },
});
