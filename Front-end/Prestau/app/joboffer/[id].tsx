import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, useWindowDimensions, Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { NewButton } from "@/components/Button";
import { getJobOfferById, deleteJobOffer, createJobOffer, JobOffer, JobOfferStatus } from "@/src/api/joboffer";
import { jwtDecode } from "jwt-decode";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { JwtPayload } from "@/src/api/auth";

function useResponsive() {
	const { width, height } = useWindowDimensions();
	const scale = (size: number) => (width / 390) * size;
	const scaleFont = (size: number) => Math.min(scale(size), size * 1.4);
	return { width, height, scale, scaleFont };
}

export default function JobOfferDetailScreen() {
	const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
	const colors = useThemeColors();
	const { scale, scaleFont } = useResponsive();
	const styles = getStyles(scale, scaleFont);
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
				const decoded = jwtDecode<JwtPayload>(token);
				setRole(decoded.role);
			}
		});
	}, []);

	// Mutation pour annuler la candidature
	const { mutate: cancelApply, isPending: isCancelling } = useMutation({
		mutationFn: () => {
			if (!jobOffer) throw new Error("JobOffer introuvable");
			return deleteJobOffer(Number(jobOffer.jobId));
		},
		// En cas de succès, invalider les queries liées aux offres d'emploi du worker et rediriger vers le dashboard worker
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["dashboard-worker-joboffers"] });
			if (jobOffer?.job?.id) {
				queryClient.invalidateQueries({ queryKey: ["job", jobOffer.job.id] });
			}
			router.push('/(tabs-worker)/dashboard-worker');
		},
		onError: (err: unknown) => {
			console.error("Erreur lors de l'annulation :", err);
			Alert.alert("Erreur", "Impossible d'annuler la candidature.");
		},
	});

	// Mutation pour re-postuler à une offre
	const { mutate: reApply, isPending: isReApplying } = useMutation({
		mutationFn: () => {
			if (!jobOffer) throw new Error("JobOffer introuvable");
			return createJobOffer(Number(jobOffer.jobId));
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["joboffer", id] });
			queryClient.invalidateQueries({ queryKey: ["dashboard-worker-joboffers"] });
			Alert.alert("Succès", "Vous avez repostulé à cette offre!");
		},
		onError: (err: unknown) => {
			console.error("Erreur lors de la repostulation :", err);
			Alert.alert("Erreur", "Impossible de repostuler à cette offre.");
		},
	});

	// Alerte de confirmation avant d'annuler une candidature
	const handleCancelRequest = () => {
		Alert.alert(
			"Annuler la candidature",
			"Êtes-vous sûr de vouloir annuler cette candidature ? Cette action est irréversible.",
			[
				{ text: "Retour", style: "cancel" },
				{ text: "Annuler la candidature", style: "destructive", onPress: () => cancelApply() },
			]
		);
	};

	// Handler pour re-postuler
	const handleReApply = () => {
		reApply();
	};

	// Détermine la couleur du statut affiché
	const getStatusColor = (status: string) => {
		if (status === JobOfferStatus.REJECTED || status === JobOfferStatus.CANCELLED) return "#EE4832";
		if (status === JobOfferStatus.PENDING) return "#e67e22";
		return "#27ae60";
	};

	// Détermine le label du statut affiché
  const getStatusLabel = (status: string) => {
      if (status === JobOfferStatus.REJECTED) return "Candidature refusée";
      if (status === JobOfferStatus.CANCELLED) return "Candidature annulée";
      if (status === JobOfferStatus.PENDING) return "En attente";
      if (status === JobOfferStatus.ACCEPTED) return "Candidature acceptée";
      if (status === JobOfferStatus.COMPLETED) return "Mission terminée";
      return status;
  };

  const isRejected = jobOffer?.status === JobOfferStatus.REJECTED;
  const isCancelled = jobOffer?.status === JobOfferStatus.CANCELLED;

	// Affichage d'un indicateur de chargement pendant la récupération des données
	if (isLoading) {
		return (
			<View style={[styles.container, { backgroundColor: colors.background }]}>
				<ActivityIndicator size="large" color={colors.primary} />
			</View>
		);
	}

	// Si l'offre d'emploi n'est pas trouvée, afficher un message d'erreur
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

				{/* INFOS DU JOB ASSOCIÉ : récapitulatif de la mission liée à cette candidature */}
				<View style={styles.jobCard}>
					<View style={styles.jobHeader}>
						<Text style={styles.jobTitle}>{jobOffer.job.title}</Text>
						<View style={styles.salaryBadge}>
							<Text style={styles.salaryText}>{jobOffer.job.salary}€</Text>
						</View>
					</View>

					{/* Adresse */}
					<View style={styles.addressRow}>
						<Text style={styles.label}>Adresse:</Text>
						<Text style={styles.addressText} numberOfLines={2} ellipsizeMode="tail">
							{jobOffer.job.company?.address}, {jobOffer.job.company?.city} ({jobOffer.job.company?.postalCode})
						</Text>
					</View>

						{/* Description */}
						<Text style={[styles.label, styles.descriptionLabel]}>Description:</Text>
						<Text style={styles.jobDescription} numberOfLines={2} ellipsizeMode="tail">
							{jobOffer.job.description}
					</Text>

					<View style={styles.separator} />
					 {/* Dates et heures de la mission */}
					<View style={styles.dateRow}>
						<View style={styles.dateItem}>
							<Text style={styles.dateLabel}>Début</Text>
							<Text style={styles.dateValue}>
								{new Date(jobOffer.job.start_time).toLocaleDateString("fr-FR")}
							</Text>
							<Text style={styles.timeText}>
								{new Date(jobOffer.job.start_time).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
							</Text>
						</View>
						<View style={styles.dateSeparator} />
						<View style={styles.dateItem}>
							<Text style={styles.dateLabel}>Fin</Text>
							<Text style={styles.dateValue}>
								{new Date(jobOffer.job.end_time).toLocaleDateString("fr-FR")}
							</Text>
							<Text style={styles.timeText}>
								{new Date(jobOffer.job.end_time).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
							</Text>
						</View>
					</View>

					<View style={styles.separator} />

					{/* Statut de la candidature */}
					<Text style={[styles.jobStatus, { color: getStatusColor(jobOffer.status) }]}>
						● {getStatusLabel(jobOffer.status)}
					</Text>
				</View>

				{/* ACTIONS : boutons disponibles selon le statut de la candidature */}
				<View style={styles.buttonContainer}>

					{/* Candidature REFUSÉE par la company → ne peut plus re-postuler */}
		  {isRejected && (
			  <View style={styles.rejectedBadge}>
				  <Text style={styles.rejectedText}>Votre candidature a été refusée</Text>
			  </View>
		  )}
				{/* Candidature ANNULÉE → proposer de re-postuler */}
				{isCancelled && (
					<>
						<View style={styles.cancelledBadge}>
							<Text style={styles.cancelledText}>Vous avez annulé cette candidature</Text>
						</View>
						<NewButton
							title={isReApplying ? "Repostulation..." : "Re-postuler"}
							onPress={handleReApply}
							disabled={isReApplying}
							style={styles.reapplyButton}
						/>
					</>
				)}
					{/* Mission terminée sans avis → proposer de laisser un avis */}
					{jobOffer.status === JobOfferStatus.COMPLETED && !jobOffer.hasReviewed && (
						<NewButton
							title="Laisser un avis"
							onPress={() => router.push({ pathname: "/review/[id]", params: { id: Number(id) } })}
							style={styles.reviewButton}
						/>
					)}
					{/* Mission terminée avec avis déjà posté → message informatif */}
					{jobOffer.status === JobOfferStatus.COMPLETED && jobOffer.hasReviewed && (
						<View style={styles.infoBox}>
							<Text style={styles.infoText}>Vous avez déjà laissé un avis</Text>
						</View>
					)}

					{/* Candidature en cours → badge informatif */}
					{from !== "dashboard" &&
						jobOffer.status !== JobOfferStatus.COMPLETED &&
						!isRejected && !isCancelled && (
							<View style={styles.alreadyAppliedBadge}>
								<Text style={styles.alreadyAppliedText}>
									Vous avez déjà postulé pour cette offre
								</Text>
							</View>
						)}

					{/* Annuler la candidature (worker uniquement, avec confirmation) */}
					{jobOffer.status !== JobOfferStatus.COMPLETED &&
						!isRejected && !isCancelled &&
						role === "WORKER" && (
							<NewButton
								title={isCancelling ? "Annulation..." : "Annuler ma candidature"}
								onPress={handleCancelRequest}
								disabled={isCancelling}
								style={styles.cancelButton}
							/>
						)}
				</View>
			</ScrollView>
		</View>
	);
}

