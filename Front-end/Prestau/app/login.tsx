import { View, Image, useWindowDimensions, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Text } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { DefaultCard } from "@/components/DefaultCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { InputBar } from "@/components/InputBar";
import React from "react";
import { NewButton } from "@/components/Button";
import { login } from "@/src/api/auth";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { useMutation } from "@tanstack/react-query";

// Hook responsive pour adapter les tailles en fonction de la largeur de l'écran
function useResponsive() {
	const { width, height } = useWindowDimensions();
	const scale = (size: number) => (width / 390) * size;
	const scaleFont = (size: number) => Math.min(scale(size), size * 1.4);
	return { width, height, scale, scaleFont };
}

// Composant de page de login, avec un formulaire pour l'email et le mot de passe, et un bouton pour se connecter
export default function Login() {
	const colors = useThemeColors();
	const { scale, scaleFont } = useResponsive();
	const styles = getStyles(scale, scaleFont);
	const [inputEmail, setEmail] = React.useState("");
	const [inputPassword, setPassword] = React.useState("");
	const [errorMsg, setErrorMsg] = React.useState("");

	// Mutation pour gérer la connexion, avec gestion des succès et erreurs
	const { mutate: submitLogin, isPending } = useMutation({
		mutationFn: () => login(inputEmail, inputPassword),
		// En cas de succès, décoder le token pour récupérer le rôle de l'utilisateur et rediriger vers la page correspondante
		onSuccess: (result) => {
			setErrorMsg("");
			const token = result.access_token;
			const decoded: any = jwtDecode(token);
			const role = decoded.role;
			console.log('succès, rôle:', role);
			console.log('Token reçu:', token);
			if (role === 'COMPANY') {
				router.replace('/(tabs-company)/dashboard-company');
			} else {
				router.replace('/(tabs-worker)/dashboard-worker');
			}
		},
		// En cas d'erreur, afficher un message d'erreur approprié
		onError: (error: any) => {
			console.error('erreur', error);
			const msg = error?.response?.data?.message;
			if (msg === 'Invalid credentials' || msg === 'User not found') {
				setErrorMsg("Email ou mot de passe incorrect.");
			} else {
				setErrorMsg("Erreur lors de la connexion. Veuillez réessayer.");
			}
		}
	});

	// Validation des champs avant de lancer la connexion
	const handleLogin = () => {
		if (!inputEmail.trim() || !inputPassword.trim()) {
			setErrorMsg("Veuillez remplir tous les champs.");
			return;
		}
		setErrorMsg("");
		submitLogin();
	};

	// Le rendu de la page de login, avec un formulaire pour l'email et le mot de passe, et un bouton pour se connecter
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
							<ThemedText variant="headline" style={styles.title}>Login</ThemedText>
							<InputBar style={styles.inputEmail} placeholder="Email" value={inputEmail} onChange={setEmail} />
							<InputBar style={styles.inputPassword} placeholder="Password" secureTextEntry={true} value={inputPassword} onChange={setPassword} />
						</View>
						{errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
						<View style={styles.spacer} />
						<NewButton title={isPending ? "Connexion..." : "Connexion"} onPress={handleLogin} disabled={isPending} />
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
			marginBottom: scale(10),
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
