import { ScrollView, StyleSheet, Text, View, useWindowDimensions, Pressable, RefreshControl } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Header } from "@/components/Header";
import { DefaultCard } from "@/components/DefaultCard";
import { getMyJobs, Job } from "@/src/api/job";
import { ThemedText } from "@/components/ThemedText";
import { NewButton } from "@/components/Button";
import { useQuery } from "@tanstack/react-query";
import { getJobOffersByCompany, JobOffer } from "@/src/api/joboffer";
import { useRouter } from "expo-router";

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

export default function DashboardCompany() {
    const colors = useThemeColors();
    const { scale, scaleFont } = useResponsive();
    const router = useRouter();

    const { data: jobs = [], isLoading: isLoadingMyJobs, error: errorMyJobs, refetch } = useQuery<Job[]>({
        queryKey: ["dashboard-company-jobs"],
        queryFn: () => getMyJobs(),
    });

    const { data: jobOffer = [], isLoading: isLoadingJobOffer, error: errorJobOffer } = useQuery<JobOffer[]>({
        queryKey: ["dashboard-company-job-offer"],
        queryFn: () => getJobOffersByCompany(),
    });

    if (isLoadingMyJobs || isLoadingJobOffer) return <Text>Chargement...</Text>;
    if (errorMyJobs || errorJobOffer) return <Text>Erreur lors de la récupération des missions</Text>;

    return (
        <View style={[styles.page, { backgroundColor: colors.background }]}>
            <Header />
            <ThemedText
                variant="headline"
                color="primary"
                style={[styles.pageTitle, { fontSize: scaleFont(24), paddingTop: scale(25) }]}
            >
                Missions postées
            </ThemedText>
            <DefaultCard style={[styles.card, { margin: scale(25), marginBottom: scale(30), marginTop: scale(20), paddingBottom: scale(5) }]}>
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
										{jobs.length === 0 ? (
												<Text style={{ textAlign: "center", color: "#888", marginVertical: 20 }}>
														Aucune mission postée
												</Text>
										) : (
												<>
														{jobs.map((job) => (
																<View key={job.id} style={[styles.jobCard, { backgroundColor: colors.background }]}>
																		<Pressable
																				onPress={() => router.push({
																						pathname: '/job/[id]',
																						params: { id: job.id }
																				})}
																				style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
																		>
																				<View style={styles.jobHeader}>
																						<View style={styles.titleWrapper}>
																								<Text 
																										style={[styles.jobTitle, { fontSize: scaleFont(17) }]} 
																										numberOfLines={1} 
																										ellipsizeMode="tail">
																										{job.title}
																								</Text>
																								
																								{job.jobOffers && job.jobOffers.length > 0 && (
																										<View style={styles.notificationDot} />
																								)}
																						</View>

																						<View style={styles.salaryBadge}>
																								<Text style={[styles.salaryText, { fontSize: scaleFont(13) }]}>
																										{job.salary}€
																								</Text>
																						</View>
																				</View>

																				<View style={styles.addressRow}>
																						<Text style={[styles.addressTitle, { fontSize: scaleFont(14) }]}>Adresse:</Text>
																				</View>
																				<Text style={[styles.addressText, { fontSize: scaleFont(12), marginLeft: scale(8) }]} numberOfLines={2} ellipsizeMode="tail">
																						{job.company?.address}, {job.company?.city} ({job.company?.postalCode})
																				</Text>

																				<Text style={[styles.addressTitle, { fontSize: scaleFont(14), marginTop: scale(10) }]}>Description:</Text>
																				<Text style={[styles.jobDescription, { fontSize: scaleFont(12), marginLeft: scale(8) }]} numberOfLines={2} ellipsizeMode="tail">
																						{job.description}
																				</Text>

																				<View style={styles.separator} />

																				<View style={styles.dateRow}>
																						<View style={styles.dateItem}>
																								<Text style={[styles.dateLabel, { fontSize: scaleFont(11) }]}>Début</Text>
																								<Text style={[styles.dateValue, { fontSize: scaleFont(12) }]}>
																										{new Date(job.start_time).toLocaleDateString()}
																								</Text>
																						</View>
																						<View style={styles.dateSeparator} />
																						<View style={styles.dateItem}>
																								<Text style={[styles.dateLabel, { fontSize: scaleFont(11) }]}>Fin</Text>
																								<Text style={[styles.dateValue, { fontSize: scaleFont(12) }]}>
																										{new Date(job.end_time).toLocaleDateString()}
																								</Text>
																						</View>
																				</View>
																				<View style={styles.separator} />
																				<Text style={[
																								styles.Status,
																								{ fontSize: scaleFont(12), color: job.status === 'OPEN' ? '#27ae60' : '#e67e22' }
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
            <View style={styles.buttonContainer}>
                <NewButton title="Avis" onPress={() => console.log("Voir les avis")} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
    },
    pageTitle: {
        textAlign: "center",
    },
    card: {
        flex: 1,
        alignSelf: "stretch",
    },
    scroll: {
        flex: 1,
    },
    jobCard: {
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
        marginHorizontal: 5,
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
        marginRight: 5,
    },
    salaryBadge: {
        backgroundColor: "#4a90d9",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
	Status: {
		fontSize: 12,
		fontWeight: "600",
		alignSelf: "center",
	},
    salaryText: {
        color: "#fff",
        fontWeight: "600",
    },
    jobDescription: {
        color: "#777",
        lineHeight: 20,
    },
    separator: {
        height: 1,
        backgroundColor: "#e0e0e0",
        marginVertical: 10,
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
    dateSeparator: {
        width: 1,
        height: 30,
        backgroundColor: "#e0e0e0",
    },
    addressRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 2,
    },
    addressTitle: {
        marginRight: 6,
    },
    addressText: {
        color: "#777",
    },
    buttonContainer: {
        paddingHorizontal: 25,
        paddingBottom: 20,
        alignItems: "center",
    },
		notificationDot: {
			width: 10,
			height: 10,
			borderRadius: 5,
			backgroundColor: '#FF3B30',
			borderWidth: 1,
			borderColor: '#FFFFFF',
			flexShrink: 0, 
		},
		titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, 
    marginRight: 10,
},
});