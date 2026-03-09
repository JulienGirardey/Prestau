import { ScrollView, StyleSheet, Text, View, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Header } from "@/components/Header";
import { DefaultCard } from "@/components/DefaultCard";
import { NewButton } from "@/components/Button";
import { useState, useMemo, useCallback, useEffect } from "react";
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { getWorkerAvailability, updateWorkerAvailability } from "@/src/api/worker";
import { JobOffer, getJobOffersByWorker } from "@/src/api/joboffer";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { MissionHistory } from "@/components/MissionHistory";

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
	const router = useRouter();

    // Récupération des disponibilités via React Query
    const { data: availability, isLoading: isLoadingAvailability, error: errorAvailability } = useQuery({
        queryKey: ["dashboard-worker-availability"],
        queryFn: () => getWorkerAvailability(),
    });

    // Récupération des offres d'emploi via React Query
    const { data: joboffers = [], isLoading: isLoadingJoboffer, error: errorJoboffer } = useQuery<JobOffer[]>({
        queryKey: ["dashboard-worker-joboffers"],
        queryFn: () => getJobOffersByWorker(),
    });

    // États locaux pour une mise à jour réactive du calendrier
    const [freeDays, setFreeDays] = useState<string[]>([]);
    const [busyDays, setBusyDays] = useState<string[]>([]);

    // Synchronisation des états locaux avec les données de l'API
    useEffect(() => {
        if (availability?.data) {
            setFreeDays(availability.data.freeDays || []);
            setBusyDays(availability.data.busyDays || []);
        }
    }, [availability]);

    // Gestion du clic sur un jour (Disponible -> Occupé -> Neutre)
    const handleDayPress = async (day: any) => {
        const dateStr = day.dateString;
        let newStatus = 'neutral';

        if (freeDays.includes(dateStr)) {
            setFreeDays(prev => prev.filter(d => d !== dateStr));
            setBusyDays(prev => [...prev, dateStr]);
            newStatus = 'busy';
        } else if (busyDays.includes(dateStr)) {
            setBusyDays(prev => prev.filter(d => d !== dateStr));
            newStatus = 'neutral';
        } else {
            setFreeDays(prev => [...prev, dateStr]);
            newStatus = 'free';
        }

        try {
            await updateWorkerAvailability(dateStr, newStatus);
        } catch (error) {
            console.error("Erreur de mise à jour de la date", error);
        }
    };

// Construction de l'objet pour la coloration du calendrier
	const markedDates = useMemo(() => {
		let marks: Record<string, any> = {};

		// Obtention de la date d'aujourd'hui au format YYYY-MM-DD (en respectant le fuseau horaire local)
		const today = new Date();
		const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

		// Coloration des jours disponibles (Vert)
		freeDays.forEach(day => {
			marks[day] = {
				marked: true,
				customStyles: {
					container: { backgroundColor: '#4CAF50', borderRadius: 10 },
					text: { color: '#fff', fontWeight: 'bold' }
				}
			};
		});

		// Coloration des jours occupés (Rouge)
		busyDays.forEach(day => {
			marks[day] = {
				marked: true,
				customStyles: {
					container: { backgroundColor: '#F44336', borderRadius: 10 },
					text: { color: '#fff', fontWeight: 'bold' }
				}
			};
		});

		// Contour blanc pour la date d'aujourd'hui
		if (marks[todayStr]) {
			// Si aujourd'hui est déjà marqué (vert ou rouge), on ajoute juste la bordure
			marks[todayStr].customStyles.container.borderWidth = 1.5;
			marks[todayStr].customStyles.container.borderColor = '#ffffff';
		} else {
			// Si aujourd'hui est neutre, on crée le style avec la bordure seule
			marks[todayStr] = {
				customStyles: {
					container: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#ffffff', borderRadius: 10 },
					text: { color: '#F5F2D9', fontWeight: 'bold' }
				}
			};
		}

		return marks;
	}, [freeDays, busyDays]);

	// --- FONCTIONS UTILITAIRES (CODE PROPRE) ---
	const formatMissionDate = (start: string, end: string) => {
		const options: Intl.DateTimeFormatOptions = { dateStyle: 'short', timeStyle: 'short' };
		return `${new Date(start).toLocaleString('fr-FR', options)} - ${new Date(end).toLocaleString('fr-FR', options)}`;
	};

	// COMPOSANT DE CARTE EXTERNALISÉ : pour éviter la duplication de code
