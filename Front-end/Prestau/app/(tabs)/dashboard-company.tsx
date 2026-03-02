import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Header } from "@/components/Header";
import { DefaultCard } from "@/components/DefaultCard";
import { getJobs } from "@/src/api/job";
import { useState, useEffect } from "react";
import { ThemedText } from "@/components/ThemedText";

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
                            <Text style={[styles.jobTitle, { fontSize: scaleFont(16) }]}>{job.title}</Text>
                            <Text style={[styles.jobDescription, { fontSize: scaleFont(13) }]}>{job.description}</Text>
                        </View>
                    ))}
                </ScrollView>
            </DefaultCard>
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
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        marginHorizontal: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    jobTitle: {
        fontWeight: "bold",
        marginBottom: 5,
    },
    jobDescription: {
        color: "#666",
    },
});
