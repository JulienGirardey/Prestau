import { StyleSheet, View, Image, useWindowDimensions, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColors";
import { DefaultCard } from "@/components/DefaultCard";
import { NewButton } from "@/components/Button";
import { InputBar } from "@/components/InputBar";
import { useState } from "react";
import { register } from "@/src/api/auth";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { useMutation } from "@tanstack/react-query";

// Hook responsive pour adapter les tailles en fonction de la largeur de l'écran
function useResponsive() {
	const { width, height } = useWindowDimensions();
	const scale = (size: number) => (width / 390) * size;
	const scaleFont = (size: number) => Math.min(scale(size), size * 1.4);
	return { width, height, scale, scaleFont };
}

// Styles spécifiques au composant de page d'inscription
export default function Register() {
	const colors = useThemeColors();
	const { scale, scaleFont } = useResponsive();
	const styles = getStyles(scale, scaleFont);
	const [inputEmail, setEmail] = useState("");
	const [inputPassword, setInputPassword] = useState("");
	const [inputVerifyPassword, setInputVerifyPassword] = useState("");
	const [role, setRole] = useState<'WORKER' | 'COMPANY' | null>(null);
	const [errorMsg, setErrorMsg] = useState("");

	// Mutation pour gérer l'inscription, avec gestion des succès et erreurs
	const { mutate: submitRegister, isPending } = useMutation({
		mutationFn: () => register(inputEmail, inputPassword, role!),
		// En cas de succès, rediriger vers la page de création de profil correspondante en fonction du rôle sélectionné
		onSuccess: (result) => {
			if (role === 'WORKER') {
				router.push('/workerCreation');
				console.log('succès', result);
			} else if (role === 'COMPANY') {
				router.push('/companyCreation');
				console.log('succès', result);
			}
		},
		onError: (error: any) => {
			console.error(error);
			const msg = error?.response?.data?.message;
			if (typeof msg === 'string' && msg.toLowerCase().includes('exist')) {
				setErrorMsg("Cet email est déjà utilisé.");
			} else {
				setErrorMsg("Erreur lors de l'inscription. Veuillez réessayer.");
			}
		}
	});

	// Handler pour le bouton d'inscription, vérifiant que le rôle est sélectionné avant de lancer la mutation
	const handleRegister = () => {
		if (!inputEmail.trim() || !inputPassword.trim() || !inputVerifyPassword.trim()) {
			setErrorMsg("Veuillez remplir tous les champs.");
			return;
		}
		// Validation de l'email avec une regex simple
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(inputEmail.trim())) {
			setErrorMsg("Veuillez entrer une adresse email valide.");
			return;
		}
		// Validation du mot de passe : correspondance
		if (inputPassword !== inputVerifyPassword) {
			setErrorMsg("Les mots de passe ne correspondent pas.");
			return;
		}
		// Validation du mot de passe : longueur minimale
		if (inputPassword.length < 6) {
			setErrorMsg("Le mot de passe doit contenir au moins 6 caractères.");
			return;
		}
		// Validation du rôle sélectionné
		if (!role) {
			setErrorMsg("Veuillez sélectionner un rôle.");
			return;
		}
		// Si toutes les validations passent, lancer la mutation d'inscription
		setErrorMsg("");
		submitRegister();
	};

	// Le rendu de la page d'inscription, avec un formulaire pour l'email, le mot de passe, la vérification du mot de passe et la sélection du rôle
	return (
		<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
			<KeyboardAvoidingView style={{ flex: 1, width: "100%" }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
				<ScrollView
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled">
					<DefaultCard style={{ width: "100%", maxWidth: 450, alignSelf: "center" }}>
						<View style={styles.form}>
							<Image
								style={[styles.baseImageStyle, { borderColor: colors.secondary }]}
								source={require('@/assets/images/logo-prestau.jpg')}
							/>
							<ThemedText variant="headline" style={styles.title}>
								Create Account
							</ThemedText>
							<InputBar style={styles.inputEmail} placeholder="Email" value={inputEmail} onChange={setEmail} />
							<InputBar style={styles.inputPassword} placeholder="Password" secureTextEntry={true} value={inputPassword} onChange={setInputPassword} />
							<InputBar placeholder="Verify password" secureTextEntry={true} value={inputVerifyPassword} onChange={setInputVerifyPassword} />
						</View>
						<View style={styles.roleRow}>
							<TouchableOpacity
								onPress={() => setRole('WORKER')}
								style={[styles.roleButton, { backgroundColor: role === 'WORKER' ? Colors.light.secondary : 'transparent' }]}>
								<ThemedText style={styles.roleText}>Worker</ThemedText>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => setRole('COMPANY')}
								style={[styles.roleButton, { backgroundColor: role === 'COMPANY' ? Colors.light.secondary : 'transparent' }]}>
								<ThemedText style={styles.roleText}>Company</ThemedText>
							</TouchableOpacity>
						</View>
						{errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
						<View style={styles.spacer} />
						<NewButton
							title={isPending ? "Création..." : "Create Account"}
							onPress={handleRegister}
							disabled={isPending}
							style={{ opacity: role === null ? 0.7 : 1 }}
						/>
					</DefaultCard>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const getStyles = (scale: (n: number) => number, scaleFont: (n: number) => number) =>
	StyleSheet.create({
		container: {
			flex: 1,
		},
		scrollContent: {
			flexGrow: 1,
			alignItems: "center",
			justifyContent: "center",
			padding: scale(40),
			paddingTop: scale(60),
		},
		form: {
			width: "100%",
		},
		baseImageStyle: {
			alignSelf: "center",
			borderWidth: 2,
			width: scale(100),
			height: scale(100),
			borderRadius: scale(5),
		},
		title: {
			textAlign: "center",
			paddingTop: scale(20),
			fontSize: scaleFont(28),
		},
		inputEmail: {
			marginBottom: scale(15),
			marginTop: scale(15),
		},
		inputPassword: {
			marginBottom: scale(-4),
		},
		roleRow: {
			flexDirection: "row" as const,
			gap: scale(10),
			marginTop: scale(30),
		},
		roleButton: {
			flex: 1,
			padding: scale(7),
			borderRadius: scale(13),
			borderWidth: 2,
			borderColor: Colors.light.secondary,
			alignItems: "center" as const,
		},
		roleText: {
			color: '#ffffff',
			fontSize: scaleFont(13.5),
		},
		spacer: {
			height: scale(20),
		},
		errorText: {
			color: "#D32F2F",
			textAlign: "center",
			marginTop: scale(10),
			fontSize: scaleFont(14),
		},
	});