const renderMissionCard = useCallback(({ item }: { item: JobOffer }) => {
    const getBorderColor = (status: string) => {
        if (status === 'PENDING') return '#FF9500';
        if (status === 'ACCEPTED') return '#34C759';
        return '#E5E5E5';
    };

    return (
        <Pressable 
            onPress={() => {
                router.push({
                    pathname: '/joboffer/[id]', 
                    params: { id: item.id }
                });
            }}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
        >
            <View style={[
                styles.innerMissionCard,
                { 
                    borderColor: getBorderColor(item.status), 
                    borderWidth: 4.5,
                }
            ]}>
                <Text style={styles.missionTitle}>{item.job.title}</Text>
                <Text style={styles.missionDate}>
                    {formatMissionDate(item.job.start_time, item.job.end_time)}
                </Text>
                <Text style={styles.missionSalary}>Salaire: {item.job.salary}€</Text>
                <Text style={styles.missionAddress}>📍 {item.job.company?.address}, {item.job.company?.city} ({item.job.company?.postalCode})</Text>
                <Text style={styles.missionStatus}>Statut: {item.status}</Text>
            </View>
        </Pressable>
    );
}, [router]);

  if (isLoadingAvailability || isLoadingJoboffer) return <Text>Chargement...</Text>;
	if (errorAvailability || errorJoboffer) return <Text>Erreur lors de la récupération des données</Text>;

	// --- RENDU UI ---
	return (
		<View style={{ flex: 1 }}>
			<Header />
			<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
				<ScrollView
					style={styles.body}
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}>

					{ /* MISSIONS */}
					<DefaultCard style={styles.cardWrapper}>
                        <Text style={styles.titleCard}>Missions</Text>
                        {joboffers.length === 0 ? (
                            <Text style={styles.emptyText}>Aucune mission pour le moment</Text>
                        ) : (
                            <FlatList
                                data={joboffers}
                                keyExtractor={(item) => String(item.id)}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.flatListContent}
                                renderItem={renderMissionCard}
                            />
                        )}
                    </DefaultCard>
					{/* CALENDRIER DES DISPONIBILITÉS */}
                    <DefaultCard style={[styles.cardWrapper, { paddingBottom: 15 }]}>
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
                                onDayPress={handleDayPress}
                                hideExtraDays={true}
                                firstDay={1}
                            />
							
							{/* LÉGENDE DU CALENDRIER */}
                            <View style={styles.legendContainer}>
                                <View style={styles.legendItem}>
                                    <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
                                    <Text style={styles.legendText}>Disponible</Text>
                                </View>
                                <View style={styles.legendItem}>
                                    <View style={[styles.legendDot, { backgroundColor: '#F44336' }]} />
                                    <Text style={styles.legendText}>Occupé(e)</Text>
                                </View>
                                <View style={styles.legendItem}>
                                    <View style={[styles.legendDot, { borderWidth: 1.5, borderColor: '#fff' }]} />
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { flex: 1 },
  scrollContent: { alignItems: "center", gap: 20, paddingBottom: 40 },
  cardWrapper: { width: "95%" },
  flatListContent: { paddingVertical: 10, paddingHorizontal: 45, gap: 10 },
  buttonCreateAccount: {
    marginTop: 20,
    paddingBottom: 20,
    width: "100%",
    paddingHorizontal: 10,
  },
  missionCard: {
        borderRadius: 8,
        padding: 16,
        marginRight: 12,
    },
  titleCard: {
    fontSize: 25,
    textAlign: "center",
    color: "#F5F2D9",
    marginTop: -10,
  },
  emptyText: {
    color: "#F5F2D9",
    textAlign: "center",
    marginTop: 15,
    fontSize: 16,
  },
  innerMissionCard: {
    backgroundColor: "#F5F2D9",
    borderRadius: 15,
    padding: 15,
    marginVertical: 8,
    width: 260,
    alignSelf: "center",
    alignItems: "center",
  },
  missionTitle: {
    color: "#264D84",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  missionDate: {
    color: "#264D84",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 3,
  },
  missionSalary: {
    color: "#264D84",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
  },
  missionAddress: {
    color: "#555",
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
  },
  missionStatus: {
    color: "#264D84",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
  },
  calendarWrapper: { marginTop: 10, width: "100%", paddingHorizontal: 5 },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(245, 242, 217, 0.2)",
    paddingTop: 10,
  },
  legendItem: { flexDirection: "row", alignItems: "center" },
  legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 6 },
  legendText: { color: "#F5F2D9", fontSize: 12, fontWeight: "500" },
});