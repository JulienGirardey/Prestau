import { StyleSheet, Text, View, ActivityIndicator, FlatList } from "react-native"; 
import { useThemeColors } from "@/hooks/useThemeColors";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/Header";
import { DefaultCard } from "@/components/DefaultCard";
import { useState, useEffect } from "react";
import { Ionicons } from '@expo/vector-icons';

interface MessageData {
    id: number;
    username: string;
    lastMessage: string;
    timestamp: string;
    unread: boolean;
}

export default function Message() {
    const colors = useThemeColors();
    const [messages, setMessages] = useState<MessageData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simuler le chargement avec des données d'exemple
        setTimeout(() => {
            setMessages([
                {
                    id: 1,
                    username: "Jean Dupont",
                    lastMessage: "Bonjour, je suis intéressé par la mission",
                    timestamp: "2024-03-15T14:30:00",
                    unread: true
                },
                {
                    id: 2,
                    username: "Marie Martin",
                    lastMessage: "Merci pour votre réponse rapide",
                    timestamp: "2024-03-15T12:15:00",
                    unread: false
                },
                {
                    id: 3,
                    username: "Pierre Dubois",
                    lastMessage: "À quelle heure commence le service ?",
                    timestamp: "2024-03-14T18:45:00",
                    unread: true
                },
                {
                    id: 4,
                    username: "Sophie Bernard",
                    lastMessage: "D'accord, merci !",
                    timestamp: "2024-03-14T10:20:00",
                    unread: false
                }
            ]);
            setIsLoading(false);
        }, 1000);
    }, []);

    const formatTimestamp = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 24) {
            return date.toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } else {
            return date.toLocaleDateString('fr-FR', { 
                day: '2-digit', 
                month: 'short' 
            });
        }
    };

    const renderMessageCard = ({ item }: { item: MessageData }) => (
        <DefaultCard style={[styles.card, { backgroundColor: colors.cardBackground || "#ffffff" }]}>
            <View style={styles.cardHeader}>
                <View style={styles.avatarContainer}>
                    <Ionicons name="person-circle" size={50} color={colors.primary || "#007AFF"} />
                    {item.unread && <View style={styles.unreadBadge} />}
                </View>
                <View style={styles.messageContent}>
                    <View style={styles.headerRow}>
                        <Text style={[styles.username, { color: colors.text }]}>
                            {item.username}
                        </Text>
                        <Text style={[styles.timestamp, { color: colors.textSecondary || "#666" }]}>
                            {formatTimestamp(item.timestamp)}
                        </Text>
                    </View>
                    <Text 
                        style={[
                            styles.lastMessage, 
                            { color: colors.textSecondary || "#666" },
                            item.unread && styles.unreadText
                        ]}
                        numberOfLines={1}
                    >
                        {item.lastMessage}
                    </Text>
                </View>
            </View>
        </DefaultCard>
    );

    if (isLoading) {
        return (
            <View style={{ flex: 1 }}>
                <Header />
                <SafeAreaView style={[styles.container, { backgroundColor: colors.background }, { paddingTop: 0 }]}>
                    <ActivityIndicator size="large" color={colors.primary || "#007AFF"} style={{ marginTop: 50 }} />
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}> 
            <Header />
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }, { paddingTop: 0 }]}>
                <Text style={{ color: colors.text, fontSize: 24, fontWeight: "bold", marginBottom: 20, alignSelf: "center" }}>
                    Messages
                </Text>
                {messages.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="chatbubbles-outline" size={60} color={colors.textSecondary || "#666"} />
                        <Text style={[styles.emptyText, { color: colors.textSecondary || "#666" }]}>
                            Aucun message
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={messages}
                        renderItem={renderMessageCard}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                )}
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    card: {
        marginBottom: 15,
        width: '100%',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatarContainer: {
        position: 'relative',
    },
    unreadBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#FF3B30',
        borderWidth: 2,
        borderColor: '#fff',
    },
    messageContent: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    username: {
        fontSize: 16,
        fontWeight: "600",
    },
    timestamp: {
        fontSize: 12,
    },
    lastMessage: {
        fontSize: 14,
    },
    unreadText: {
        fontWeight: "600",
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 16,
        marginTop: 12,
    },
});