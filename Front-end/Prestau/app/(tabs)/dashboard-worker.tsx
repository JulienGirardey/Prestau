import { ScrollView, StyleSheet, Text, View, ActivityIndicator, FlatList } from "react-native"; 
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Header } from "@/components/Header";
import { DefaultCard } from "@/components/DefaultCard";
import { NewButton } from "@/components/Button";
import { useState, useEffect, useMemo } from "react";
import { getJobs } from "@/src/api/job";
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { Calendar, LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
  monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
  dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
  dayNamesShort: ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'],
  today: "Aujourd'hui"
};
LocaleConfig.defaultLocale = 'fr';
// ----------------------------------------

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
    const [missions, setMissions] = useState<Mission[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Donne test pour les jours libres et occupés, à remplacer par des données réelles de l'API
    const [freeDays, setFreeDays] = useState(['2026-03-05', '2026-03-06', '2026-03-12', '2026-03-13', '2026-03-25']);
    const [busyDays, setBusyDays] = useState(['2026-03-10', '2026-03-11', '2026-03-18']); 

    const markedDates = useMemo(() => {
        let marks: any = {};

        freeDays.forEach(day => {
            marks[day] = {
                marked: true, 
                customStyles: {
                    container: {
                        backgroundColor: '#4CAF50',
                        borderRadius: 10,
                    },
                    text: { color: '#fff', fontWeight: 'bold' }
                }
            };
        });

        busyDays.forEach(day => {
            marks[day] = {
                marked: true,
                customStyles: {
                    container: {
                        backgroundColor: '#F44336',
                        borderRadius: 10,
                    },
                    text: { color: '#fff', fontWeight: 'bold' }
                }
            };
        });

        return marks;
    }, [freeDays, busyDays]);

    useEffect(() => {
        const fetchMissions = async () => {
            setIsLoading(true);
            try {
                const response = await getJobs();
                setMissions(response.data);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMissions();
    }, []);

	// --- ЛОГИКА ПОСЛЕДНИХ МИССИЙ ---
    // Вычисляем 5 самых свежих миссий, сортируя их по ID по убыванию.
    const recentMissions = useMemo(() => {
        // Создаем копию массива [...missions], чтобы не сломать оригинальный стейт,
        // сортируем (b.id - a.id дает порядок от новых к старым) и отрезаем первые 5.
        return [...missions].sort((a, b) => b.id - a.id).slice(0, 5);
    }, [missions]);
    // ---------------------------------

    return (
        <View style={{ flex: 1 }}> 
            <Header /> 
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
                <ScrollView 
                    style={styles.body}
                    contentContainerStyle={{ alignItems: "center", gap: 20, paddingBottom: 40 }}
                    directionalLockEnabled={true}
                    showsVerticalScrollIndicator={true}>
                    
                    <DefaultCard style={{ width: '95%' }}> 
                        <Text style={styles.titleCard}>Missions à venir</Text> 
                        
                        {isLoading ? (
                            <ActivityIndicator size="large" color="#F5F2D9" style={{ marginTop: 20 }} /> 
                        ) : missions.length === 0 ? (
                            <Text style={styles.emptyText}>Aucune mission pour le moment</Text> 
                        ) : (
                            <FlatList
                                data={missions}
                                keyExtractor={(item, index) => String(item.id || index)}
                                horizontal={true}
                                nestedScrollEnabled={true}
                                showsHorizontalScrollIndicator={true}
                                style={{ width: '100%', flexGrow: 0 }}
                                contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 15 }}
                                snapToAlignment="center"
                                renderItem={({ item }) => (
                                    <View style={styles.innerMissionCard}> 
                                        <Text style={styles.missionTitle}>{item.title}</Text> 
                                        <Text style={styles.missionDate}> 
                                            {new Date(item.start_time).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })} - {new Date(item.end_time).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                                        </Text>
                                        <Text style={styles.missionSalary}>Salaire: {item.salary}€</Text> 
                                        <Text style={styles.missionAddress}>📍 {item.address}</Text>
                                    </View>
                                )}
                            />
                        )}
                    </DefaultCard>

                    {/* --- ИНТЕГРАЦИЯ КАЛЕНДАРЯ --- */}
                    <DefaultCard style={{ width: '95%', paddingBottom: 15 }}> 
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
                                onDayPress={day => {
                                    console.log('Выбрана дата:', day.dateString);
                                    // la logique pour gérer la sélection d'une date libre/occuppe sa sera ici)
                                }}
                                hideExtraDays={true}
                                firstDay={1}/>

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
                                    <Ionicons name="ellipse-outline" size={14} color={colors.primary} style={{ marginRight: 5 }} />
                                    <Text style={styles.legendText}>Aujourd&apos;hui</Text>
                                </View>
                            </View>
                        </View>
                    </DefaultCard>
                    
                    <DefaultCard style={{ width: '95%' }}> 
                        <Text style={styles.titleCard}>Dernières missions postées</Text> 
                        
                        {isLoading ? (
                            <ActivityIndicator size="large" color="#F5F2D9" style={{ marginTop: 20 }} /> 
                        ) : recentMissions.length === 0 ? (
                            <Text style={styles.emptyText}>Aucune mission récente</Text> 
                        ) : (
                            <FlatList
                                data={recentMissions}
                                keyExtractor={(item, index) => String(item.id || index)}
                                horizontal={true}
                                nestedScrollEnabled={true}
                                showsHorizontalScrollIndicator={false}
                                style={{ width: '100%', flexGrow: 0 }}
                                contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 15 }}
                                snapToAlignment="center"
                                renderItem={({ item }) => (
                                    <View style={styles.innerMissionCard}> 
                                        <Text style={styles.missionTitle}>{item.title}</Text> 
                                        <Text style={styles.missionDate}> 
                                            {new Date(item.start_time).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })} - {new Date(item.end_time).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                                        </Text>
                                        <Text style={styles.missionSalary}>Salaire: {item.salary}€</Text> 
                                        <Text style={styles.missionAddress}>📍 {item.address}</Text>
                                    </View>
                                )}
                            />
                        )}
                    </DefaultCard>
                    
                    <View style={styles.buttonCreateAccount}> 
                        <NewButton title="Avis Professionnels" onPress={() => console.log("Button clique")} /> 
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    title: { fontSize: 31, textAlign: "center" },
    body: { flex: 1 },
    buttonCreateAccount: {
        marginTop: 20, paddingBottom: 20, width: "100%", paddingHorizontal: 10
    },
    titleCard: {
        fontSize: 25, textAlign: "center", color: "#F5F2D9", marginTop: -10
    },
    emptyText: {
        color: "#F5F2D9", textAlign: "center", marginTop: 15, fontSize: 16
    },
    innerMissionCard: {
        backgroundColor: '#F5F2D9', borderRadius: 15, padding: 15, marginVertical: 8,
        width: 260, alignSelf: 'center', marginHorizontal: 8, alignItems: 'center',
    },
    missionTitle: {
        color: '#264D84', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 5
    },
    missionDate: {
        color: '#264D84', fontSize: 14, textAlign: 'center', marginBottom: 3
    },
    missionSalary: {
        color: '#264D84', fontSize: 14, textAlign: 'center', fontWeight: '600'
    },
    missionAddress: {
        color: '#555', fontSize: 12, textAlign: 'center', marginTop: 5
    },
    calendarWrapper: {
        marginTop: 10,
        width: '100%',
        paddingHorizontal: 5
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        paddingHorizontal: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(245, 242, 217, 0.2)',
        paddingTop: 10
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 6
    },
    legendText: {
        color: '#F5F2D9',
        fontSize: 12,
        fontWeight: '500'
    }
});