import { StyleSheet, Text, View, ActivityIndicator, FlatList } from "react-native"; 
import { useThemeColors } from "@/hooks/useThemeColors";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/Header";
import { DefaultCard } from "@/components/DefaultCard";
import { useState, useEffect } from "react";
import { Ionicons } from '@expo/vector-icons';
import { getMissions, Mission } from "@/src/api/mission";
import * as SecureStore from 'expo-secure-store';

export default function MissionScreen() {
    const colors = useThemeColors();
    const [missions, setMissions] = useState<Mission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        initAndLoad();
    }, []);
	// Fonction pour initialiser le token et charger les missions POUR LES TESTS UNIQUEMENT, À SUPPRIMER EN PRODUCTION
    const initAndLoad = async () => {
        const token = await SecureStore.getItemAsync('token');
        if (!token) {
            await SecureStore.setItemAsync('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IndvcmtlcjFAdGVzdC5jb20iLCJzdWIiOjE3LCJyb2xlIjoiV09SS0VSIiwiaWF0IjoxNzcyNDYwMDUyLCJleHAiOjE3NzMwNjQ4NTJ9.-AtkF2uhbvuqrJIle5ZFiYLCtipdq4_4ck5z2w_skTY');
        }
        await loadMissions();
    };

    const loadMissions = async () => {
        setIsLoading(true);
        try {
            const data = await getMissions();
            setMissions(data);
            setError(null);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Erreur de connexion');
        }
        setIsLoading(false);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', { 
            day: '2-digit', 
            month: 'short',
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
        <DefaultCard style={[styles.card, { backgroundColor: colors.cardBackground || "#ffffff" }]}>
            <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                    <Ionicons name="briefcase" size={40} color={colors.primary || "#007AFF"} />
                    {item.status === 'OPEN' && <View style={styles.openBadge} />}
                </View>
                <View style={styles.missionContent}>
                    <View style={styles.headerRow}>
                        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                            {item.title}
                        </Text>
                        <Text style={[styles.salary, { color: colors.primary || "#007AFF" }]}>
                            {item.salary}€/h
                        </Text>
                    </View>
                    {item.description && (
                        <Text 
                            style={[styles.description, { color: colors.textSecondary || "#666" }]}
                            numberOfLines={1}
                        >
                            {item.description}
                        </Text>
                    )}
                    <View style={styles.infoRow}>
                        <Ionicons name="location-outline" size={14} color={colors.textSecondary || "#666"} />
                        <Text style={[styles.infoText, { color: colors.textSecondary || "#666" }]} numberOfLines={1}>
                            {item.address}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="calendar-outline" size={14} color={colors.textSecondary || "#666"} />
                        <Text style={[styles.infoText, { color: colors.textSecondary || "#666" }]}>
                            {formatDate(item.start_time)} • {formatTime(item.start_time)} - {formatTime(item.end_time)}
                        </Text>
                    </View>
                </View>
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
                
                {error && (
                    <View style={[styles.errorContainer, { backgroundColor: '#FF3B30' }]}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

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
                        refreshing={isLoading}
                        onRefresh={loadMissions}
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
        alignItems: 'flex-start',
        gap: 12,
    },
    iconContainer: {
        position: 'relative',
        paddingTop: 5,
    },
    openBadge: {
        position: 'absolute',
        top: 5,
        right: -2,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4CAF50',
        borderWidth: 2,
        borderColor: '#fff',
    },
    missionContent: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        flex: 1,
        marginRight: 8,
    },
    salary: {
        fontSize: 16,
        fontWeight: "700",
    },
    description: {
        fontSize: 14,
        marginBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 6,
    },
    infoText: {
        fontSize: 13,
        flex: 1,
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
    errorContainer: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    errorText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 14,
    },
});
