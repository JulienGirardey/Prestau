import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    ScrollView,
    RefreshControl,
    Pressable,
    TextInput,
    useWindowDimensions,
} from "react-native";
import { useState, useMemo, useCallback } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from "@/hooks/useThemeColors";
import { Header } from "@/components/Header";
import { DefaultCard } from "@/components/DefaultCard";
import { ThemedText } from "@/components/ThemedText";
import { getJobs, Job } from "@/src/api/job";
import { useFocusEffect, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";

// Hook pour la gestion de l'adaptabilité (Responsive)
function useResponsive() {
    const { width, height } = useWindowDimensions();
    const scale = (size: number) => (width / 390) * size;
    const scaleFont = (size: number) => Math.min(scale(size), size * 1.4);
    return {
        width,
        height,
        scale,
        scaleFont,
    };
}

// Écran principal de la section "Missions" pour les workers, affichant la liste des missions disponibles avec des filtres de recherche et de salaire
export default function MissionScreen() {
    const colors = useThemeColors();
    const { scale, scaleFont } = useResponsive();
    const styles = getStyles(scale, scaleFont);
    const router = useRouter();

    // États des filtres
    const [searchText, setSearchText] = useState('');
    const [salaryFilter, setSalaryFilter] = useState<'all' | 'lt10' | '10to12' | '12to15' | '15to20' | 'gt20'>('all');
    const [debouncedQuery, setDebouncedQuery] = useState("");
    // Récupération des jobs depuis l'API avec React Query
    const { data: jobs = [], isLoading: isLoadingJob, error: errorJob, refetch } = useQuery<Job[]>({
        queryKey: ["dashboard-worker-jobs", debouncedQuery],
        queryFn: () => getJobs(debouncedQuery || undefined),
        refetchInterval: 60_000,
        staleTime: 0,
    });

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch])
    );

    // Liste des filtres de salaire disponibles (labels affichés dans les chips)
    const SALARY_FILTERS = [
        { key: 'all', label: 'Tous' },
        { key: 'lt10', label: '< 10€' },
        { key: '10to12', label: '10-12€' },
        { key: '12to15', label: '12-15€' },
        { key: '15to20', label: '15-20€' },
        { key: 'gt20', label: '> 20€' },
    ] as const;

    // Jobs filtrés selon le salaire
    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            if (salaryFilter === 'lt10') return job.salary < 10;
            if (salaryFilter === '10to12') return job.salary >= 10 && job.salary < 12;
            if (salaryFilter === '12to15') return job.salary >= 12 && job.salary < 15;
            if (salaryFilter === '15to20') return job.salary >= 15 && job.salary < 20;
            if (salaryFilter === 'gt20') return job.salary >= 20;
            return true;
        });
    }, [jobs, salaryFilter]);

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

    // Affichage de l'état de chargement initial
    if (isLoadingJob && jobs.length === 0) {
        return (
            <View style={{ flex: 1, backgroundColor: colors.background }}>
                <Header />
                <SafeAreaView style={styles.container}>
                    <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
                    <Text style={[styles.loadingText, { color: "#666" }]}>
                        Chargement des missions...
                    </Text>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={[styles.page, { backgroundColor: colors.background }]}>
            <Header />
            <ThemedText
                variant="headline"
                color="primary"
                style={styles.pageTitle}>
                Missions disponibles
            </ThemedText>

            {/* BARRE DE RECHERCHE & FILTRES */}
            <View style={styles.searchBlock}>
                <View style={styles.searchInputWrapper}>
                    <Ionicons name="search-outline" size={scale(18)} color="#888" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Lieu ou type de mission..."
                        placeholderTextColor="#aaa"
                        value={searchText}
                        onChangeText={(text) => {
                            setSearchText(text);
                            // Réinitialise la recherche et le filtre si le champ est vidé
                            if (text === '') {
                                setDebouncedQuery('');
                                setSalaryFilter('all');
                            }
                        }}
                        // La recherche API se déclenche uniquement à la validation (touche Entrée)
                        onSubmitEditing={() => setDebouncedQuery(searchText)}
                        returnKeyType="search"
                        clearButtonMode="while-editing"
                    />
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filterScrollView}
                    contentContainerStyle={styles.filterScrollContent}
                >
                    {SALARY_FILTERS.map(f => (
                        <Pressable
                            key={f.key}
                            onPress={() => setSalaryFilter(f.key)}
                            style={[styles.filterChip,
                                salaryFilter === f.key && styles.filterChipActive
                            ]}
                        >
                            <Text style={[styles.filterChipText,
                                salaryFilter === f.key && styles.filterChipTextActive
                            ]}>{f.label}</Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>

            <DefaultCard style={styles.card}>
                <ScrollView
                    style={styles.scroll}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoadingJob}
                            onRefresh={refetch}
                            tintColor={colors.primary}
                        />
                    }
                >
                    {errorJob && (
                        <View style={styles.errorContainer}>
                            <Ionicons name="alert-circle" size={20} color="#fff" />
                            <Text style={styles.errorText}>Erreur lors de la récupération des missions</Text>
                        </View>
                    )}

                    {filteredJobs.length === 0 && !isLoadingJob ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="briefcase-outline" size={60} color={"#666"} />
                            <Text style={[styles.emptyText, { color: "#666" }]}>
                                {jobs.length === 0 ? "Aucune mission disponible pour le moment" : "Aucune mission ne correspond à votre recherche"}
                            </Text>
                        </View>
                    ) : (
                        filteredJobs.map((job) => (
                            <View key={job.id} style={[styles.jobCard, { backgroundColor: colors.background }]}>
                                <Pressable
                                    onPress={() => router.push({
                                        pathname: '/job/[id]',
                                        params: { id: job.id }
                                    })}
									style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                                >
                                    {/* Header de la carte */}
                                    <View style={styles.jobHeader}>
                                        <Text style={styles.jobTitle}>{job.title}</Text>
                                        <View style={styles.salaryBadge}>
                                            <Text style={styles.salaryText}>{job.salary}€</Text>
                                        </View>
                                    </View>

                                    {/* Adresse */}
                                    <View style={styles.addressRow}>
                                        <Text style={styles.addressTitle}>Adresse:</Text>
                                    </View>
                                    <Text style={styles.addressText} numberOfLines={2} ellipsizeMode="tail">
                                        {job.company?.address}{job.company?.city ? `, ${job.company.city}` : ""} {job.company?.postalCode ? `(${job.company.postalCode})` : ""}
                                    </Text>

                                    {/* Description */}
                                    {job.description && (
                                        <>
                                            <Text style={[styles.addressTitle, styles.descriptionLabel]}>Description:</Text>
                                            <Text style={styles.jobDescription} numberOfLines={2} ellipsizeMode="tail">
                                                {job.description}
                                            </Text>
                                        </>
                                    )}

                                    {/* Séparateur */}
                                    <View style={styles.separator} />

                                    {/* Dates et Horaires */}
                                    <View style={styles.dateRow}>
                                        <View style={styles.dateItem}>
                                            <Text style={styles.dateLabel}>Début</Text>
                                            <Text style={styles.dateValue}>
                                                {formatDate(job.start_time)}
                                            </Text>
                                            <Text style={styles.timeText}>{formatTime(job.start_time)}</Text>
                                        </View>
                                        <View style={styles.dateSeparator} />
                                        <View style={styles.dateItem}>
                                            <Text style={styles.dateLabel}>Fin</Text>
                                            <Text style={styles.dateValue}>
                                                {formatDate(job.end_time)}
                                            </Text>
                                            <Text style={styles.timeText}>{formatTime(job.end_time)}</Text>
                                        </View>
                                    </View>
                                </Pressable>
                            </View>
                        ))
                    )}
                </ScrollView>
            </DefaultCard>
        </View>
    );
}

