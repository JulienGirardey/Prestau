import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { JobOffer } from "@/src/api/joboffer";


interface MissionHistoryProps {
    missions: JobOffer[];
    role: 'WORKER' | 'COMPANY';
		onMissionPress?: () => void;
}

export function MissionHistory({ missions, role, onMissionPress }: MissionHistoryProps) {
    const colors = useThemeColors();
		const router = useRouter();

    const renderMission = ({ item }: { item: JobOffer }) => (
			<Pressable
    		onPress={() => {
        onMissionPress?.();
        router.push({ pathname: '/joboffer/[id]', params: { id: item.id } });
    }}
    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
        <View style={[styles.card, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={styles.title}>{item.job.title}</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.job.salary}€</Text>
                </View>
            </View>

            <Text style={styles.address}>{item.job.address}</Text>
            {role === 'WORKER' && item.job.company && (
                <Text style={styles.subtitle}>
									Company: {item.job.company.companyName}</Text>
            )}

            {role === 'COMPANY' && item.worker && (
                <Text style={styles.subtitle}>
                    Worker: {item.worker.firstName}{item.worker.lastName}
                </Text>
            )}

            <View style={styles.separator} />

            <View style={styles.dateRow}>
                <View style={styles.dateItem}>
                    <Text style={styles.dateLabel}>Début</Text>
                    <Text style={styles.dateValue}>
                        {new Date(item.job.start_time).toLocaleDateString()}
                    </Text>
                </View>
                <View style={styles.dateSeparator} />
                <View style={styles.dateItem}>
                    <Text style={styles.dateLabel}>Fin</Text>
                    <Text style={styles.dateValue}>
                        {new Date(item.job.end_time).toLocaleDateString()}
                    </Text>
                </View>
            </View>

            <View style={styles.completedRow}>
                <Text style={styles.completedText}>
                    Terminée le {new Date(item.updatedAt).toLocaleDateString()}
                </Text>
            </View>

            {/* Avis reçu (doré) */}
            {item.receivedRating != null && (
                <View style={[styles.receivedReviewBox, { borderLeftColor: "#C9A961", backgroundColor: "#fff8e1" }]}> 
                    <View style={styles.ratingRow}>
                        <Ionicons name="star" size={16} color="#C9A961" />
                        <Text style={[styles.ratingText, { color: "#C9A961" }]}>{item.receivedRating}/5</Text>
                        <Text style={styles.ratingFrom}>
                            {" "}· de{" "}
                            {role === "WORKER" && item.job.company
                                ? item.job.company.companyName
                                : role === "COMPANY" && item.worker
                                ? `${item.worker.firstName} ${item.worker.lastName}`
                                : ""}
                        </Text>
                    </View>
                    {item.receivedComment ? (
                        <Text style={styles.receivedComment}>"{item.receivedComment}"</Text>
                    ) : null}
                </View>
            )}

            {/* Avis laissé (bleu) */}
            {item.myRating != null && (
                <View style={[styles.receivedReviewBox, { borderLeftColor: "#4a90d9", backgroundColor: "#f0f4ff" }]}> 
                    <View style={styles.ratingRow}>
                        <Ionicons name="star" size={16} color="#4a90d9" />
                        <Text style={[styles.ratingText, { color: "#4a90d9" }]}>{item.myRating}/5</Text>
                        <Text style={styles.ratingFrom}> · votre avis</Text>
                    </View>
                    {item.myComment ? (
                        <Text style={styles.receivedComment}>"{item.myComment}"</Text>
                    ) : null}
                </View>
            )}

            {/* Message si mission terminée mais pas encore d'avis */}
            {item.status === 'COMPLETED' && !item.hasReviewed && (
                <View style={styles.pendingReviewBox}>
                    <Text style={styles.pendingReviewText}>
                        Laissez votre avis pour voir celui de l'autre partie
                    </Text>
                </View>
            )}
        </View>
			</Pressable>
    );

    if (missions.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Aucune mission terminée</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={missions}
            renderItem={renderMission}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
        />
    );
}

const styles = StyleSheet.create({
    list: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    card: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    title: {
        fontWeight: "bold",
        fontSize: 17,
        flex: 1,
        marginRight: 10,
    },
    badge: {
        backgroundColor: "#4a90d9",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    badgeText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 13,
    },
    subtitle: {
        color: "#555",
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 4,
    },
    address: {
        color: "#888",
        fontStyle: "italic",
        fontSize: 13,
        marginBottom: 8,
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
        fontSize: 11,
        marginBottom: 2,
    },
    dateValue: {
        color: "#333",
        fontWeight: "600",
        fontSize: 12,
    },
    dateSeparator: {
        width: 1,
        height: 30,
        backgroundColor: "#e0e0e0",
    },
    completedRow: {
        marginTop: 10,
        alignItems: "center",
    },
    completedText: {
        color: "#4CAF50",
        fontWeight: "600",
        fontSize: 12,
    },
    emptyContainer: {
        alignItems: "center",
        paddingVertical: 40,
    },
    emptyText: {
        color: "#999",
        fontSize: 16,
    },
    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
    },
    ratingText: {
        marginLeft: 4,
        color: "#C9A961",
        fontWeight: "600",
        fontSize: 13,
    },
    ratingFrom: {
        color: "#888",
        fontSize: 12,
        fontStyle: "italic",
    },
    receivedReviewBox: {
        marginTop: 10,
        backgroundColor: "#fdf8ee",
        borderRadius: 8,
        padding: 8,
        borderLeftWidth: 3,
        borderLeftColor: "#C9A961",
    },
    receivedComment: {
        marginTop: 4,
        color: "#555",
        fontSize: 12,
        fontStyle: "italic",
    },
    pendingReviewBox: {
        marginTop: 10,
        backgroundColor: "#f5f5f5",
        borderRadius: 8,
        padding: 8,
        borderLeftWidth: 3,
        borderLeftColor: "#ccc",
        alignItems: "center",
    },
    pendingReviewText: {
        color: "#999",
        fontSize: 12,
        fontStyle: "italic",
    },
});