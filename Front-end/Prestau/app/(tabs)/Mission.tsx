import { ScrollView, StyleSheet, Text, View, ActivityIndicator, FlatList } from "react-native"; 
import { useThemeColors } from "@/hooks/useThemeColors";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/Header";
import { DefaultCard } from "@/components/DefaultCard";
import { useState, useEffect } from "react";
import { Ionicons } from '@expo/vector-icons';

interface Mission {
    id: number;
    title: string;
    start_time: string;
    end_time: string;
    salary: number;
    address: string;
}

export default function Mission() {
    const colors = useThemeColors();
    const [missions, setMissions] = useState<Mission[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simuler le chargement avec des données d'exemple
        setTimeout(() => {
            setMissions([
                {
                    id: 1,
                    title: "Serveur Restaurant Gastronomique",
                    start_time: "2024-03-15T19:00:00",
                    end_time: "2024-03-15T23:30:00",
                    salary: 15,
                    address: "123 Avenue des Champs-Élysées, Paris"
                },
                {
                    id: 2,
                    title: "Barman Événement Privé",
                    start_time: "2024-03-16T18:00:00",
                    end_time: "2024-03-17T02:00:00",
                    salary: 18,
                    address: "45 Rue de Rivoli, Paris"
                },
                {
                    id: 3,
                    title: "Chef de Rang Mariage",
                    start_time: "2024-03-20T12:00:00",
                    end_time: "2024-03-20T22:00:00",
                    salary: 20,
                    address: "Château de Versailles, Versailles"
                },
                {
                    id: 4,
                    title: "Plongeur Restaurant Étoilé",
                    start_time: "2024-03-18T17:00:00",
                    end_time: "2024-03-18T23:00:00",
                    salary: 12,
                    address: "78 Boulevard Saint-Germain, Paris"
                },
                {
                    id: 5,
                    title: "Serveur Brunch Hôtel 5 étoiles",
                    start_time: "2024-03-17T09:00:00",
                    end_time: "2024-03-17T15:00:00",
                    salary: 16,
                    address: "15 Place Vendôme, Paris"
                },
                {
                    id: 6,
                    title: "Commis de Cuisine Banquet",
                    start_time: "2024-03-22T10:00:00",
                    end_time: "2024-03-22T18:00:00",
                    salary: 14,
                    address: "90 Rue du Faubourg Saint-Honoré, Paris"
                },
                {
                    id: 7,
                    title: "Barista Coffee Shop",
                    start_time: "2024-03-19T07:00:00",
                    end_time: "2024-03-19T14:00:00",
                    salary: 13,
                    address: "32 Rue Montmartre, Paris"
                },
                {
                    id: 8,
                    title: "Maître d'Hôtel Soirée Gala",
                    start_time: "2024-03-25T19:00:00",
                    end_time: "2024-03-26T01:00:00",
                    salary: 25,
                    address: "Hôtel Le Bristol, Paris"
                },
                {
                    id: 9,
                    title: "Aide Cuisine Fast-Food Premium",
                    start_time: "2024-03-21T11:00:00",
                    end_time: "2024-03-21T19:00:00",
                    salary: 11,
                    address: "56 Avenue Montaigne, Paris"
                },
                {
                    id: 10,
                    title: "Serveur Terrasse Brasserie",
                    start_time: "2024-03-23T12:00:00",
                    end_time: "2024-03-23T22:00:00",
                    salary: 14,
                    address: "101 Boulevard Haussmann, Paris"
                }
            ]);
            setIsLoading(false);
        }, 1000);
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', { 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric' 
        });
    };

    const formatTime = (timeString: string) => {
        const date = new Date(timeString);
        return date.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    const renderMissionCard = ({ item }: { item: Mission }) => (
        <DefaultCard style={[styles.card, { backgroundColor: colors.cardBackground || "#fff" }]}>
            <View style={styles.cardHeader}>
                <Ionicons name="briefcase" size={24} color={colors.primary || "#007AFF"} />
                <Text style={[styles.missionTitle, { color: colors.text }]}>
                    {item.title}
                </Text>
            </View>
            <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={18} color={colors.textSecondary || "#666"} />
                <Text style={[styles.infoText, { color: colors.textSecondary || "#666" }]}>
                    {formatTime(item.start_time)} - {formatTime(item.end_time)}
                </Text>
            </View>
            <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={18} color={colors.textSecondary || "#666"} />
                <Text style={[styles.infoText, { color: colors.textSecondary || "#666" }]}>
                    {formatDate(item.start_time)}
                </Text>
            </View>
            <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={18} color={colors.textSecondary || "#666"} />
                <Text style={[styles.infoText, { color: colors.textSecondary || "#666" }]}>
                    {item.address}
                </Text>
            </View>
            <View style={styles.infoRow}>
                <Ionicons name="cash-outline" size={18} color="#4CAF50" />
                <Text style={[styles.salaryText, { color: "#4CAF50" }]}>
                    {item.salary}€/h
                </Text>
            </View>
        </DefaultCard>
    );

    if (isLoading) {
        return (
            <View style={{ flex: 1 }}>
                <Header />
                <SafeAreaView style={[styles.container, { backgroundColor: colors.background }, { paddingTop: 0 }]}>
                    <ActivityIndicator size="large" color={colors.primary || "#007AFF"} style={{ marginTop: 50 }} />
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}> 
            <Header />
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }, { paddingTop: 0 }]}>
                <Text style={{ color: colors.text, fontSize: 24, fontWeight: "bold", marginBottom: 20, alignSelf: "center" }}>
                    Missions
                </Text>
                {missions.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="briefcase-outline" size={60} color={colors.textSecondary || "#666"} />
                        <Text style={[styles.emptyText, { color: colors.textSecondary || "#666" }]}>
                            Aucune mission disponible
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={missions}
                        renderItem={renderMissionCard}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                )}
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    card: {
        marginBottom: 15,
        width: '100%',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 10,
    },
    missionTitle: {
        fontSize: 18,
        fontWeight: "700",
        flex: 1,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 8,
    },
    infoText: {
        fontSize: 14,
    },
    salaryText: {
        fontSize: 16,
        fontWeight: "600",
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 16,
        marginTop: 12,
    },
});