const getStyles = (scale: (n: number) => number, scaleFont: (n: number) => number) =>
	StyleSheet.create({
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
			backgroundColor: "white",
			margin: scale(25),
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
			fontSize: scaleFont(20),
		},
		jobStatus: {
			fontWeight: "600",
			alignSelf: "center",
			fontSize: scaleFont(12),
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
			fontSize: scaleFont(15),
		},
		jobDescription: {
			color: "#777",
			lineHeight: 20,
			fontSize: scaleFont(13),
			marginLeft: scale(10),
		},
		addressRow: {
			flexDirection: "row",
			alignItems: "center",
			marginBottom: 8,
		},
		label: {
			marginRight: 6,
			fontWeight: "600",
			fontSize: scaleFont(14),
		},
		descriptionLabel: {
			marginTop: scale(10),
		},
		addressText: {
			flex: 1,
			color: "#777",
			fontSize: scaleFont(13),
			marginLeft: scale(10),
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
			fontSize: scaleFont(11),
		},
		dateValue: {
			color: "#333",
			fontWeight: "600",
			fontSize: scaleFont(12),
		},
		timeText: {
			color: "#666",
			fontSize: scaleFont(11),
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
		rejectedBadge: {
			backgroundColor: "#ffe5e5",
			padding: 15,
			borderRadius: 12,
			borderWidth: 1,
			borderColor: "#EE4832",
			alignItems: "center",
		},
		rejectedText: {
			color: "#EE4832",
			fontWeight: "600",
			fontSize: 14,
			textAlign: "center",
		},
		dangerButton: {
			backgroundColor: "#EE4832",
			marginTop: 15,
		},
		cancelButton: {
			backgroundColor: "#EE4832",
			marginTop: 15,
		},
		cancelledBadge: {
			backgroundColor: "#fff3e0",
			padding: 15,
			borderRadius: 12,
			borderWidth: 1,
			borderColor: "#e67e22",
			alignItems: "center",
		},
		cancelledText: {
			color: "#e67e22",
			fontWeight: "600",
			fontSize: 14,
			textAlign: "center",
		},
		reapplyButton: {
			backgroundColor: "#27ae60",
			marginTop: 15,
		},
		reviewButton: {
			backgroundColor: "#C9A961",
		},
	});
