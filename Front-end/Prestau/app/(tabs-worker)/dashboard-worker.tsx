import { ScrollView, StyleSheet, Text, View, ActivityIndicator, FlatList } from "react-native"; 
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Header } from "@/components/Header";
import { DefaultCard } from "@/components/DefaultCard";
import { NewButton } from "@/components/Button";
import { useState, useEffect, useMemo, useCallback } from "react";
import { getJobs } from "@/src/api/job";
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { getWorkerAvailability, updateWorkerAvailability } from "@/src/api/worker";

// CONFIGURATION DU CALENDRIER (LOCALISATION FR)
LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
  monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
  dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
  dayNamesShort: ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'],
  today: "Aujourd'hui"
};
LocaleConfig.defaultLocale = 'fr';

interface Mission {
    id: number;
    title: string;
    start_time: string;
    end_time: string;
    salary: number;
    address: string;
}

export default function DashboardWorker() {
    const colors = useThemeColors();
    
    // --- ÉTATS (STATES) ---
    const [missions, setMissions] = useState<Mission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Les dates seront chargées depuis la base de données, tableaux vides par défaut
    const [freeDays, setFreeDays] = useState<string[]>([]);
    const [busyDays, setBusyDays] = useState<string[]>([]); 

    // --- CHARGEMENT DES DONNÉES DEPUIS LA BDD ---
    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                // Chargement des missions
                const jobsResponse = await getJobs();
                setMissions(jobsResponse.data);

                const availabilityResponse = await getWorkerAvailability();
                setFreeDays(availabilityResponse.data.freeDays);
                setBusyDays(availabilityResponse.data.busyDays);
                
            } catch (error) {
                console.error("Erreur lors du chargement du dashboard:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // --- LOGIQUE DU CALENDRIER ---
    // Envoi des données à la BDD au clic sur un jour (Changement de statut : Disponible -> Occupé -> Neutre)
    const handleDayPress = async (day: any) => {
        const dateStr = day.dateString;
        
        // Mise à jour optimiste de l'UI (changement immédiat pour un meilleur UX)
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
            // En cas d'erreur, ajouter la logique de rollback ici
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
    const renderMissionCard = useCallback(({ item }: { item: Mission }) => (
        <View style={styles.innerMissionCard}> 
            <Text style={styles.missionTitle}>{item.title}</Text> 
            <Text style={styles.missionDate}> 
                {formatMissionDate(item.start_time, item.end_time)}
            </Text>
            <Text style={styles.missionSalary}>Salaire: {item.salary}€</Text> 
            <Text style={styles.missionAddress}>📍 {item.address}</Text>
        </View>
    ), []);

    // --- RENDU UI ---
    return (
        <View style={{ flex: 1 }}> 
            <Header /> 
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
                <ScrollView 
                    style={styles.body}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}>
                    
                    {/* SECTION 1 : MISSIONS À VENIR */}
                    <DefaultCard style={styles.cardWrapper}> 
                        <Text style={styles.titleCard}>Missions à venir</Text> 
                        {isLoading ? (
                            <ActivityIndicator size="large" color="#F5F2D9" style={{ marginTop: 20 }} /> 
                        ) : missions.length === 0 ? (
                            <Text style={styles.emptyText}>Aucune mission pour le moment</Text> 
                        ) : (
                            <FlatList
                                data={missions}
                                keyExtractor={(item) => String(item.id)}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.flatListContent}
                                renderItem={renderMissionCard}
                            />
                        )}
                    </DefaultCard>

                    {/* SECTION 2 : CALENDRIER DES DISPONIBILITÉS */}
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
                                    selectedDayBackgroundColor: colors.primary,
                                    selectedDayTextColor: '#fff',
                                    todayTextColor: colors.primary,
                                    dayTextColor: '#F5F2D9', 
                                    textDisabledColor: '#a6a6a6', 
                                    arrowColor: '#fff', 
                                    monthTextColor: '#fff', 
                                    textDayFontWeight: '500',
                                    textMonthFontWeight: 'bold',
                                    textDayHeaderFontWeight: 'bold',
                                    textDayFontSize: 15,
                                    textMonthFontSize: 18,
                                    textDayHeaderFontSize: 13
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
                                    <View style={[styles.legendDot, { borderWidth: 1.5, borderColor: '#fff', backgroundColor: 'transparent' }]} />
                                    <Text style={styles.legendText}>Aujourd&apos;hui</Text>
                                </View>
                            </View>
                        </View>
                    </DefaultCard>
                    
                    <View style={styles.buttonCreateAccount}> 
                        <NewButton title="Avis Professionnels" onPress={() => console.log("Avis cliqué")} /> 
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
	flex: 1
},
  body: {
	flex: 1
},
  scrollContent: {
	alignItems: "center",
	gap: 20,
	paddingBottom: 40
},
  cardWrapper: {
	width: "95%" 
	},
  flatListContent: {
	paddingVertical: 10,
	paddingHorizontal: 45,
	gap: 10
},
  buttonCreateAccount: {
    marginTop: 20,
    paddingBottom: 20,
    width: "100%",
    paddingHorizontal: 10,
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
  legendItem: {
	flexDirection: "row",
	alignItems: "center"
},
  legendDot: { width: 12,
	height: 12,
	borderRadius: 6,
	marginRight: 6
},
  legendText: {
	color: "#F5F2D9",
	fontSize: 12,
	fontWeight: "500"
},
});