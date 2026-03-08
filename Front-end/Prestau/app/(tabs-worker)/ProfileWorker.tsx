import { StyleSheet, Text, View, TouchableOpacity, useWindowDimensions, Modal } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Header } from "@/components/Header";
import { DefaultCard } from "@/components/DefaultCard";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from "react";
import { logout } from "@/src/api/auth";
import { router } from "expo-router";
import { getWorkerProfile } from "@/src/api/worker";
import { getJobOffersByWorker, getMissionHistory } from "@/src/api/joboffer";
import { MissionHistory } from "@/components/MissionHistory";

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

interface WorkerProfile {
    id: number;
    firstName: string;
    lastName: string;
    city: string;
}

export default function ProfileWorker() {
    const colors = useThemeColors();
    const { scale, scaleFont } = useResponsive();
    const [profile, setProfile] = useState<WorkerProfile | null>(null);
    const [jobCount, setJobCount] = useState(0);
    const [history, setHistory] = useState<any[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        // Simuler le chargement des données du profil
        getWorkerProfile()
            .then((data) => setProfile(data))
            .catch((error) => console.error("Erreur lors de la récupération du profil:", error));

        getJobOffersByWorker()
            .then((data) => {
                const completed = data.filter((offer: any) => offer.status === 'COMPLETED');
                setJobCount(completed.length);
            })
            .catch((error) => console.error("Erreur lors de la récupération des offres de travail:", error));

        getMissionHistory()
            .then((data) => setHistory(data))
            .catch((error) => console.error("Erreur lors de la récupération de l'historique des missions:", error));
    }, []);

    const handleLogout = async () => {
        await logout();
        // Redirige vers la page de login après déconnexion
        router.replace("/login");
    };

    const handleSettings = () => {
        console.log("Paramètres");
        // Navigation vers les paramètres
    };

    return (
        <View style={[styles.page, { backgroundColor: colors.background }]}>
            <Header />

            <ThemedText
                variant="headline"
                color="primary"
                style={[styles.pageTitle, { fontSize: scaleFont(32), paddingTop: scale(25) }]}>
                Profile
            </ThemedText>

            <DefaultCard style={[styles.profileCard, {
                marginHorizontal: scale(25),
                marginTop: scale(20),
                marginBottom: scale(15),
                backgroundColor: colors.primary || "#4A5F8C",
                alignSelf: 'stretch'
            }]}>
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <Ionicons name="person-circle" size={scale(80)} color="#fff" />
                    </View>

                    <View style={styles.profileInfo}>
                        <Text style={[styles.profileName, { fontSize: scaleFont(24) }]}>
                            {profile?.firstName} {profile?.lastName}
                        </Text>
                        <Text style={[styles.profileCity, { fontSize: scaleFont(18) }]}>
                            {profile?.city}
                        </Text>
                    </View>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Ionicons name="checkmark-circle" size={scale(24)} color="#fff" />
                        <Text style={[styles.statText, { fontSize: scaleFont(14) }]}>
                            {jobCount} Missions
                        </Text>
                    </View>

                    <View style={styles.statItem}>
                        <Ionicons name="star" size={scale(24)} color="#fff" />
                        <Text style={[styles.statText, { fontSize: scaleFont(14) }]}>
                            {profile?.rating || 0} Évaluation
                        </Text>
                    </View>

                    <View style={styles.statItem}>
                        <Ionicons name="calendar" size={scale(24)} color="#fff" />
                        <Text style={[styles.statText, { fontSize: scaleFont(14) }]}>
                            {profile?.yearsOfExperience || 0} Année sur l&apos;app
                        </Text>
                    </View>
                </View>
            </DefaultCard>

            <View style={[styles.actionsContainer, { marginHorizontal: scale(25) }]}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.historyButton, { marginBottom: scale(15) }]}
                    onPress={() => setShowHistory(true)}>
                    <Ionicons name="time-outline" size={scale(20)} color="#fff" style={{ marginRight: scale(10) }} />
                    <Text style={[styles.buttonText, { fontSize: scaleFont(18) }]}>
                        Historique des missions
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.settingsButton, { marginBottom: scale(15) }]}
                    onPress={handleSettings}>
                    <Text style={[styles.buttonText, { fontSize: scaleFont(18) }]}>
                        Paramètre du compte
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.logoutButton]}
                    onPress={handleLogout}>
                    <Text style={[styles.buttonText, { fontSize: scaleFont(18) }]}>
                        Se Déconnecter
                    </Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={showHistory}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowHistory(false)}
            >
                <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                    <View style={styles.modalHeader}>
                        <ThemedText
                            variant="headline"
                            color="primary"
                            style={{ fontSize: scaleFont(24), fontWeight: "bold" }}>
                            Missions passées
                        </ThemedText>
                        <TouchableOpacity onPress={() => setShowHistory(false)}>
                            <Ionicons name="close-circle" size={scale(32)} color={colors.primary} />
                        </TouchableOpacity>
                    </View>

                    <MissionHistory 
										missions={history}
										role="WORKER"
										onMissionPress={() => setShowHistory(false)}
										/>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
    },
    pageTitle: {
        textAlign: "center",
        fontWeight: "bold",
    },
    profileCard: {
        padding: 20,
        borderRadius: 15,
    },
    profileHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    avatarContainer: {
        marginRight: 20,
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        color: "#fff",
        fontWeight: "bold",
        marginBottom: 5,
    },
    profileCity: {
        color: "#fff",
    },
    statsContainer: {
        gap: 10,
    },
    statItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    statText: {
        color: "#fff",
        fontWeight: "500",
    },
    actionsContainer: {
        flex: 1,
    },
    sectionTitle: {
        fontWeight: "600",
    },
    actionButton: {
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    historyButton: {
        backgroundColor: "#C9A961",
    },
    settingsButton: {
        backgroundColor: "#8B9DC3",
    },
    logoutButton: {
        backgroundColor: "#D86B6B",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
    },
    modalContainer: {
        flex: 1,
        paddingTop: 60,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 20,
    },
});