const getStyles = (scale: (n: number) => number, scaleFont: (n: number) => number) =>
    StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
        },
        page: {
            flex: 1,
        },
        pageTitle: {
            fontWeight: "bold",
            textAlign: "center",
            fontSize: scaleFont(24),
            paddingTop: scale(25),
        },
        loader: {
            marginTop: 50,
        },
        loadingText: {
            textAlign: 'center',
            marginTop: 12,
            fontSize: 14,
        },
        card: {
            flex: 1,
            alignSelf: "stretch",
            margin: scale(25),
            marginBottom: scale(30),
            marginTop: scale(5),
            paddingBottom: scale(5),
        },
        scroll: {
            flex: 1,
            paddingHorizontal: 10,
        },
        jobCard: {
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        jobHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
        },
        jobTitle: {
            fontWeight: "bold",
            flex: 1,
            marginRight: 10,
            fontSize: scaleFont(17),
        },
        salaryBadge: {
            backgroundColor: "#4a90d9",
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 20,
        },
        salaryText: {
            color: "#fff",
            fontWeight: "600",
            fontSize: scaleFont(13),
        },
        jobDescription: {
            color: "#666",
            lineHeight: 20,
            fontSize: scaleFont(12),
            marginLeft: scale(10),
        },
        separator: {
            height: 1,
            backgroundColor: "#e0e0e0",
            marginVertical: 10,
        },
        dateRow: {
            flexDirection: "row",
            alignItems: "center",
        },
        dateItem: {
            flex: 1,
            alignItems: "center",
        },
        dateLabel: {
            color: "#999",
            fontWeight: "500",
            marginBottom: 2,
            fontSize: scaleFont(11),
        },
        dateValue: {
            color: "#333",
            fontWeight: "600",
            fontSize: scaleFont(12),
        },
        timeText: {
            fontSize: scaleFont(10),
            color: '#666',
        },
        dateSeparator: {
            width: 1,
            height: 30,
            backgroundColor: "#e0e0e0",
        },
        addressRow: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 2,
        },
        addressTitle: {
            marginRight: 6,
            fontWeight: "500",
            fontSize: scaleFont(14),
        },
        addressText: {
            color: "#888",
            fontSize: scaleFont(12),
            marginLeft: scale(10),
        },
        descriptionLabel: {
            marginTop: 4,
        },
        emptyState: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 60,
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
        searchBlock: {
            width: '100%',
            paddingHorizontal: scale(25),
            marginBottom: scale(19),
        },
        searchInputWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: scale(10),
            paddingHorizontal: scale(12),
            height: scale(42),
        },
        searchInput: {
            flex: 1,
            color: '#333',
            fontSize: scaleFont(14),
            marginLeft: scale(8),
        },
        filterScrollView: {
            marginTop: scale(10),
        },
        filterScrollContent: {
            gap: scale(8),
        },
        filterChip: {
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#ddd',
            paddingHorizontal: scale(14),
            paddingVertical: scale(6),
            borderRadius: scale(20),
        },
        filterChipActive: {
            backgroundColor: '#264D84',
            borderColor: '#264D84',
        },
        filterChipText: {
            color: '#555',
            fontWeight: '500',
            fontSize: scaleFont(13),
        },
        filterChipTextActive: {
            color: '#fff',
        },
    });
