import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, useWindowDimensions } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useEffect, useState } from "react";
import { getJobById } from "@/src/api/job";
import { Header } from "@/components/Header";
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
    };
}

export default function JobDetailScreen() {
    const { id } = useLocalSearchParams();
    const colors = useThemeColors();
    const { scale, scaleFont } = useResponsive();
    
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            setLoading(true);
            getJobById(Number(id))
                .then((data) => {
                    setJob(data);
                })
                .catch((err) => console.error("Error :", err))
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!job) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={{ color: colors.text }}>Job non trouvé</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <Header />
            <ScrollView style={[styles.main, { backgroundColor: colors.background }]}>
                <View style={[styles.jobCard, { backgroundColor: 'white', margin: scale(25) }]}>
                    {/* Header de la carte */}
                    <View style={styles.jobHeader}>
                        <Text style={[styles.jobTitle, { fontSize: scaleFont(20) }]}>{job.title}</Text>
                        <View style={styles.salaryBadge}>
                            <Text style={[styles.salaryText, { fontSize: scaleFont(15) }]}>{job.salary}€</Text>
                        </View>
                    </View>

                    {/* Adresse */}
                    <View style={styles.addressRow}>
                        <Text style={[styles.addressTitle, { fontSize: scaleFont(14) }]}>Adresse:</Text>
                        <Text style={[styles.addressText, { fontSize: scaleFont(13) }]}>{job.address}</Text>
                    </View>

                    {/* Description */}
                    <Text style={[styles.addressTitle, { fontSize: scaleFont(14) }]}>Description:</Text>
                    <Text style={[styles.jobDescription, { fontSize: scaleFont(13) }]}>{job.description}</Text>

                    {/* Séparateur */}
                    <View style={styles.separator} />

                    {/* Dates */}
                    <View style={styles.dateRow}>
                        <View style={styles.dateItem}>
                            <Text style={[styles.dateLabel, { fontSize: scaleFont(11) }]}>Début</Text>
                            <Text style={[styles.dateValue, { fontSize: scaleFont(12) }]}>
                                {new Date(job.start_time).toLocaleDateString('fr-FR')}
                            </Text>
                            <Text style={[styles.dateValue, { fontSize: scaleFont(11), color: "#666" }]}>
                                {new Date(job.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </View>
                        <View style={styles.dateSeparator} />
                        <View style={styles.dateItem}>
                            <Text style={[styles.dateLabel, { fontSize: scaleFont(11) }]}>Fin</Text>
                            <Text style={[styles.dateValue, { fontSize: scaleFont(12) }]}>
                                {new Date(job.end_time).toLocaleDateString('fr-FR')}
                            </Text>
                            <Text style={[styles.dateValue, { fontSize: scaleFont(11), color: "#666" }]}>
                                {new Date(job.end_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </View>
                    </View>
                </View>
					<View style={styles.buttonCreateAccount}> 
                    	<NewButton title="Postule" onPress={() => console.log("Postule cliqué")} /> 
                    </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    main: { flex: 1 },
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    jobCard: {
        borderRadius: 12,
        padding: 16,
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
        marginBottom: 10,
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
        fontWeight: "500",
    },
    addressText: {
        color: "#888",
        fontStyle: "italic",
    },
  buttonCreateAccount: {
	marginTop: "1%",
    width: "100%",
    paddingHorizontal: "5%",
  },
});