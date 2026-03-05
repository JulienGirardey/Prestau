import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useEffect, useState } from "react";
import { getJobById } from "@/src/api/job";
import { Header } from "@/components/Header";

export default function JobDetailScreen() {
    const { id } = useLocalSearchParams();
    const colors = useThemeColors();
    
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
                <Text style={{ color: "#000000" }}>Job non trouve</Text>
            </View>
        );
    }

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

    return (
		<View style={{ flex: 1 }}>
			<Header />
			<ScrollView style={[styles.main, { backgroundColor: colors.background }]}>
				<View style={styles.content}>
					<Text style={[styles.title, { color: colors.primary }]}>{job.title}</Text>
					
					<View style={[styles.card, { backgroundColor: "#ffffff" }]}>
						<Text style={[styles.salary, { color: colors.secondary }]}>{job.salary} €</Text>
						<Text style={[styles.description, { color: "#000000" }]}>{job.description}</Text>
						<Text style={{ color: "#000000" }}>Date: {formatDate(job.start_time)}</Text>
						<Text style={{ color: "#000000" }}>Heure: {formatTime(job.start_time)} - {formatTime(job.end_time)}</Text>
						
						<View style={styles.infoRow}>
							<Text style={{ color: "#000000", fontWeight: 'bold' }}>Adresse: </Text>
							<Text style={{ color: "#000000" }}>{job.address}</Text>
						</View>
					</View>
				</View>
			</ScrollView>
		</View>
    );
}

const styles = StyleSheet.create({
    main: { flex: 1 },
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    content: { padding: 20 },
    title: { fontSize: 28, fontWeight: "bold", marginBottom: 15 },
    card: { padding: 15, borderRadius: 12, backgroundColor: 'rgba(150, 150, 150, 0.1)' },
    salary: { fontSize: 22, fontWeight: '700', marginBottom: 10 },
    description: { fontSize: 16, lineHeight: 24, marginBottom: 20 },
    infoRow: { flexDirection: 'row', marginTop: 10 }
});