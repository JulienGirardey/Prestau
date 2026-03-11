import { StyleSheet, Text, View, TouchableOpacity, useWindowDimensions, Modal } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Header } from "@/components/Header";
import { DefaultCard } from "@/components/DefaultCard";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from '@expo/vector-icons';
import { useState} from "react";
import { logout } from "@/src/api/auth";
import { useRouter } from "expo-router";
import { getWorkerProfile } from "@/src/api/worker";
import { getMissionHistory } from "@/src/api/joboffer";
import { MissionHistory } from "@/components/MissionHistory";
import { useQuery } from "@tanstack/react-query";

// Hook personnalisé pour gérer la responsivité en fonction de la taille de l'écran
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

// Composant de page de profil pour les workers, affichant les informations personnelles, les statistiques d'activité et un accès à l'historique des missions passées
// Permet également de se déconnecter et d'accéder aux paramètres du compte
export default function ProfileWorker() {
    const colors = useThemeColors();
    const { scale, scaleFont } = useResponsive();
    const styles = getStyles(scale, scaleFont);
    const [showHistory, setShowHistory] = useState(false);
    const router = useRouter();
		// Récupération des données du profil worker et de l'historique des missions passées via des requêtes API avec React Query
    const { data: profile } = useQuery({
        queryKey: ["worker-profile"],
        queryFn: getWorkerProfile,
    });

		// Récupération de l'historique des missions passées pour calculer les statistiques affichées sur la carte profil et dans le modal d'historique
    const { data: history = [] } = useQuery({
        queryKey: ["mission-history-worker"],
        queryFn: getMissionHistory,
    });

    // Calcul des statistiques affichées sur la carte profil
    const jobCount = history.length; // Nombre total de missions effectuées
    const rated = history.filter((m: any) => m.receivedRating != null); // Missions ayant reçu une note
    const rating = rated.length
        ? +(rated.reduce((s: number, m: any) => s + m.receivedRating, 0) / rated.length).toFixed(1) // Moyenne arrondie à 1 décimale
        : 0;

    const handleLogout = async () => {
        await logout();
				// Redirige vers la page de login après déconnexion
        router.replace("/login");
    };

    const handleSettings = () => {
				// Navigation vers les paramètres
        console.log("Paramètres");
    };

    return (
        <View style={[styles.page, { backgroundColor: colors.background }]}>
            <Header />

            <ThemedText
                variant="headline"
                color="primary"
                style={styles.pageTitle}>
                Profile
            </ThemedText>

            {/* Carte principale du profil avec avatar, nom, ville et stats */}
            <DefaultCard style={[styles.profileCard, {
                backgroundColor: colors.primary || "#4A5F8C",
            }]}>
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <Ionicons name="person-circle" size={scale(80)} color="#fff" />
                    </View>
									{/* Nom et ville */}
                    <View style={styles.profileInfo}> 
                        <Text style={styles.profileName}>
                            {profile?.firstName} {profile?.lastName}
                        </Text>
                        <Text style={styles.profileCity}>
                            {profile?.city}
                        </Text>
                    </View>
                </View>

                {/* Statistiques : missions, note, ancienneté */}
                <View style={styles.statsContainer}> 
									{/* Nombre de missions */}
                    <View style={styles.statItem}> 
                        <Ionicons name="checkmark-circle" size={scale(24)} color="#fff" />
                        <Text style={styles.statText}>
                            {jobCount} Mission(s)
                        </Text>
                    </View>
									{/* Note moyenne */}
                    <View style={styles.statItem}> 
                        <Ionicons name="star" size={scale(24)} color="#fff" />
                        <Text style={styles.statText}>
                            {rating > 0 ? `${rating}/5` : "0"} Évaluation
                        </Text>
                    </View>

                    <View style={styles.statItem}> 
                        <Ionicons name="calendar" size={scale(24)} color="#fff" />
                        <Text style={styles.statText}>
                            {profile?.yearsOfExperience || 0} Année sur l&apos;app
                        </Text>
                    </View>
                </View>
            </DefaultCard>

            {/* Boutons d'action : historique, paramètres, déconnexion */}
            <View style={styles.actionsContainer}> 
                <TouchableOpacity
                    style={[styles.actionButton, styles.historyButton]}
                    onPress={() => setShowHistory(true)}>
                    <Ionicons name="time-outline" size={scale(20)} color="#fff" style={styles.historyIcon} />
                    <Text style={styles.buttonText}>
                        Historique des missions
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.settingsButton]}
                    onPress={handleSettings}>
                    <Text style={styles.buttonText}>
                        Paramètre du compte
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.logoutButton]}
                    onPress={handleLogout}>
                    <Text style={styles.buttonText}>
                        Se Déconnecter
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Modal de l'historique des missions : s'ouvre en slide depuis le bas */}
            <Modal
                visible={showHistory}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowHistory(false)}
            >
                <View style={[styles.modalContainer, { backgroundColor: colors.background }]}> {/* Conteneur du modal */}
                    <View style={styles.modalHeader}>
                        <ThemedText
                            variant="headline"
                            color="primary"
                            style={styles.modalTitle}>
                            Missions passées
                        </ThemedText>
                        {/* Bouton fermer */}
                        <TouchableOpacity onPress={() => setShowHistory(false)}>
                            <Ionicons name="close-circle" size={scale(32)} color={colors.primary} />
                        </TouchableOpacity>
                    </View>

                    {/* Liste des missions passées (MissionHistory) */}
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

const getStyles = (scale: (n: number) => number, scaleFont: (n: number) => number) =>
    StyleSheet.create({
        page: {
            flex: 1,
        },
        pageTitle: {
            textAlign: "center",
            fontWeight: "bold",
            fontSize: scaleFont(32),
            paddingTop: scale(25),
        },
        profileCard: {
            padding: 20,
            borderRadius: 15,
            marginHorizontal: scale(25),
            marginTop: scale(20),
            marginBottom: scale(15),
            alignSelf: 'stretch',
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
            fontSize: scaleFont(24),
        },
        profileCity: {
            color: "#fff",
            fontSize: scaleFont(18),
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
            fontSize: scaleFont(14),
        },
        actionsContainer: {
            flex: 1,
            marginHorizontal: scale(25),
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
            marginBottom: scale(15),
        },
        historyIcon: {
            marginRight: scale(10),
        },
        settingsButton: {
            backgroundColor: "#8B9DC3",
            marginBottom: scale(15),
        },
        logoutButton: {
            backgroundColor: "#D86B6B",
        },
        buttonText: {
            color: "#fff",
            fontWeight: "600",
            fontSize: scaleFont(18),
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
        modalTitle: {
            fontSize: scaleFont(24),
            fontWeight: "bold",
        },
    });
