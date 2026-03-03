import { ActionSheetProvider, useActionSheet } from '@expo/react-native-action-sheet';
// ActionSheetProvider : sert à fournir le contexte pour les menus d'options (ActionSheet) dans l'application
// useActionSheet : hook pour afficher un menu d'options (ActionSheet) depuis n'importe quel composant enfant du provider
import { Header } from "@/components/Header";
import { ThemedText } from "@/components/ThemedText";
import { InputBar } from "@/components/InputBar";
import { NewButton } from "@/components/Button";
import { DefaultCard } from "@/components/DefaultCard";
import { useThemeColors } from "@/hooks/useThemeColors";
import { View, ScrollView, StyleSheet, TouchableOpacity, Image, useWindowDimensions, } from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { createWorkerProfile } from "@/src/api/worker";

// Hook responsive : 
// Toutes les valeurs de l'UI sont calculées à partir de la largeur réelle
function useResponsive() {
	const { width, height } = useWindowDimensions();
	// Fonction pour adapter une taille à la largeur de l'écran (base 390px)
	const scale = (size: number) => (width / 390) * size;
	// Fonction pour adapter la taille de police, mais la limite à 1.4x
	const scaleFont = (size: number) => Math.min(scale(size), size * 1.4);
	return {
		width,
		height,
		scale,
		scaleFont,
		columns: width >= 600 ? 2 : 1, // 2 colonnes si tablette, sinon 1
	};
}

// Styles pour les champs du formulaire (fonction de la taille de l'écran)
const fieldStyles = (scale: (n: number) => number) => StyleSheet.create({
	wrapper: {},
	labelRow: {
		flexDirection: "row" as const,
		marginBottom: scale(-3),
	},
});
// FormField : composant pour un champ de formulaire avec label et indication de champ obligatoire
function FormField({
	label,
	required,
	columns,
	scale,
	scaleFont,
	...inputProps
}: {
	label: string;
	required?: boolean;
	value: string;
	onChange: (s: string) => void;
	placeholder?: string;
	columns: number;
	scale: (n: number) => number;
	scaleFont: (n: number) => number;
}) {
	return (
		<View
			style={[fieldStyles(scale).wrapper, { width: columns === 2 ? "48%" : "100%", marginBottom: scale(12) }]}
			pointerEvents="box-none">
			<View style={[fieldStyles(scale).labelRow]} pointerEvents="box-none">
				<ThemedText variant="subtitle2" color="background" style={{ fontSize: scaleFont(13) }}>{label}</ThemedText>
				{required && (<ThemedText variant="subtitle2" color="secondary" style={{ fontSize: scaleFont(13) }}>{" "}*</ThemedText>)}
			</View>
			<InputBar {...inputProps} />
		</View>
	);
}

