import { Header } from "@/components/Header";
import { ThemedText } from "@/components/ThemedText";
import { InputBar } from "@/components/InputBar";
import { NewButton } from "@/components/Button";
import { DefaultCard } from "@/components/DefaultCard";
import { useThemeColors } from "@/hooks/useThemeColors";
import { View, ScrollView, StyleSheet, useWindowDimensions, KeyboardAvoidingView, Platform } from "react-native";
import React, { useState } from "react";
import { createCompanyProfile } from "@/src/api/company";
import { router } from "expo-router";
import { useMutation } from "@tanstack/react-query";

// Hook responsive pour adapter les tailles et le nombre de colonnes en fonction de la largeur de l'écran
function useResponsive() {
	const { width, height } = useWindowDimensions();
	const scale = (size: number) => (width / 390) * size;
	const scaleFont = (size: number) => Math.min(scale(size), size * 1.4);
	return { // 
		width,
		height,
		scale,
		scaleFont,
		columns: width >= 600 ? 2 : 1,
	};
}

// Styles spécifiques au composant de champ de formulaire
const fieldStyles = (scale: (n: number) => number) => StyleSheet.create({
	wrapper: {},
	labelRow: {
		flexDirection: "row" as const,
		marginBottom: scale(-3),
	},
});

// Composant champ de formulaire avec label et indication de champ obligatoire
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
		// Le wrapper prend la moitié de la largeur si on est en mode 2 colonnes, sinon il prend toute la largeur
		<View
			style={[fieldStyles(scale).wrapper, { width: columns === 2 ? "50%" : "100%", marginBottom: scale(12) }]}
			pointerEvents="box-none">
			<View style={fieldStyles(scale).labelRow} pointerEvents="box-none">
				<ThemedText variant="subtitle2" color="background" style={{ fontSize: scaleFont(13) }}>{label}</ThemedText>
				{required && (<ThemedText variant="subtitle2" color="secondary" style={{ fontSize: scaleFont(13) }}>{" "}*</ThemedText>)}
			</View>
			<InputBar {...inputProps} />
		</View>
	);
}

// Composant principal de création de profil company
export default function CompanyCreation() {
	const colors = useThemeColors();
	const { scale, scaleFont, columns } = useResponsive();
	const [form, setForm] = useState({
		companyName: "",
		address: "",
		postalCode: "",
		city: "",
		siret: "",
		phoneNumber: "",
		establishment_type: "",
		description: "",
		website: "",
		social_media: "",
	});

	// Fonction pour mettre à jour les champs du formulaire, en utilisant le nom du champ comme clé pour mettre à jour la valeur correspondante dans l'état du formulaire
	const set = (key: keyof typeof form) => (value: string) =>
		setForm((prev) => ({ ...prev, [key]: value }));

	// Mutation pour gérer la création du profil company, avec gestion des succès et erreurs
	const { mutate: submitCreate, isPending } = useMutation({
		mutationFn: () => createCompanyProfile({
			companyName: form.companyName,
			address: form.address,
			postalCode: Number(form.postalCode),
			city: form.city,
			siret: form.siret,
			phoneNumber: form.phoneNumber,
			establishment_type: form.establishment_type,
			description: form.description || undefined,
			website: form.website || undefined,
			social_media: form.social_media || undefined,
		}),
		onSuccess: () => {
			router.push('/(tabs-company)/dashboard-company');
		},
		onError: (error) => {
			alert('Erreur lors de la création du profil');
			console.error(error);
		}
	});

	// Handler pour le bouton de création, vérifiant que les champs obligatoires sont remplis avant de lancer la mutation
	const handleCreate = () => {
		if (!form.companyName || !form.address || !form.siret || !form.phoneNumber || !form.establishment_type || !form.postalCode || !form.city) {
			alert('Merci de remplir tous les champs obligatoires');
			return;
		}
		submitCreate();
	};

	// Définition des champs du formulaire, avec leur label, leur clé dans l'état du formulaire, leur placeholder et s'ils sont obligatoires ou non
	const fields = [
		{ label: "Nom de l'entreprise", key: "companyName", placeholder: "Le Bistrot Parisien", required: true },
		{ label: "Adresse", key: "address", placeholder: "12 rue de la Paix", required: true },
		{ label: "Ville", key: "city", placeholder: "Paris", required: true },
		{ label: "Code postal", key: "postalCode", placeholder: "75001", required: true },
		{ label: "SIRET", key: "siret", placeholder: "12345678901234", required: true },
		{ label: "Téléphone", key: "phoneNumber", placeholder: "0606060606", required: true },
		{ label: "Type d'établissement", key: "establishment_type", placeholder: "Restaurant, Bar...", required: true },
		{ label: "Description", key: "description", placeholder: "Décrivez votre établissement...", required: false },
		{ label: "Site web", key: "website", placeholder: "https://...", required: false },
		{ label: "Réseaux sociaux", key: "social_media", placeholder: "https://instagram.com/...", required: false },
	] as const;

	// Le rendu de la page de création de profil company, avec un formulaire pour les informations de l'entreprise et un bouton pour créer le profil
	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<View style={[styles.page, { backgroundColor: colors.background }]}>
				<Header />
				<ScrollView
					style={{ flex: 1 }}
					keyboardShouldPersistTaps="handled"
					contentContainerStyle={{ flexGrow: 1 }}
					automaticallyAdjustContentInsets={true}
				>
					<ThemedText
						variant="headline"
						color="primary"
						style={[styles.pageTitle, { fontSize: scaleFont(24), paddingTop: scale(25) }]}>Profil Company</ThemedText>
					<DefaultCard style={[styles.card, { margin: scale(25), marginBottom: scale(30), marginTop: scale(20), paddingBottom: scale(5) }]}>
						<View pointerEvents="box-none">
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
							<ThemedText
								variant="subtitle2" color="secondary"
								style={[styles.requiredHint, { marginBottom: scale(12), fontSize: scaleFont(11) }]}>
								* Champ obligatoire
							</ThemedText>
						</View>
					</DefaultCard>
					<NewButton title={isPending ? "Création..." : "Créer mon profil"} onPress={handleCreate} disabled={isPending} style={getButtonStyle(scale)} />
				</ScrollView>
			</View>
		</KeyboardAvoidingView>
	);
}

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
