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
	const [errorEmail, setErrorEmail] = useState("");
	const [errorPassword, setErrorPassword] = useState("");


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
				setErrorEmail("Cet email est déjà utilisé.");
			} else {
				setErrorMsg("Erreur lors de l'inscription. Veuillez réessayer.");
			}
		}
	});

	// Fonction de validation du mot de passe, vérifiant les critères définis dans le DTO de l'API
	const validatePassword = (password: string) => {
	const hasUpperCase = /[A-Z]/.test(password);
	const hasNumber = /[0-9]/.test(password);
	const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);
	const hasMinLength = password.length >= 8;

	return hasUpperCase && hasNumber && hasSpecialChar && hasMinLength;
};

	// Handler pour le bouton d'inscription, vérifiant que le rôle est sélectionné avant de lancer la mutation
	const handleRegister = () => {
		let hasError = false;
		let emailError = "";
		let passwordError = "";
		let generalError = "";

		if (!inputEmail.trim() || !inputPassword.trim() || !inputVerifyPassword.trim()) {
			generalError = "Veuillez remplir tous les champs.";
			hasError = true;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(inputEmail.trim())) {
			emailError = "Veuillez entrer une adresse email valide.";
			hasError = true;
		}

		if (!validatePassword(inputPassword)) {
			passwordError = "Le mot de passe doit contenir au minimum 8 caractères, une majuscule, un chiffre, un caractère spécial et ne doit pas dépasser 20 caractères.";
			hasError = true;
		} else if (inputPassword !== inputVerifyPassword) {
			passwordError = "Les mots de passe ne correspondent pas.";
			hasError = true;
		}

		if (!role) {
			generalError = (generalError ? generalError + "\n" : "") + "Veuillez sélectionner un rôle.";
			hasError = true;
		}

		setErrorEmail(emailError);
		setErrorPassword(passwordError);
		setErrorMsg(generalError);

		if (hasError) return;

		// Si aucune erreur, lancer la mutation
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
						<View>
							<Image
								style={[styles.baseImageStyle, { borderColor: colors.secondary }]}
								source={require('@/assets/images/logo-prestau.jpg')}
							/>
							<ThemedText variant="headline" style={styles.title}>
								Create Account
							</ThemedText>
							<InputBar
								style={styles.inputEmail}
								placeholder="Email"
								value={inputEmail}
								onChange={(text) => {
									setEmail(text);
									if (errorEmail) setErrorEmail("");
								}}
							/>
							{errorEmail ? <Text style={styles.errorText}>{errorEmail}</Text> : null}
							<InputBar
								style={styles.inputPassword}
								placeholder="Password"
								secureTextEntry={true}
								value={inputPassword}
								onChange={(text) => {
									setInputPassword(text);
									if (errorPassword) setErrorPassword("");
								}}
							/>
							<InputBar
								placeholder="Verify password"
								secureTextEntry={true}
								value={inputVerifyPassword}
								onChange={(text) => {
									setInputVerifyPassword(text);
									if (errorPassword) setErrorPassword("");
								}}
							/>
							{errorPassword ? <Text style={styles.errorText}>{errorPassword}</Text> : null}
						</View>
						<View style={styles.roleRow}>
							<TouchableOpacity
								onPress={() => {
									setRole('WORKER');
									if (errorMsg.includes("rôle")) setErrorMsg("");
								}}
								style={[styles.roleButton, { backgroundColor: role === 'WORKER' ? Colors.light.secondary : 'transparent' }]}> 
								<ThemedText style={styles.roleText}>Worker</ThemedText>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => {
									setRole('COMPANY');
									if (errorMsg.includes("rôle")) setErrorMsg("");
								}}
								style={[styles.roleButton, { backgroundColor: role === 'COMPANY' ? Colors.light.secondary : 'transparent' }]}> 
								<ThemedText style={styles.roleText}>Company</ThemedText>
							</TouchableOpacity>
						</View>
						<View style={styles.spacer} />
						<NewButton
							title={isPending ? "Création..." : "Create Account"}
							onPress={handleRegister}
							disabled={isPending}
							style={{ opacity: role === null ? 0.7 : 1 }}
						/>
						{errorMsg ? <Text style={[styles.errorText, { marginTop: scale(4) }, {alignContent: "center"}]}>{errorMsg}</Text> : null}
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
			marginTop: scale(15),
		},
		inputPassword: {
			marginTop: scale(15),
			marginBottom: scale(-4),
		},
		roleRow: {
			flexDirection: "row" as const,
			gap: scale(10),
			marginTop: scale(30),
		},
		roleButton: {
			flex: 1,
			padding: scale(8),
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
			fontSize: scaleFont(12),
			fontStyle: "italic",
			marginLeft: scale(10),
			marginTop: scale(-4),
		},
	});