// Composant interne (utilise le hook ActionSheet)
function WorkerCreationInner() {
	const colors = useThemeColors();
	const { scale, scaleFont, columns } = useResponsive();
	const { showActionSheetWithOptions } = useActionSheet();
	const [photo, setPhoto] = useState<string | null>(null);
	const [form, setForm] = useState({
		firstName: "",
		lastName: "",
		dateOfBirth: "",
		city: "",
		postalCode: "",
		profession: "",
		experience_years: "",
		languages: "",
		qualifications: "",
		cv_url: "",
		phoneNumber: "",
		skills: "",
	});

	// Fonction utilitaire pour mettre à jour un champ du formulaire
	const set = (key: keyof typeof form) => (value: string) =>
		setForm((prev) => ({ ...prev, [key]: value }));

	// Ouvre la galerie pour choisir une image de profil
	const pickFromGallery = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== 'granted') {
			alert('Permission d\'accès à la galerie refusée');
			return;
		}
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: "images",
			allowsEditing: true,
			aspect: [1, 1],
		});
		if (!result.canceled) setPhoto(result.assets[0].uri);
	};

	// Ouvre la caméra pour prendre une photo
	const takePhoto = async () => {
		const { status } = await ImagePicker.requestCameraPermissionsAsync();
		if (status !== 'granted') {
			alert('Permission d\'accès à la caméra refusée');
			return;
		}
		const result = await ImagePicker.launchCameraAsync({
			allowsEditing: true,
			aspect: [1, 1],
		});
		if (!result.canceled) setPhoto(result.assets[0].uri);
	};

	// Affiche le menu d'options pour la photo (galerie / caméra / supprimer)
	const handlePhotoOptions = () => {
		const options = photo
			? ["Choisir dans la galerie", "Prendre une photo", "Supprimer la photo", "Annuler"]
			: ["Choisir dans la galerie", "Prendre une photo", "Annuler"];

		showActionSheetWithOptions(
			{
				options,
				cancelButtonIndex: options.length - 1,
				destructiveButtonIndex: photo ? 2 : undefined
			},
			(selectedIndex) => {
				if (selectedIndex === 0) pickFromGallery();
				else if (selectedIndex === 1) takePhoto();
				else if (photo && selectedIndex === 2) setPhoto(null); // Supprimer
			}
		);
	};

	// Fonction appelée lors de la création du profil
	const handleCreate = async () => {
		if (!form.firstName || !form.lastName || !form.phoneNumber || !form.city || !form.postalCode || !form.profession || !form.languages || !form.skills) {
			alert('Merci de remplir tous les champs obligatoires');
			return;
		}
		try {
			await createWorkerProfile({
				firstName: form.firstName,
				lastName: form.lastName,
				dateOfBirth: new Date(form.dateOfBirth),
				phoneNumber: form.phoneNumber,
				city: form.city,
				postalCode: Number(form.postalCode),
				profession: form.profession,
				languages: form.languages,
				skills: form.skills,
				experience_years: Number(form.experience_years),
				qualifications: form.qualifications || undefined,
				cv_url: form.cv_url || undefined,
				photoURL: photo || undefined,
			});
			router.push("/(tabs)/ProfileWorker");
		} catch (error) {
			alert('Erreur lors de la création du profil');
			console.error(error);
		}
	};

	// Définition des champs du formulaire (label, clé, placeholder, requis)
	const fields = [
		{ label: "Prénom", key: "firstName", placeholder: "Jean", required: true },
		{ label: "Nom", key: "lastName", placeholder: "Dupont", required: true },
		{ label: "Téléphone", key: "phoneNumber", placeholder: "06 00 00 00 00", required: true },
		{ label: "Ville", key: "city", placeholder: "Paris", required: true },
		{ label: "Code postal", key: "postalCode", placeholder: "75001", required: true },
		{ label: "Profession", key: "profession", placeholder: "Serveur", required: true },
		{ label: "Langues", key: "languages", placeholder: "Français, Anglais", required: true },
		{ label: "Compétences", key: "skills", placeholder: "Service, Barman...", required: true },
		{ label: "Date de naissance", key: "dateOfBirth", placeholder: "01/01/2000", required: false },
		{ label: "Années d'expérience", key: "experience_years", placeholder: "3", required: false },
		{ label: "Qualifications", key: "qualifications", placeholder: "CAP cuisine...", required: false },
		{ label: "Lien CV", key: "cv_url", placeholder: "https://...", required: false },
	] as const;

	// Taille de la photo de profil (responsive)
	const photoSize = scale(90);

	return (
		<View style={[styles.page, { backgroundColor: colors.background }]}>
			{/* En-tête de la page */}
			<Header />

			{/* Titre principal */}
			<ThemedText
				variant="headline"
				color="primary"
				style={[styles.pageTitle, { fontSize: scaleFont(24), paddingTop: scale(25) }]}>Profil Worker</ThemedText>

			{/* Carte contenant le formulaire */}
			<DefaultCard style={[styles.card, { margin: scale(25), marginBottom: scale(30), marginTop: scale(20), paddingBottom: scale(5) }]}>
				<ScrollView
					style={styles.scroll}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled"
					scrollEventThrottle={16}
				>
					<View pointerEvents="box-none">

						{/* Sélecteur de photo de profil avec menu d'options */}
						<TouchableOpacity
							style={[styles.photoPicker, { width: photoSize, height: photoSize, borderRadius: photoSize / 2, marginBottom: scale(16) }]}
							onPress={handlePhotoOptions}>
							{photo ? (<Image source={{ uri: photo }} style={styles.photo} />) : (
								<ThemedText color="inactive" style={[styles.photoPlaceholder, { fontSize: scaleFont(12) }]}>
									📷{"\n"}Photo
								</ThemedText>
							)}
						</TouchableOpacity>

						{/* Conteneur des champs du formulaire (flex wrap) */}
						<View style={styles.fieldsContainer} pointerEvents="box-none">
							{fields.map(({ label, key, placeholder, required }) => (
								<FormField
									key={key}
									label={label}
									required={required}
									value={form[key]}
									onChange={set(key)}
									placeholder={placeholder}
									columns={columns}
									scale={scale}
									scaleFont={scaleFont}
								/>
							))}
						</View>
						{/* Indication champ obligatoire */}
						<ThemedText
							variant="subtitle2" color="secondary" style={[styles.requiredHint, { marginBottom: scale(12), fontSize: scaleFont(11) }]}>
							* Champ obligatoire
						</ThemedText>
					</View>
				</ScrollView>
			</DefaultCard>
			{/* Bouton de validation */}
			<NewButton title="Créer mon profil" onPress={handleCreate} style={getButtonStyle(scale)} />
		</View>
	);
}

// Composant wrapper avec ActionSheetProvider
export default function WorkerCreation() {
	return (
		<ActionSheetProvider>
			<WorkerCreationInner />
		</ActionSheetProvider>
	);
}


// Styles
const styles = StyleSheet.create({
	page: {
		flex: 1,
	},
	pageTitle: {
		textAlign: "center",
	},
	card: {
		flex: 1,
		alignSelf: "stretch",
	},
	scroll: {
		flex: 1,
	},
	photoPicker: {
		alignSelf: "center",
		backgroundColor: "#e0e0e0",
		justifyContent: "center",
		alignItems: "center",
		overflow: "hidden",
	},
	photo: {
		width: "100%",
		height: "100%",
	},
	photoPlaceholder: {
		textAlign: "center",
	},
	requiredHint: {
		textAlign: "right",
	},
	fieldsContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
	},
});

const getButtonStyle = (scale: (n: number) => number) => ({
	alignSelf: "center" as const,
	width: scale(300),
	marginBottom: scale(40),
});
