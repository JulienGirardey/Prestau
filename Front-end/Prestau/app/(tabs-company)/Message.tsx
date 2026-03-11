import { StyleSheet, Text, View, ActivityIndicator, FlatList, useWindowDimensions } from "react-native"; 
import { useThemeColors } from "@/hooks/useThemeColors";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/Header";
import { DefaultCard } from "@/components/DefaultCard";
import { useState, useEffect } from "react";
import { Ionicons } from '@expo/vector-icons';

function useResponsive() {
    const { width, height } = useWindowDimensions();
    const scale = (size: number) => (width / 390) * size;
    const scaleFont = (size: number) => Math.min(scale(size), size * 1.4);
    return { width, height, scale, scaleFont };
}

interface MessageData {
    id: number;
    username: string;
    lastMessage: string;
    timestamp: string;
    unread: boolean;
}

export default function Message() {
    const colors = useThemeColors();
    const { scale, scaleFont } = useResponsive();
    const styles = getStyles(scale, scaleFont);
    const [messages, setMessages] = useState<MessageData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // TODO: remplacer par un vrai appel API (ex: useQuery) une fois le back-end prêt
    useEffect(() => {
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

    // Affiche l'heure pour les messages du jour, la date courte sinon
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

    // Carte d'un message : avatar, badge non-lu, nom, aperçu du message et horodatage
    const renderMessageCard = ({ item }: { item: MessageData }) => (
        <DefaultCard style={[styles.card, { backgroundColor: colors.background || "#ffffff" }]}>
            <View style={styles.cardHeader}>
                <View style={styles.avatarContainer}>
                    <Ionicons name="person-circle" size={scale(50)} color={colors.primary || "#007AFF"} />
                    {/* Point rouge si le message n'a pas encore été lu */}
                    {item.unread && <View style={styles.unreadBadge} />}
                </View>
                <View style={styles.messageContent}>
                    <View style={styles.headerRow}>
                        <Text style={[styles.username, { color: '#000000' }]}>
                            {item.username}
                        </Text>
                        <Text style={[styles.timestamp, { color: colors.secondary || "#666" }]}>
                            {formatTimestamp(item.timestamp)}
                        </Text>
                    </View>
                    <Text 
                        style={[
                            styles.lastMessage, 
                            { color: colors.secondary || "#666" },
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
            <View style={styles.flex1}>
                <Header />
                <SafeAreaView style={[styles.container, { backgroundColor: colors.background, paddingTop: 0 }]}>
                    <ActivityIndicator size="large" color={colors.primary || "#007AFF"} style={styles.loader} />
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={styles.flex1}> 
            <Header />
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background, paddingTop: 0 }]}>
                <Text style={[styles.pageTitle, { color: '#000000' }]}>
                    Messages
                </Text>
                {messages.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="chatbubbles-outline" size={scale(60)} color={colors.secondary|| "#666"} />
                        <Text style={[styles.emptyText, { color: colors.secondary || "#666" }]}>
                            Aucun message
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={messages}
                        renderItem={renderMessageCard}
                        keyExtractor={(item) => item.id.toString()}
						inverted={true}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                    />
                )}
            </SafeAreaView>
        </View>
    );
}

const getStyles = (scale: (n: number) => number, scaleFont: (n: number) => number) =>
    StyleSheet.create({
        flex1: {
            flex: 1,
        },
        container: {
            flex: 1,
            padding: scale(20),
        },
        pageTitle: {
            fontSize: scaleFont(24),
            fontWeight: "bold",
            marginBottom: scale(20),
            alignSelf: "center",
        },
        loader: {
            marginTop: scale(50),
        },
        listContent: {
            paddingTop: scale(100),
        },
        card: {
            marginBottom: scale(15),
            width: '100%',
        },
        cardHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scale(12),
        },
        avatarContainer: {
            position: 'relative',
        },
        unreadBadge: {
            position: 'absolute',
            top: 0,
            right: 0,
            width: scale(12),
            height: scale(12),
            borderRadius: scale(6),
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
            marginBottom: scale(4),
        },
        username: {
            fontSize: scaleFont(16),
            fontWeight: "600",
        },
        timestamp: {
            fontSize: scaleFont(12),
        },
        lastMessage: {
            fontSize: scaleFont(14),
        },
        unreadText: {
            fontWeight: "600",
        },
        emptyState: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: scale(100),
        },
        emptyText: {
            fontSize: scaleFont(16),
            marginTop: scale(12),
        },
    });
