import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, useWindowDimensions, ScrollView } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Header } from "@/components/Header";
import { NewButton } from "@/components/Button";

function useResponsive() {
	const { width } = useWindowDimensions();
	const scale = (size: number) => (width / 390) * size;
	const scaleFont = (size: number) => Math.min(scale(size), size * 1.4);
	return { scale, scaleFont };
}

export default function ReviewScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const colors = useThemeColors();
	const { scale, scaleFont } = useResponsive();
	const router = useRouter();

	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async () => {
		if (rating === 0) {
			Alert.alert("Note requise", "Veuillez sélectionner une note avant de valider.");
			return;
		}

		setIsSubmitting(true);
		try {
			// TODO : appel API pour soumettre l'avis
			// await submitReview(Number(id), { rating, comment });
			Alert.alert("Merci !", "Votre avis a bien été enregistré.", [
				{ text: "OK", onPress: () => router.back() }
			]);
		} catch {
			Alert.alert("Erreur", "Impossible d'envoyer l'avis.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<View style={{ flex: 1, backgroundColor: colors.background }}>
			<Header />
			<ScrollView contentContainerStyle={styles.container}>

				<Text style={[styles.title, { fontSize: scaleFont(26), color: colors.primary }]}>
					Laissez un avis
				</Text>

				{/* ÉTOILES */}
				<View style={styles.card}>
					<Text style={[styles.label, { fontSize: scaleFont(16) }]}>
						Note <Text style={styles.required}>*</Text>
					</Text>
					<View style={styles.starsRow}>
						{[1, 2, 3, 4, 5].map((star) => (
							<TouchableOpacity key={star} onPress={() => setRating(star)}>
								<Ionicons
									name={star <= rating ? "star" : "star-outline"}
									size={scale(40)}
									color={star <= rating ? "#C9A961" : "#ccc"}
									style={{ marginHorizontal: scale(5) }}
								/>
							</TouchableOpacity>
						))}
					</View>
					{rating > 0 && (
						<Text style={[styles.ratingText, { fontSize: scaleFont(13) }]}>
							{["", "Très mauvais", "Mauvais", "Correct", "Bien", "Excellent"][rating]}
						</Text>
					)}
				</View>

				{/* COMMENTAIRE */}
				<View style={styles.card}>
					<Text style={[styles.label, { fontSize: scaleFont(16) }]}>
						Commentaire <Text style={styles.optional}>(optionnel)</Text>
					</Text>
					<TextInput
						style={[styles.input, { fontSize: scaleFont(14) }]}
						placeholder="Décrivez votre expérience..."
						placeholderTextColor="#aaa"
						multiline
						numberOfLines={5}
						value={comment}
						onChangeText={setComment}
						maxLength={500}
					/>
					<Text style={styles.charCount}>{comment.length}/500</Text>
				</View>

				{/* BOUTON VALIDER */}
				<View style={styles.buttonContainer}>
					<NewButton
						title={isSubmitting ? "Envoi en cours..." : "Valider mon avis"}
						onPress={handleSubmit}
						disabled={isSubmitting}
					/>
				</View>

			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 25,
		gap: 20,
	},
	title: {
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 5,
	},
	card: {
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	label: {
		fontWeight: "600",
		color: "#264D84",
		marginBottom: 15,
	},
	required: {
		color: "#FF3B30",
	},
	optional: {
		color: "#aaa",
		fontWeight: "400",
		fontSize: 13,
	},
	starsRow: {
		flexDirection: "row",
		justifyContent: "center",
		marginBottom: 10,
	},
	ratingText: {
		textAlign: "center",
		color: "#C9A961",
		fontWeight: "600",
	},
	input: {
		borderWidth: 1,
		borderColor: "#e0e0e0",
		borderRadius: 10,
		padding: 12,
		color: "#333",
		textAlignVertical: "top",
		minHeight: 120,
	},
	charCount: {
		textAlign: "right",
		color: "#aaa",
		fontSize: 12,
		marginTop: 6,
	},
	buttonContainer: {
		marginTop: 10,
	},
});
