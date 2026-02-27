import { View, Image, useWindowDimensions, StyleSheet } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { DefaultCard } from "@/components/DefaultCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { InputBar } from "@/components/InputBar";
import React from "react";
import { NewButton } from "@/components/Button";
import { login } from "@/src/api/auth";

export default function Login() {
	const colors = useThemeColors();
	const [inputEmail, setEmail] = React.useState("");
	const [inputPassword, setPassword] = React.useState("");
	const { width, height } = useWindowDimensions();
	const handleLogin = async () => {
		try {
			const result = await login(inputEmail, inputPassword);
			console.log('succès', result);
		} catch (error) {
			console.log('erreur', error);
		}
	};
	return (
		<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
			<DefaultCard style={{ height: Math.min(height * 0.25, 135), width: Math.min(width * 0.8, 400) }}>
				<View style={styles.form}>
					<Image style={[styles.baseImageStyle, { borderColor: colors.secondary }]} source={require('@/assets/images/logo-prestau.jpg')} />
					<ThemedText variant="headline" style={styles.title}>Login</ThemedText>
					<InputBar style={inputStyle.inputEmail} placeholder="Email" value={inputEmail} onChange={setEmail} />
					<InputBar style={inputStyle.inputPassword} placeholder="Password" value={inputPassword} onChange={setPassword} />
				</View>
				<View style={styles.spacer} />
				<NewButton title="Sign in" onPress={handleLogin} />
			</DefaultCard>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		padding: 100,
	},

	title: {
		paddingTop: 30,
		fontSize: 31,
		textAlign: "center",
	},

	form: {
		width: "100%"
	},

	spacer: {
		flex: 0.5
	},

	baseImageStyle: {
		width: 80,
		height: 80,
		alignSelf: "center",
		borderRadius: 5,
		borderWidth: 2
	},

});

const inputStyle = StyleSheet.create({
	inputEmail: {
		marginTop: 30,
	},

	inputPassword: {
	},
});

