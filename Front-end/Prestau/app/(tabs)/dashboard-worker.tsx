import { ScrollView, StyleSheet, Text, View, ActivityIndicator, FlatList } from "react-native"; 
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Header } from "@/components/Header";
import { DefaultCard } from "@/components/DefaultCard";
import { NewButton } from "@/components/Button";
import { useState, useEffect } from "react";
import * as SecureStore from 'expo-secure-store';

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

    useEffect(() => {
        const fetchMissions = async () => {
            setIsLoading(true);
            try {
                const token = await SecureStore.getItemAsync('token');
                
                if (!token) {
                    console.error("Please log in!");
                    setIsLoading(false);
                    return;
                }
                const response = await fetch('http://192.168.1.34:3000/job', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('Error loading missions');
                }
                const data = await response.json();
                setMissions(data);
            } catch (error) {
                console.error("Error data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMissions();
    }, []); // a transmettre une dépendance pour recharger les missions après une action (ex: création de mission)

    return (
        <View style={{ flex: 1 }}> 
            <Header /> 
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
                <ScrollView 
                    style={styles.body}
                    contentContainerStyle={{ alignItems: "center", gap: 20, paddingBottom: 40 }}
                    directionalLockEnabled={true}
                    showsVerticalScrollIndicator={true}
                >
                    <Text style={styles.title}>Dashboard Worker</Text> 
                    
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

                    <DefaultCard style={{ width: '95%' }}> 
                        <Text style={styles.titleCard}>Mes disponibilités</Text> 
						
                    </DefaultCard>
                    
                    <DefaultCard style={{ width: '95%' }}> 
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
        width: "100%",
        paddingHorizontal: 10
    },
    
    titleCard: {
        fontSize: 25,
        textAlign: "center",
        color: "#F5F2D9",
        marginTop: -20
    },
    
    emptyText: {
        color: "#F5F2D9",
        textAlign: "center",
        marginTop: 15,
        fontSize: 16
    },
    
    innerMissionCard: {
        backgroundColor: '#F5F2D9',
        borderRadius: 15,
        padding: 15,
        marginVertical: 8,
        width: 260,
        alignSelf: 'center',
        marginHorizontal: 8,
        alignItems: 'center',
    },
    
    missionTitle: {
        color: '#264D84',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5
    },
    
    missionDate: {
        color: '#264D84',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 3
    },
    
    missionSalary: {
        color: '#264D84',
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '600'
    },
    
    missionAddress: {
        color: '#555',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 5
    }
});
