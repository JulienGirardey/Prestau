import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, useWindowDimensions, Alert } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useEffect, useState, useCallback } from "react";
import { getJobById } from "@/src/api/job";
import { createJobOffer, deleteJobOffer } from "@/src/api/joboffer"; // Import de la fonction de suppression
import { Header } from "@/components/Header";
import { NewButton } from "@/components/Button";
import { useQuery } from "@tanstack/react-query";

// Hook pour la gestion du design adaptatif
function useResponsive() {
	const { width, height } = useWindowDimensions();
	const scale = (size: number) => (width / 390) * size;
	const scaleFont = (size: number) => Math.min(scale(size), size * 1.4);
	return {
		width,
		height,
		scale,
		scaleFont,
	};
}

export default function JobDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const colors = useThemeColors();
	const { scale, scaleFont } = useResponsive();
	const router = useRouter();
	const [isApplying, setIsApplying] = useState(false);
	const [isCancelling, setIsCancelling] = useState(false);

	const { data: job, isLoading } = useQuery({
		queryKey: ["job", id],
		queryFn: () => getJobById(Number(id)),
		enabled: !!id,
	});

	// Fonction pour postuler à une mission
	const handleApply = async () => {
		setIsApplying(true);
		try {
			await createJobOffer(Number(id));
			router.push('/(tabs-worker)/dashboard-worker');
		} catch (err: any) {
			console.error("Erreur lors de la candidature :", err);
			Alert.alert("Erreur", "Impossible de postuler à cette offre.");
		} finally {
			setIsApplying(false);
		}
	};

	// Fonction pour annuler la candidature
	const handleCancelApply = async () => {
		setIsCancelling(true);
		try {
			await deleteJobOffer(Number(id));
			router.push('/(tabs-worker)/dashboard-worker');
		} catch (err: any) {
			console.error("Erreur lors de l'annulation :", err);
			Alert.alert("Erreur", "Impossible d'annuler la candidature.");
		} finally {
			setIsCancelling(false);
		}
	};

	if (isLoading) {
		return (
			<View style={[styles.container, { backgroundColor: colors.background }]}>
				<ActivityIndicator size="large" color={colors.primary} />
			</View>
		);
	}

	if (!job) {
		return (
			<View style={[styles.container, { backgroundColor: colors.background }]}>
				<Text style={{ color: colors.primary }}>Mission non trouvée</Text>
			</View>
		);
	}

	return (
		<View style={{ flex: 1, backgroundColor: colors.background }}>
			<Header />
			<ScrollView style={styles.main}>
				<View style={[styles.jobCard, { backgroundColor: 'white', margin: scale(25) }]}>
					{/* Header de la carte */}
					<View style={styles.jobHeader}>
						<Text style={[styles.jobTitle, { fontSize: scaleFont(20) }]}>{job.title}</Text>
						<Text style={[
							styles.Status,
							{ fontSize: scaleFont(12), color: job.status === 'OPEN' ? '#27ae60' : '#e67e22' }
						]}>
							● {job.status}
						</Text>
						<View style={styles.salaryBadge}>
							<Text style={[styles.salaryText, { fontSize: scaleFont(15) }]}>{job.salary}€</Text>
						</View>
					</View>

					{/* Adresse */}
					<View style={styles.addressRow}>
						<Text style={[styles.addressTitle, { fontSize: scaleFont(14) }]}>Adresse:</Text>
						<Text style={[styles.addressText, { fontSize: scaleFont(13) }]}>{job.address}</Text>
					</View>

					{/* Description */}
					<Text style={[styles.addressTitle, { fontSize: scaleFont(14), marginTop: 10 }]}>Description:</Text>
					<Text style={[styles.jobDescription, { fontSize: scaleFont(13) }]}>{job.description}</Text>

					{/* Séparateur */}
					<View style={styles.separator} />

					{/* Dates et Horaires */}
					<View style={styles.dateRow}>
						<View style={styles.dateItem}>
							<Text style={[styles.dateLabel, { fontSize: scaleFont(11) }]}>Début</Text>
							<Text style={[styles.dateValue, { fontSize: scaleFont(12) }]}>
								{new Date(job.start_time).toLocaleDateString('fr-FR')}
							</Text>
							<Text style={[styles.timeText, { fontSize: scaleFont(11) }]}>
								{new Date(job.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
							</Text>
						</View>
						<View style={styles.dateSeparator} />
						<View style={styles.dateItem}>
							<Text style={[styles.dateLabel, { fontSize: scaleFont(11) }]}>Fin</Text>
							<Text style={[styles.dateValue, { fontSize: scaleFont(12) }]}>
								{new Date(job.end_time).toLocaleDateString('fr-FR')}
							</Text>
							<Text style={[styles.timeText, { fontSize: scaleFont(11) }]}>
								{new Date(job.end_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
							</Text>
						</View>
					</View>
				</View>

				{/* Section des boutons d'action */}
				<View style={styles.buttonContainer}>
					{job.isWorker && (
						<>
							{job.alreadyApplied ? (
								<View>
									<View style={styles.alreadyAppliedBadge}>
										<Text style={styles.alreadyAppliedText}>
											Vous avez déjà postulé pour cette offre
										</Text>
									</View>
									{/* Bouton pour ANNULER la candidature */}
									<View style={{ marginTop: 15 }}>
										<NewButton
											title={isCancelling ? "Annulation..." : "Annuler ma candidature"}
											onPress={handleCancelApply}
											disabled={isCancelling}
											// Style rouge pour l'annulation
											style={{ backgroundColor: '#FF3B30' }}
										/>
									</View>
								</View>
							) : job.canApply ? (
								<NewButton
									title={isApplying ? "En cours..." : "Postuler"}
									onPress={handleApply}
									disabled={isApplying}
								/>
							) : null}
						</>
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
		color: "#264D84"
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
		color: "#666",
		lineHeight: 20,
	},
	addressRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	addressTitle: {
		marginRight: 6,
		fontWeight: "600",
	},
	addressText: {
		color: "#888",
		fontStyle: "italic",
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
	Status: {
		fontSize: 12,
		fontWeight: "600",
		marginRight: 55,
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
	alreadyAppliedBadge: {
		backgroundColor: "#f0f0f0",
		padding: 15,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#ccc",
		alignItems: "center",
	},
	alreadyAppliedText: {
		color: "#666",
		fontWeight: "600",
		fontSize: 14,
		textAlign: "center",
	},
});