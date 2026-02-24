import { View } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { StyleSheet } from "react-native";
import { Card } from "@/components/Card";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { InputBar } from "@/components/InputBar";
import React from "react";
import { NewButton } from "@/components/Button";

export default function login() {
	const colors = useThemeColors();
	const [inputEmail, setEmail] = React.useState("");
	const [inputPassword, setPassword] = React.useState("");
	return (
		<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
			<Card>
				<View style ={styles.form}>
					<ThemedText variant="headline" style={styles.title}>Login</ThemedText>
					<InputBar style={inputStyle.inputEmail} placeholder="Email" value={inputEmail} onChange={setEmail} />
					<InputBar style={inputStyle.inputPassword} placeholder="Password" value={inputPassword} onChange={setPassword}/>
				</View>
				<View style={styles.spacer} />
				<NewButton title="Sign in" />
			</Card>
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

});

const inputStyle = StyleSheet.create({
	inputEmail: {
		marginTop: 30,
	},

	inputPassword: {
	},
});
