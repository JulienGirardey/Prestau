import { KeyboardAvoidingView, Platform, StyleSheet, View, ScrollView, useWindowDimensions } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Header } from "@/components/Header";
import { DefaultCard } from "@/components/DefaultCard";
import { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { NewButton } from "@/components/Button";
import { InputBar } from "@/components/InputBar";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { router } from "expo-router";
import { createJob } from "@/src/api/job";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Alert } from "react-native";
dayjs.extend(customParseFormat)

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
function MissionCreationInner() {
	const colors = useThemeColors();
	const { scale, scaleFont, columns } = useResponsive();
	const [form, setForm] = useState({
		title: "",
		description: "",
		start_date: "",
		start_hour: "",
		end_date: "",
		end_hour: "",
		adress: "",
		salary: ""
	});

	// Fonction utilitaire pour mettre à jour un champ du formulaire
	const set = (key: keyof typeof form) => (value: string) =>
		setForm((prev) => ({ ...prev, [key]: value }));

	// Fonction appelée lors de la création du profil
	const handleCreate = async () => {
		try {

			if (!form.title || !form.description || !form.adress || !form.salary) {
				Alert.alert("Erreur", "Tous les champs sont obligatoires");
				return;
			}
			const startDate = dayjs(form.start_date, "DD/MM/YYYY", true);
			const startHour = dayjs(form.start_hour, "HH:mm", true);
			const endDate = dayjs(form.end_date, "DD/MM/YYYY", true);
			const endHour = dayjs(form.end_hour, "HH:mm", true);

			if (!startDate.isValid() || !startHour.isValid() || !endDate.isValid() || !endHour.isValid()) {
				Alert.alert("Erreur", "Date ou heure invalide");
				return;
			}

			if (startDate.isBefore(dayjs(), "day")) {
				Alert.alert("Erreur", "La date de début ne peut pas être antérieure à aujourd'hui");
				return;
			}

			if (endDate.isBefore(dayjs(), "day")) {
				Alert.alert("Erreur", "La date de fin ne peut pas être antérieure à aujourd'hui");
				return;
			}

			const start_time = startDate.hour(startHour.hour()).minute(startHour.minute()).second(0).toISOString();
			const end_time = endDate.hour(endHour.hour()).minute(endHour.minute()).second(0).toISOString();

			if (dayjs(end_time).isBefore(dayjs(start_time))) {
				Alert.alert("Erreur", "La date de fin ne peut pas être antérieure à la date de début");
				return;
			}
			await createJob({
				title: form.title,
				description: form.description,
				start_time,
				end_time,
				address: form.adress,
				salary: parseFloat(form.salary),
			});
		} catch (err: any) {
			console.error('Erreur création mission:', err?.response?.data?.message);
		}
	};

	// Définition des champs du formulaire (label, clé, placeholder, requis)
	const fields = [
		{ label: "Titre", key: "title", placeholder: "Mission de service", required: true },
		{ label: "Description", key: "description", placeholder: "Description de la mission", required: true },
		{ label: "Date de début", key: "start_date", placeholder: "15/06/2026", required: true },
		{ label: "Heure de début", key: "start_hour", placeholder: "09:00", required: true },
		{ label: "Date de fin", key: "end_date", placeholder: "15/06/2026", required: true },
		{ label: "Heure de fin", key: "end_hour", placeholder: "18:00", required: true },
		{ label: "Adress", key: "adress", placeholder: "123 Rue de la Paix", required: true },
		{ label: "Salaire", key: "salary", placeholder: "10 €/heure", required: true },
	] as const;

	return (
		<View style={[styles.page, { backgroundColor: colors.background }]}>
			{/* En-tête de la page */}
			<Header />
			<ScrollView
				style={{ flex: 1 }}
				keyboardShouldPersistTaps="handled"
				contentContainerStyle={{ flexGrow: 1 }}
				automaticallyAdjustContentInsets={true}
			>
				{/* Titre principal */}
				<ThemedText
					variant="headline"
					color="primary"
					style={[styles.pageTitle, { fontSize: scaleFont(24), paddingTop: scale(25) }]}>Création de mission</ThemedText>

				{/* Carte contenant le formulaire */}
				<DefaultCard style={[styles.card, { margin: scale(25), marginBottom: scale(30), marginTop: scale(20), paddingBottom: scale(5) }]}>
					<View pointerEvents="box-none">

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
					</View>
				</DefaultCard>
				{/* Bouton de validation */}
				<NewButton title="Créer ma mission" onPress={handleCreate} style={getButtonStyle(scale)} />
			</ScrollView>
		</View >
	);
}

// Composant wrapper avec ActionSheetProvider
export default function CreateMission() {
	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<ActionSheetProvider>
				<MissionCreationInner />
			</ActionSheetProvider>
		</KeyboardAvoidingView>
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

const fieldStyles = (scale: (n: number) => number) => StyleSheet.create({
	wrapper: {},
	labelRow: {
		flexDirection: "row" as const,
		marginBottom: scale(-3),
	},
});
