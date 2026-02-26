import { StyleSheet, View, Image, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColors";
import { DefaultCard } from "@/components/DefaultCard";
import { NewButton } from "@/components/Button";
import { InputBar } from "@/components/InputBar";
import { useState } from "react";


export default function Register() {
	const colors = useThemeColors();
	const [inputEmail, setEmail] = useState("");
	const [inputPassword, setInputPassword] = useState("");
	const [inputVerifyPassword, setInputVerifyPassword] = useState("");
	const { width, height } = useWindowDimensions();
	return (
		<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
			<DefaultCard style={{ height: Math.min(height * 0.25, 135), width: Math.min(width * 0.8, 400) }}>
				<View style={styles.form}>
					<Image style={[styles.baseImageStyle, { borderColor: colors.secondary }]} source={require('@/assets/images/logo-prestau.jpg')} />
					<ThemedText variant="headline" style={styles.title}>Create Account</ThemedText>
					<InputBar style={inputStyle.inputEmail} placeholder="Email" value={inputEmail} onChange={setEmail} />
					<InputBar style={inputStyle.inputPassword} placeholder="Password" value={inputPassword} onChange={setInputPassword} />
					<InputBar style={inputStyle.inputVerifyPassword} placeholder="Verify password" value={inputVerifyPassword} onChange={setInputVerifyPassword} />
				</View>
				<View style={styles.spacer} />
				<NewButton title="Create Account" />
			</DefaultCard>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		padding: 100
	},
	title: {
		paddingTop: 30,
		fontSize: 31,
		textAlign: "center"
	},

	form: {
		width: "100%"
	},
	spacer: {
		flex: 1
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
		marginBottom: 30,
		marginTop: 15
	},
	inputPassword: {
	},
	inputVerifyPassword: {
	}
});
