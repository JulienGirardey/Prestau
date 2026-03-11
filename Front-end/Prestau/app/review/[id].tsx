import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, useWindowDimensions, ScrollView, ActivityIndicator } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Header } from "@/components/Header";
import { NewButton } from "@/components/Button";
import { getJobOfferById, JobOffer } from "@/src/api/joboffer";
import { createReview } from "@/src/api/review";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


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
	const styles = getStyles(scale, scaleFont);
	const router = useRouter();
	const queryClient = useQueryClient();
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");

	const { data: jobOffer, isLoading: loadingOffer } = useQuery<JobOffer>({
		queryKey: ["joboffer", id],
		queryFn: () => getJobOfferById(Number(id)),
		enabled: id!=null,
	});

	// Soumission de l'avis : détermine dynamiquement qui est le reviewer et qui est le reviewee
	// selon le rôle de l'utilisateur connecté (WORKER → évalue la COMPANY, et inversement)
	const { mutate: submitReview, isPending: isSubmitting } = useMutation({
		mutationFn: async () => {
			const token = await SecureStore.getItemAsync("access_token");
			if (!token) throw new Error("Non authentifié");
			const decoded: any = jwtDecode(token);
			const role: string = decoded.role; // lit le rôle de l'utilisateur à partir du token

			let reviewerType: string; // celui qui écrit l'avis (WORKER ou COMPANY)
			let revieweeType: string; // celui qui reçoit l'avis (WORKER ou COMPANY)
			let revieweeId: number; // l'id de celui qui reçoit l'avis

			if (role === "WORKER") {
				if (!jobOffer!.job?.company?.userId) throw new Error("Données company manquantes");
				reviewerType = "WORKER";
				revieweeType = "COMPANY";
				revieweeId = jobOffer!.job.company.userId;
			} else {
				if (!jobOffer!.worker?.userId) throw new Error("Données worker manquantes");
				reviewerType = "COMPANY";
				revieweeType = "WORKER";
				revieweeId = jobOffer!.worker.userId;
			}

			return createReview({
				rating,
				comment: comment || undefined,
				jobId: jobOffer!.job.id,
				reviewerType,
				revieweeType,
				revieweeId,
				reviewerId: decoded.sub,
			});

		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["joboffer", id] });
			queryClient.invalidateQueries({ queryKey: ["mission-history-worker"] });
			queryClient.invalidateQueries({ queryKey: ["mission-history-company"] });
			Alert.alert("Merci !", "Votre avis a bien été enregistré.", [
				{ text: "OK", onPress: () => router.back() }
			]);
		},
		onError: (error: any) => {
			const message = error?.message ?? "Impossible d'envoyer l'avis.";
			Alert.alert("Erreur", message);
		}
	});

	// Validation avant envoi : la note est obligatoire, le commentaire est optionnel
	const handleSubmit = () => {
		if (rating === 0) {
			Alert.alert("Note requise", "Veuillez sélectionner une note avant de valider.");
			return;
		}
		if (!jobOffer) return;
		submitReview();
	};

	return (
		<View style={{ flex: 1, backgroundColor: colors.background }}>
			<Header />
			{loadingOffer ? (
				<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
					<ActivityIndicator size="large" color={colors.primary} />
				</View>
			) : (
			<ScrollView contentContainerStyle={styles.container}>

				<Text style={[styles.title, { color: colors.primary }]}>
					Laissez un avis
				</Text>

				{/* ÉTOILES */}
				<View style={styles.card}>
					<Text style={styles.label}>
						Note <Text style={styles.required}>*</Text>
					</Text>
					<View style={styles.starsRow}>
						{[1, 2, 3, 4, 5].map((star) => (
							<TouchableOpacity key={star} onPress={() => setRating(star)}>
								<Ionicons
									name={star <= rating ? "star" : "star-outline"}
									size={scale(40)}
									color={star <= rating ? "#C9A961" : "#ccc"}
									style={styles.starIcon}
								/>
							</TouchableOpacity>
						))}
					</View>
					{rating > 0 && (
						<Text style={styles.ratingText}>
							{["", "Très mauvais", "Mauvais", "Correct", "Bien", "Excellent"][rating]}
						</Text>
					)}
				</View>

				{/* COMMENTAIRE */}
				<View style={styles.card}>
					<Text style={styles.label}>
						Commentaire <Text style={styles.optional}>(optionnel)</Text>
					</Text>
					<TextInput
						style={styles.input}
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
			)}
		</View>
	);
}

const getStyles = (scale: (n: number) => number, scaleFont: (n: number) => number) =>
	StyleSheet.create({
		container: {
			padding: 25,
			gap: 20,
		},
		title: {
			fontWeight: "bold",
			textAlign: "center",
			marginBottom: 5,
			fontSize: scaleFont(26),
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
			fontSize: scaleFont(16),
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
		starIcon: {
			marginHorizontal: scale(5),
		},
		ratingText: {
			textAlign: "center",
			color: "#C9A961",
			fontWeight: "600",
			fontSize: scaleFont(13),
		},
		input: {
			borderWidth: 1,
			borderColor: "#e0e0e0",
			borderRadius: 10,
			padding: 12,
			color: "#333",
			textAlignVertical: "top",
			minHeight: 120,
			fontSize: scaleFont(14),
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
