import { ScrollView, StyleSheet, Text, View, useWindowDimensions, Pressable, RefreshControl } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Header } from "@/components/Header";
import { DefaultCard } from "@/components/DefaultCard";
import { getMyJobs, Job } from "@/src/api/job";
import { ThemedText } from "@/components/ThemedText";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";

// Hook responsive :
function useResponsive() {
	const { width, height } = useWindowDimensions();
	const scale = (size: number) => (width / 390) * size;
	const scaleFont = (size: number) => Math.min(scale(size), size * 1.4);
	return {
		width,
		height,
		scale,
		scaleFont,
		columns: width >= 600 ? 2 : 1,
	};
}

// Page de dashboard pour les companies : liste des missions postées
export default function DashboardCompany() {
	const colors = useThemeColors();
	const { scale, scaleFont } = useResponsive();
	const styles = getStyles(scale, scaleFont);
	const router = useRouter();

	// Récupération des missions postées par la company
	const { data: jobs = [], isLoading: isLoadingMyJobs, error: errorMyJobs, refetch } = useQuery<Job[]>({
		queryKey: ["dashboard-company-jobs"],
		queryFn: () => getMyJobs(),
	});

	// Affichage d'un état de chargement ou d'erreur si nécessaire
	if (isLoadingMyJobs) return <Text>Chargement...</Text>;
	if (errorMyJobs) return <Text>Erreur lors de la récupération des missions</Text>;

	return (
		<View style={[styles.page, { backgroundColor: colors.background }]}>
			<Header />
			<ThemedText
				variant="headline"
				color="primary"
				style={styles.pageTitle}
			>
				Missions postées
			</ThemedText>
			{/* Carte contenant la liste des missions */}
			<DefaultCard style={styles.card}>
				<ScrollView
					style={styles.scroll}
					showsVerticalScrollIndicator={false}
					refreshControl={
						<RefreshControl
							refreshing={isLoadingMyJobs}
							onRefresh={refetch}
							tintColor={colors.primary}
						/>
					}
				>
					{/* Liste scrollable des missions */}
					{/* Affichage si aucune mission n'est postée */}
					{jobs.length === 0 ? (
						<Text style={styles.emptyText}>
							Aucune mission postée
						</Text>
					) : (
						<>
							{/* Parcours des missions postées */}
							{jobs.map((job) => (
							<View key={job.id} style={[styles.jobCard, { backgroundColor: colors.background }]}>
									<Pressable
										onPress={() => router.push({
											pathname: '/job/[id]',
											params: { id: job.id }
										})}
										style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
									>
										{/* En-tête de la mission : titre, badge salaire, notification */}
										<View style={styles.jobHeader}>
											{/* Titre + notification */}
											<View style={styles.titleWrapper}>
												<Text
													style={styles.jobTitle}
													numberOfLines={1}
													ellipsizeMode="tail">
													{job.title}
												</Text>
												{/* Dot de notification si des offres sont reçues */}
												{job.jobOffers && job.jobOffers.length > 0 && (
													<View style={styles.notificationDot} />
												)}
											</View>
											{/* Badge salaire */}
											<View style={styles.salaryBadge}>
												<Text style={styles.salaryText}>
													{job.salary}€
												</Text>
											</View>
										</View>

										{/* Adresse de la mission */}
										<View style={styles.addressRow}>
											<Text style={styles.addressTitle}>Adresse:</Text>
										</View>
										<Text style={styles.addressText} numberOfLines={2} ellipsizeMode="tail">
											{job.company?.address}, {job.company?.city} ({job.company?.postalCode})
										</Text>

										{/* Description de la mission */}
										<Text style={styles.descriptionTitle}>Description:</Text>
										<Text style={styles.jobDescription} numberOfLines={2} ellipsizeMode="tail">
											{job.description}
										</Text>
										{/* Séparateur */}
										<View style={styles.separator} />

										{/* Dates de début et fin */}
										<View style={styles.dateRow}>
											{/* Date de début */}
											<View style={styles.dateItem}>
												<Text style={styles.dateLabel}>Début</Text>
												<Text style={styles.dateValue}>
													{new Date(job.start_time).toLocaleDateString()}
												</Text>
											</View>
											<View style={styles.dateSeparator} />
											{/* Date de fin */}
											<View style={styles.dateItem}>
												<Text style={styles.dateLabel}>Fin</Text>
												<Text style={styles.dateValue}>
													{new Date(job.end_time).toLocaleDateString()}
												</Text>
											</View>
										</View>
										<View style={styles.separator} />
										{/* Statut de la mission (OPEN ou autre) avec couleur */}
										<Text style={[
											styles.Status,
											{ color: job.status === "COMPLETED" ? "#27ae60" : job.status === 'OPEN' ? '#27ae60' : '#e67e22' }
										]}>
											● {job.status}
										</Text>
									</Pressable>
								</View>
							))}
						</>
					)}
				</ScrollView>
			</DefaultCard>
		</View>
	);
}

