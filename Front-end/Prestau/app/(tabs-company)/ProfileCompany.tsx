import { StyleSheet, Text, View, TouchableOpacity, useWindowDimensions, Modal } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Header } from "@/components/Header";
import { DefaultCard } from "@/components/DefaultCard";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";
import { logout } from "@/src/api/auth";
import { getCompanyProfile } from "@/src/api/company";
import { getMissionHistory } from "@/src/api/joboffer";
import { MissionHistory } from "@/components/MissionHistory";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";

// Hook responsive :
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

// Écran de profil pour les companies, affichant les informations de l'entreprise, ses statistiques et un accès à l'historique des missions passées, ainsi qu'un bouton de déconnexion et de paramètres du compte
export default function ProfileCompany() {
    const colors = useThemeColors();
    const { scale, scaleFont } = useResponsive();
    const styles = getStyles(scale, scaleFont);
    const [showHistory, setShowHistory] = useState(false); 
		const router = useRouter();

		// Récupération des données du profil de la company et de l'historique des missions passées
		const { data: profile } = useQuery({
				queryKey: ["company-profile"],
				queryFn: getCompanyProfile,
		});

		// Récupération de l'historique des missions passées pour calculer les statistiques du profil (nombre de missions, note moyenne, etc.)
		const { data: history = [] } = useQuery({
				queryKey: ["mission-history-company"],
				queryFn: getMissionHistory,
		});

		// Calcul des statistiques du profil à partir de l'historique des missions passées
		const jobCount = history.length; // Nombre total de missions
		const rated = history.filter((m: any) => m.receivedRating != null); // Missions qui ont une évaluation reçue
		// Calcul de la note moyenne à partir des missions évaluées, arrondie à 1 décimale, ou 0 si aucune mission n'a été évaluée
		const rating = rated.length
				? +(rated.reduce((s: number, m: any) => s + m.receivedRating, 0) / rated.length).toFixed(1) 
				: 0;

		// Fonction de déconnexion : appelle l'API de logout, puis redirige vers la page de login
    const handleLogout = async () => {
        await logout();
        router.replace("/login");
    };

		// Fonction de gestion des paramètres du compte (pour l'instant, elle affiche juste un message dans la console)
    const handleSettings = () => {
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

                    <View style={styles.profileInfo}> {/* Nom et ville */}
                        <Text style={styles.profileName}>
                            {profile?.companyName}
                        </Text>
                        <Text style={styles.profileCity}>
                            {profile?.address}{profile?.city}({profile?.postalCode})
                        </Text>
                    </View>
                </View>

                {/* Statistiques : missions, note, ancienneté */}
                <View style={styles.statsContainer}> 
                    <View style={styles.statItem}> {/* Nombre de missions */}
                        <Ionicons name="checkmark-circle" size={scale(24)} color="#fff" />
                        <Text style={styles.statText}>
                            {jobCount} Mission(s)
                        </Text>
                    </View>

                    <View style={styles.statItem}> {/* Note moyenne */}
                        <Ionicons name="star" size={scale(24)} color="#fff" />
                        <Text style={styles.statText}>
                            {rating > 0 ? `${rating}/5` : "0"} Évaluation
                        </Text>
                    </View>

                    <View style={styles.statItem}> {/* Ancienneté */}
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
                <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                    <View style={styles.modalHeader}>
                        <ThemedText
                            variant="headline"
                            color="primary"
                            style={styles.modalTitle}> {/* Titre du modal */}
                            Missions passées
                        </ThemedText>
                        <TouchableOpacity onPress={() => setShowHistory(false)}> {/* Bouton fermer */}
                            <Ionicons name="close-circle" size={scale(32)} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                    {/* Liste des missions passées (MissionHistory) */}
                    <MissionHistory 
										missions={history} 
										role="COMPANY"
										onMissionPress={() => setShowHistory(false)}/>
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
            padding: scale(20),
            borderRadius: scale(15),
            marginHorizontal: scale(25),
            marginTop: scale(20),
            marginBottom: scale(15),
            alignSelf: 'stretch',
        },
        profileHeader: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: scale(20),
        },
        avatarContainer: {
            marginRight: scale(20),
        },
        profileInfo: {
            flex: 1,
        },
        profileName: {
            color: "#fff",
            fontWeight: "bold",
            marginBottom: scale(5),
            fontSize: scaleFont(24),
        },
        profileCity: {
            color: "#fff",
            fontSize: scaleFont(18),
        },
        statsContainer: {
            gap: scale(10),
        },
        statItem: {
            flexDirection: "row",
            alignItems: "center",
            gap: scale(10),
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
        actionButton: {
            paddingVertical: scale(15),
            paddingHorizontal: scale(25),
            borderRadius: scale(10),
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            marginBottom: scale(15),
        },
        historyButton: {
            backgroundColor: "#C9A961",
        },
        historyIcon: {
            marginRight: scale(10),
        },
        settingsButton: {
            backgroundColor: "#8B9DC3",
        },
        logoutButton: {
            backgroundColor: "#D86B6B",
            marginBottom: 0,
        },
        buttonText: {
            color: "#fff",
            fontWeight: "600",
            fontSize: scaleFont(18),
        },
        modalContainer: {
            flex: 1,
            paddingTop: scale(60),
        },
        modalHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: scale(20),
            marginBottom: scale(20),
        },
        modalTitle: {
            fontSize: scaleFont(24),
            fontWeight: "bold",
        },
    });
