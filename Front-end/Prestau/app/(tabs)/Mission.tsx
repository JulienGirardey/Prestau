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
        loadMissions();
    }, []);

    const loadMissions = async () => {
        setIsLoading(true);
        try {
            setMissions(await getMissions());
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
        <DefaultCard style={styles.card}>
            <View style={styles.cardHeader}>
                <Ionicons name="briefcase" size={24} color={colors.primary} />
                <Text style={[styles.missionTitle, { color: colors.primary }]}>
                    {item.title}
                </Text>
            </View>
            
            {item.description && (
                <Text style={[styles.description, { color: colors.inactive }]} numberOfLines={2}>
                    {item.description}
                </Text>
            )}

            <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={18} color={colors.inactive} />
                <Text style={[styles.infoText, { color: colors.inactive }]}>
                    {formatTime(item.start_time)} - {formatTime(item.end_time)}
                </Text>
            </View>

            <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={18} color={colors.inactive} />
                <Text style={[styles.infoText, { color: colors.inactive }]}>
                    {formatDate(item.start_time)}
                </Text>
            </View>

            <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={18} color={colors.inactive} />
                <Text style={[styles.infoText, { color: colors.inactive }]} numberOfLines={1}>
                    {item.address}
                </Text>
            </View>

            <View style={styles.infoRow}>
                <Ionicons name="cash-outline" size={18} color={colors.secondary} />
                <Text style={[styles.salaryText, { color: colors.secondary }]}>
                    {item.salary}€/h
                </Text>
            </View>

            <View style={[styles.statusBadge, { 
                backgroundColor: item.status === 'OPEN' ? '#4CAF50' : '#FFA500' 
            }]}>
                <Text style={styles.statusText}>
                    {item.status === 'OPEN' ? 'Ouvert' : item.status}
                </Text>
            </View>
        </DefaultCard>
    );

    if (isLoading) {
        return (
            <View style={{ flex: 1 }}>
                <Header />
                <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                    <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
                    <Text style={{ color: colors.inactive, textAlign: 'center', marginTop: 20 }}>
                        Chargement des missions...
                    </Text>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}> 
            <Header />
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={[styles.pageTitle, { color: colors.primary }]}>
                    Missions disponibles
                </Text>
                
                {error && (
                    <View style={[styles.errorContainer, { backgroundColor: colors.secondary }]}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                {missions.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="briefcase-outline" size={60} color={colors.inactive} />
                        <Text style={[styles.emptyText, { color: colors.inactive }]}>
                            Aucune mission disponible pour le moment
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
    pageTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    card: {
        marginBottom: 15,
        width: '100%',
        position: 'relative',
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
    description: {
        fontSize: 14,
        marginBottom: 12,
        lineHeight: 20,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 8,
    },
    infoText: {
        fontSize: 14,
        flex: 1,
    },
    salaryText: {
        fontSize: 16,
        fontWeight: "600",
    },
    statusBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
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
        textAlign: 'center',
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