const getStyles = (scale: (n: number) => number, scaleFont: (n: number) => number) =>
	StyleSheet.create({
		page: {
			flex: 1,
		},
		pageTitle: {
			textAlign: "center",
			fontSize: scaleFont(24),
			paddingTop: scale(25),
		},
		card: {
			flex: 1,
			alignSelf: "stretch",
			margin: scale(25),
			marginBottom: scale(30),
			marginTop: scale(20),
			paddingBottom: scale(5),
		},
		scroll: {
			flex: 1,
		},
		emptyText: {
			textAlign: "center",
			color: "#888",
			marginVertical: scale(20),
		},
		jobCard: {
			borderRadius: scale(12),
			padding: scale(15),
			marginBottom: scale(12),
			marginHorizontal: scale(5),
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
			marginBottom: scale(8),
		},
		jobTitle: {
			fontWeight: "bold",
			marginRight: scale(5),
			fontSize: scaleFont(17),
		},
		salaryBadge: {
			backgroundColor: "#4a90d9",
			paddingHorizontal: scale(12),
			paddingVertical: scale(4),
			borderRadius: scale(20),
		},
		Status: {
			fontSize: scaleFont(12),
			fontWeight: "600",
			alignSelf: "center",
		},
		salaryText: {
			color: "#fff",
			fontWeight: "600",
			fontSize: scaleFont(13),
		},
		jobDescription: {
			color: "#777",
			lineHeight: 20,
			fontSize: scaleFont(12),
			marginLeft: scale(8),
		},
		separator: {
			height: 1,
			backgroundColor: "#e0e0e0",
			marginVertical: scale(10),
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
			marginBottom: scale(2),
			fontSize: scaleFont(11),
		},
		dateValue: {
			color: "#333",
			fontWeight: "600",
			fontSize: scaleFont(12),
		},
		dateSeparator: {
			width: 1,
			height: scale(30),
			backgroundColor: "#e0e0e0",
		},
		addressRow: {
			flexDirection: "row",
			alignItems: "center",
			marginBottom: scale(2),
		},
		addressTitle: {
			marginRight: scale(6),
			fontSize: scaleFont(14),
		},
		descriptionTitle: {
			marginRight: scale(6),
			fontSize: scaleFont(14),
			marginTop: scale(10),
		},
		addressText: {
			color: "#777",
			fontSize: scaleFont(12),
			marginLeft: scale(8),
		},
		buttonContainer: {
			paddingHorizontal: scale(25),
			paddingBottom: scale(20),
			alignItems: "center",
		},
		notificationDot: {
			width: scale(10),
			height: scale(10),
			borderRadius: scale(5),
			backgroundColor: '#FF3B30',
			borderWidth: 1,
			borderColor: '#FFFFFF',
			flexShrink: 0,
		},
		titleWrapper: {
			flexDirection: 'row',
			alignItems: 'center',
			flex: 1,
			marginRight: scale(10),
		},
	});
