import { StyleSheet, Text, View, ActivityIndicator, FlatList, RefreshControl } from "react-native"; 
import { useThemeColors } from "@/hooks/useThemeColors";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/Header";
import { DefaultCard } from "@/components/DefaultCard";
import { useState, useEffect } from "react";
import { Ionicons } from '@expo/vector-icons';
import { getJobs, Job } from "@/src/api/job";

export default function MissionScreen() {
    const colors = useThemeColors();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadJobs();
    }, []);

    // Charge les jobs depuis l'API
    const loadJobs = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const data = await getJobs();
            setJobs(data);
        } catch (err: any) {
            const message = err?.response?.data?.message || 'Impossible de charger les missions';
            setError(message);
            console.error('Erreur chargement missions:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Formate la date au format français
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', { 
            day: '2-digit', 
            month: 'short',
            year: 'numeric'
        });
    };

    // Formate l'heure au format français
    const formatTime = (timeString: string) => {
        const date = new Date(timeString);
        return date.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    // Rendu d'une carte de mission
    const renderJobCard = ({ item }: { item: Job }) => (
        <DefaultCard style={[styles.card, { backgroundColor: "#ffffff" }]}>
            <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                    <Ionicons name="briefcase" size={40} color={colors.primary || "#007AFF"} />
                    {item.status === 'OPEN' && <View style={styles.openBadge} />}
                </View>
                
                <View style={styles.jobContent}>
                    <View style={styles.headerRow}>
                        <Text style={[styles.title, { color: colors.primary}]} numberOfLines={1}>
                            {item.title}
                        </Text>
                        <Text style={[styles.salary, { color: colors.primary || "#007AFF" }]}>
                            {item.salary}€/h
                        </Text>
                    </View>
                    
                    {item.description && (
                        <Text 
                            style={[styles.description, { color: "#666" }]}
                            numberOfLines={1}
                        >
                            {item.description}
                        </Text>
                    )}
                    
                    <View style={styles.infoRow}>
                        <Ionicons name="location-outline" size={14} color={colors.secondary || "#666"} />
                        <Text style={[styles.infoText, { color: "#666" }]} numberOfLines={1}>
                            {item.address}
                        </Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <Ionicons name="calendar-outline" size={14} color={colors.secondary || "#666"} />
                        <Text style={[styles.infoText, { color: colors.primary || "#666" }]}>
                            {formatDate(item.start_time)} • {formatTime(item.start_time)} - {formatTime(item.end_time)}
                        </Text>
                    </View>
                </View>
            </View>
        </DefaultCard>
    );

    // Affichage du chargement
    if (isLoading && jobs.length === 0) {
        return (
            <View style={{ flex: 1 }}>
                <Header />
                <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                    <ActivityIndicator size="large" color={colors.primary || "#007AFF"} style={styles.loader} />
                    <Text style={[styles.loadingText, { color: colors.secondary }]}>
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
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle" size={20} color="#fff" />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                {jobs.length === 0 && !isLoading ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="briefcase-outline" size={60} color={colors.secondary || "#666"} />
                        <Text style={[styles.emptyText, { color: colors.secondary || "#666" }]}>
                            Aucune mission disponible pour le moment
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={jobs}
                        renderItem={renderJobCard}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                        refreshControl={
                            <RefreshControl
                                refreshing={isLoading}
                                onRefresh={loadJobs}
                                tintColor={colors.primary}
                            />
                        }
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
    loader: {
        marginTop: 50,
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 12,
        fontSize: 14,
    },
    listContent: {
        paddingBottom: 20,
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
    jobContent: {
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
        textAlign: 'center',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: '#FF3B30',
    },
    errorText: {
        color: '#fff',
        fontSize: 14,
        flex: 1,
    },
});
