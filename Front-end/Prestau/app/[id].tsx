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
                <Text style={{ color: colors.text }}>Job non trouve</Text>
            </View>
        );
    }

    return (
		<View style={{ flex: 1 }}>
			<Header />
			<ScrollView style={[styles.main, { backgroundColor: colors.background }]}>
				<View style={styles.content}>
					<Text style={[styles.title, { color: colors.text }]}>{job.title}</Text>
					
					<View style={[styles.card, { backgroundColor: "#ffffff" }]}>
						<Text style={[styles.salary, { color: colors.primary }]}>{job.salary} €</Text>
						<Text style={[styles.description, { color: colors.text }]}>{job.description}</Text>
						<Text style={{ color: colors.text, fontWeight: 'bold' }}>Date de debut: <Text style={{ fontWeight: 'normal' }}>{new Date(job.startDate).toLocaleDateString('fr-FR')}</Text></Text>
						<Text style={{ color: colors.text, fontWeight: 'bold' }}>Date de fin: <Text style={{ fontWeight: 'normal' }}>{new Date(job.endDate).toLocaleDateString('fr-FR')}</Text></Text>
						
						
						<View style={styles.infoRow}>
							<Text style={{ color: colors.text, fontWeight: 'bold' }}>Adresse: </Text>
							<Text style={{ color: colors.text }}>{job.address}</Text>
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