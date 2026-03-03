import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Header } from "@/components/Header";
import { DefaultCard } from "@/components/DefaultCard";
import { getJobs } from "@/src/api/job";
import { useState, useEffect } from "react";
import { ThemedText } from "@/components/ThemedText";
import { NewButton } from "@/components/Button";

function useResponsive() {
    const { width, height } = useWindowDimensions();
    const scale = (size: number) => (width / 390) * size;
    const scaleFont = (size: number) => Math.min(scale(size), size * 1.4);
    return {
        width,
        height,
        scale,
        scaleFont,
        columns: width >= 600 ? 2 : 1,
    };
}

export default function DashboardCompany() {
    const colors = useThemeColors();
    const [jobs, setJobs] = useState([]);
    const { scale, scaleFont } = useResponsive();

    useEffect(() => {
        getJobs()
            .then((response) => setJobs(response.data))
            .catch((error) => console.error("Erreur lors de la récupération des jobs:", error));
    }, []);

    return (
        <View style={[styles.page, { backgroundColor: colors.background }]}>
            <Header />
            <ThemedText
                variant="headline"
                color="primary"
                style={[styles.pageTitle, { fontSize: scaleFont(24), paddingTop: scale(25) }]}>
                Missions postées
            </ThemedText>
            <DefaultCard style={[styles.card, { margin: scale(25), marginBottom: scale(30), marginTop: scale(20), paddingBottom: scale(5) }]}>
                <ScrollView
                    style={styles.scroll}
                    showsVerticalScrollIndicator={false}
                >
                    {jobs.map((job: any) => (
                        <View key={job.id} style={[styles.jobCard, { backgroundColor: colors.background }]}>
                            {/* Header de la carte */}
                            <View style={styles.jobHeader}>
                                <Text style={[styles.jobTitle, { fontSize: scaleFont(17) }]}>{job.title}</Text>
                                <View style={styles.salaryBadge}>
                                    <Text style={[styles.salaryText, { fontSize: scaleFont(13) }]}>{job.salary}€</Text>
                                </View>
                            </View>

                            {/* Adresse */}
                            <View style={styles.addressRow}>
                                <Text style={[styles.addressTitle, { fontSize: scaleFont(14) }]}>Adresse:</Text>
                                <Text style={[styles.addressText, { fontSize: scaleFont(13) }]}>{job.address}</Text>
                            </View>

                            {/* Description */}
                            <Text style={[styles.addressTitle, { fontSize: scaleFont(14) }]}>Description:</Text>
                            <Text
                                style={[styles.jobDescription, { fontSize: scaleFont(13) }]}
                                numberOfLines={2}
                            >
                                {job.description}
                            </Text>

                            {/* Séparateur */}
                            <View style={styles.separator} />

                            {/* Dates */}
                            <View style={styles.dateRow}>
                                <View style={styles.dateItem}>
                                    <Text style={[styles.dateLabel, { fontSize: scaleFont(11) }]}>Début</Text>
                                    <Text style={[styles.dateValue, { fontSize: scaleFont(12) }]}>
                                        {new Date(job.start_time).toLocaleDateString()}
                                    </Text>
                                </View>
                                <View style={styles.dateSeparator} />
                                <View style={styles.dateItem}>
                                    <Text style={[styles.dateLabel, { fontSize: scaleFont(11) }]}>Fin</Text>
                                    <Text style={[styles.dateValue, { fontSize: scaleFont(12) }]}>
                                        {new Date(job.end_time).toLocaleDateString()}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </DefaultCard>
            <View style={styles.buttonContainer}>
                <NewButton title="Avis" onPress={() => console.log("Voir les avis")} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
    },
    pageTitle: {
        textAlign: "center",
    },
    card: {
        flex: 1,
        alignSelf: "stretch",
    },
    scroll: {
        flex: 1,
    },
    jobCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        marginHorizontal: 5,
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
    },
    jobDescription: {
        color: "#666",
        lineHeight: 20,
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
    },
    dateValue: {
        color: "#333",
        fontWeight: "600",
    },
    dateSeparator: {
        width: 1,
        height: 30,
        backgroundColor: "#e0e0e0",
    },
    addressRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    addressTitle: {
        marginRight: 6,
    },
    addressText: {
        color: "#888",
        fontStyle: "italic",
    },
    buttonContainer: {
        paddingHorizontal: 25,
        paddingBottom: 20,
        alignItems: "center",
    },
});
