import { ScrollView, StyleSheet, Text, View, FlatList, Pressable, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Header } from "@/components/Header";
import { DefaultCard } from "@/components/DefaultCard";
import { useMemo, useCallback} from "react";
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { getWorkerAvailability } from "@/src/api/worker";
import { JobOffer, getJobOffersByWorker } from "@/src/api/joboffer";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";

// Hook responsive
function useResponsive() {
    const { width, height } = useWindowDimensions();
    const scale = (size: number) => (width / 390) * size;
    const scaleFont = (size: number) => Math.min(scale(size), size * 1.4);
    return { width, height, scale, scaleFont };
}

// CONFIGURATION DU CALENDRIER (LOCALISATION FR)
LocaleConfig.locales['fr'] = {
    monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
    dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    today: "Aujourd'hui"
};
LocaleConfig.defaultLocale = 'fr';

export default function DashboardWorker() {
  const colors = useThemeColors();
  const { scale, scaleFont } = useResponsive();
  const styles = useMemo(() => getStyles(scale, scaleFont), [scale, scaleFont]);
	const router = useRouter();

    // Récupération des disponibilités via React Query
    const { isLoading: isLoadingAvailability, error: errorAvailability } = useQuery({
        queryKey: ["dashboard-worker-availability"],
        queryFn: () => getWorkerAvailability(),
    });

    // Récupération des offres d'emploi via React Query
    const { data: joboffers = [], isLoading: isLoadingJoboffer, error: errorJoboffer } = useQuery<JobOffer[]>({
        queryKey: ["dashboard-worker-joboffers"],
        queryFn: () => getJobOffersByWorker(),
        refetchInterval: 5000, // Rafraîchissement toutes les 5 secondes
    });

// Construction de l'objet pour la coloration du calendrier (uniquement aujourd'hui)
    const markedDates = useMemo(() => {
        let marks: Record<string, any> = {};
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        marks[todayStr] = {
            customStyles: {
                container: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#ffffff', borderRadius: 10 },
                text: { color: '#F5F2D9', fontWeight: 'bold' }
            }
        };
        return marks;
    }, []);

	const formatMissionDate = useCallback((start: string, end: string) => {
		const options: Intl.DateTimeFormatOptions = { dateStyle: 'short', timeStyle: 'short' };
		return `${new Date(start).toLocaleString('fr-FR', options)} - ${new Date(end).toLocaleString('fr-FR', options)}`;
	}, []);

	const activeMissions = useMemo(() => {
    return joboffers.filter(offer => {
        const isCompleted = offer.status === 'COMPLETED';
        const hasBothReviewed = offer.hasReviewed && offer.hasBeenReviewedByOtherParty;
        if (isCompleted && hasBothReviewed) {
            return false; // Ne pas montrer si complété et les deux ont commenté
        }
        return ['PENDING', 'ACCEPTED', 'COMPLETED', 'REJECTED', 'CANCELLED'].includes(offer.status);
    });
}, [joboffers]);

	// COMPOSANT DE CARTE EXTERNALISÉ : pour éviter la duplication de code
const renderMissionCard = useCallback(({ item }: { item: JobOffer }) => {
    const getBorderColor = (status: string) => {
        if (status === 'PENDING') return '#FF9500';
        if (status === 'ACCEPTED') return '#34C759';
        if (status === 'REJECTED' || status === 'CANCELLED') return '#EE4832';
        return '#E5E5E5';
    };

		const getStatusColor = (status: string) => {
			if (status === 'COMPLETED' || status === 'ACCEPTED') return '#34C759';
			if (status === 'PENDING') return '#FF9500';
			if (status === 'REJECTED' || status === 'CANCELLED') return '#EE4832';
			return '#264D84';
		};

		const getStatusLabel = (status: string) => {
			if (status === 'REJECTED' || status === 'CANCELLED') return 'Candidature refusée';
			return status;
		};

    return (
        <Pressable
            onPress={() => {
                router.push({
                    pathname: '/joboffer/[id]',
                    params: { id: item.id, from: 'dashboard' }
                });
            }}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
        >
            <View style={[
                styles.innerMissionCard,
                {
                    borderColor: getBorderColor(item.status),
                }
            ]}>
                <Text style={styles.missionTitle}>{item.job.title}</Text>
                <Text style={styles.missionDate}>
                    {formatMissionDate(item.job.start_time, item.job.end_time)}

                </Text>
                <Text style={styles.missionSalary}>Salaire: {item.job.salary}€/h</Text>
                <View style={styles.addressRow}>
                    <Text style={styles.missionAddressLabel}>Adresse:</Text>
                    <Text style={styles.missionAddressValue} numberOfLines={2} ellipsizeMode="tail">
                      📍{item.job.company?.city} ({item.job.company?.postalCode})
                    </Text>
                </View>
                <Text style={[styles.missionStatus, { color: getStatusColor(item.status) }]}>Statut: {getStatusLabel(item.status)}</Text>
            </View>
        </Pressable>
    );
}, [router, styles, formatMissionDate]);

  if (isLoadingAvailability || isLoadingJoboffer) return <Text>Chargement...</Text>;
	if (errorAvailability || errorJoboffer) return <Text>Erreur lors de la récupération des données</Text>;

	// Si tout est chargé, on affiche le dashboard
	return (
		<View style={styles.flex1}>
			<Header />
			<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
				<ScrollView
					style={styles.body}
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}>

					{ /* MISSIONS */}
					<DefaultCard style={styles.cardWrapper}>
                        <Text style={styles.titleCard}>Missions</Text>
                        {activeMissions.length === 0 ? (
                            <Text style={styles.emptyText}>Aucune mission pour le moment</Text>
                        ) : (
                            <FlatList
                                data={activeMissions}
                                keyExtractor={(item) => String(item.id)}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.flatListContent}
                                renderItem={renderMissionCard}
                            />
                        )}
                    </DefaultCard>

								{/* CALENDRIER DES DISPONIBILITÉS */}
                    <DefaultCard style={styles.calendarCard}>
                        <Text style={styles.titleCard}>Mes disponibilités</Text>
                        <View style={styles.calendarWrapper}>
                            <Calendar
                                markingType={'custom'}
                                markedDates={markedDates}
                                theme={{
                                    backgroundColor: 'transparent',
                                    calendarBackground: 'transparent',
                                    textSectionTitleColor: '#fff',
                                    dayTextColor: '#F5F2D9',
                                    todayTextColor: colors.primary,
                                    arrowColor: '#fff',
                                    monthTextColor: '#fff',
                                }}
                                // onDayPress supprimé
                                hideExtraDays={true}
                                firstDay={1}
                            />

												{/* LÉGENDE DU CALENDRIER */}
                            <View style={styles.legendContainer}>
                                <View style={styles.legendItem}>
                                    <View style={[styles.legendDot, styles.legendDotToday]} />
                                    <Text style={styles.legendText}>Aujourd&apos;hui</Text>
                                </View>
                            </View>
                        </View>
                    </DefaultCard>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const getStyles = (scale: (n: number) => number, scaleFont: (n: number) => number) =>
    StyleSheet.create({
        flex1: { flex: 1 },
        container: { flex: 1 },
        body: { flex: 1 },
        scrollContent: {
            alignItems: "center",
            gap: scale(20),
            paddingBottom: scale(40),
        },
        cardWrapper: { width: "95%" },
        calendarCard: { width: "95%", paddingBottom: scale(15) },
        flatListContent: {
            paddingVertical: scale(10),
            paddingHorizontal: scale(45),
            gap: scale(10),
        },
        titleCard: {
            fontSize: scaleFont(25),
            textAlign: "center",
            color: "#F5F2D9",
            marginTop: -10,
        },
        emptyText: {
            color: "#F5F2D9",
            textAlign: "center",
            marginTop: scale(15),
            fontSize: scaleFont(16),
        },
        innerMissionCard: {
            backgroundColor: "#F5F2D9",
            borderRadius: scale(15),
            padding: scale(15),
            marginVertical: scale(8),
            width: scale(260),
            alignItems: "center",
            borderWidth: scale(4.5),
        },
        missionTitle: {
            color: "#264D84",
            fontSize: scaleFont(18),
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: scale(5),
        },
        missionDate: {
            color: "#264D84",
            textAlign: "center",
            marginBottom: scale(10),
            fontSize: scaleFont(12),
        },
        missionSalary: {
            color: "#264D84",
            fontSize: scaleFont(13),
            textAlign: "center",
            fontWeight: "600",
        },
        addressRow: {
            flexDirection: "row",
            alignItems: "center",
            marginTop: scale(2),
            marginBottom: scale(8),
        },
        missionAddressLabel: {
            color: "#555",
            fontSize: scaleFont(12),
            textAlign: "center",
            fontWeight: "600",
        },
        missionAddressValue: {
            color: "#555",
            fontSize: scaleFont(12),
            textAlign: "center",
            marginLeft: scale(6),
        },
        missionStatus: {
            color: "#264D84",
            fontSize: scaleFont(14),
            textAlign: "center",
            fontWeight: "600",
        },
        calendarWrapper: {
            marginTop: scale(10),
            width: "100%",
            paddingHorizontal: scale(5),
        },
        legendContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: scale(15),
            paddingHorizontal: scale(10),
            borderTopWidth: 1,
            borderTopColor: "rgba(245, 242, 217, 0.2)",
            paddingTop: scale(10),
        },
        legendItem: {
            flexDirection: "row",
            alignItems: "center",
        },
        legendDot: {
            width: scale(12),
            height: scale(12),
            borderRadius: scale(6),
            marginRight: scale(6),
        },
        legendDotToday: {
            borderWidth: 1.5,
            borderColor: '#fff',
            backgroundColor: 'transparent',
        },
        legendText: {
            color: "#F5F2D9",
            fontSize: scaleFont(12),
            fontWeight: "500",
        },
    });
