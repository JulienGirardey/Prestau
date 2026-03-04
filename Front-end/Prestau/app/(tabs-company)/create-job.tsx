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
        start_time: "",
        end_time: "",
        adress: "",
        salary: ""
    });

    // Fonction utilitaire pour mettre à jour un champ du formulaire
    const set = (key: keyof typeof form) => (value: string) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    // Fonction appelée lors de la création du profil
    const handleCreate = () => {
        console.log({ ...form, availability: true });
        router.push("/(tabs-company)/dashboard-company");
    };

    // Définition des champs du formulaire (label, clé, placeholder, requis)
    const fields = [
        { label: "Titre", key: "title", placeholder: "Mission de service", required: true },
        { label: "Description", key: "description", placeholder: "Description de la mission", required: true },
        { label: "start", key: "start_time", placeholder: "09:00", required: true },
        { label: "end", key: "end_time", placeholder: "18:00", required: true },
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
