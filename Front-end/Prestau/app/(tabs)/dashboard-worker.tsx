import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Header } from "@/components/Header";
import { DefaultCard } from "@/components/DefaultCard";
import { NewButton } from "@/components/Button";
import { useState, useEffect } from "react";

export default function DashboardWorker() {
    const colors = useThemeColors();

	const [missions, setMissions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
        const fetchMissions = async () => {
            try {
                const response = await fetch('http://192.168.1.34:3000/job');
                
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
                
                const data = await response.json();
                setMissions(data);
            } catch (error) {
                console.error("Ошибка загрузки миссий:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMissions();
    }, []);
    return (
        <View style={{ flex: 1 }}>
            <Header />
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <ScrollView style={styles.body} contentContainerStyle={{ alignItems: "center", gap: 20, paddingBottom: 40 }}>
                    <Text style={styles.title}>Dashboard Worker</Text>
                    
                    <DefaultCard>
                        <Text style={styles.titleCard}>Missions à venir</Text>
                        
                        {isLoading ? (
                            <ActivityIndicator size="large" color="#F5F2D9" style={{ marginTop: 20 }} />
                        ) : missions.length === 0 ? (
                            <Text style={styles.emptyText}>Aucune mission pour le moment</Text>
                        ) : (
                            missions.map((mission, index) => (
                                <View key={mission.id || index} style={styles.innerMissionCard}>
                                    <Text style={styles.missionTitle}>
                                        {mission.title}
                                    </Text>
                                    <Text style={styles.missionDate}>
                                        {new Date(mission.start_time).toLocaleDateString('fr-FR')} - {new Date(mission.end_time).toLocaleDateString('fr-FR')}
                                    </Text>
                                    <Text style={styles.missionSalary}>
                                        Salaire: {mission.salary}€
                                    </Text>
                                    <Text style={styles.missionAddress}>
                                        📍 {mission.address}
                                    </Text>
                                </View>
                            ))
                        )}
                    </DefaultCard>

                    <DefaultCard>
                        <Text style={styles.titleCard}>Mes disponibilités</Text>
                    </DefaultCard>
                    
                    <DefaultCard>
                        <Text style={styles.titleCard}>Dernières missions postées</Text>
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
    container: {
        flex: 1
    },
    title: {
        fontSize: 31,
        textAlign: "center"
    },
    body: {
        flex: 1
    },
	buttonCreateAccount: {
		marginTop: 20,
		paddingBottom: 20,
		width: "100%"
	},
	titleCard: {
	fontSize: 25,
	textAlign: "center",
	color: "#F5F2D9",
	marginTop: -20
	}
});
