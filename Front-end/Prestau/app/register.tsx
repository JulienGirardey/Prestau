import { StyleSheet, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColors";
import { DefaultCard } from "@/components/DefaultCard";
import { NewButton } from "@/components/Button";
import { InputBar } from "@/components/InputBar";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";


export default function Register() {
	const colors = useThemeColors();
	const [inputEmail, setEmail] = useState("");
	const [inputPassword, setInputPassword] = useState("");
	const [inputVerifyPassword, setInputVerifyPassword] = useState("");
	const [role, setRole] = useState<'worker' | 'company' | null>(null);
	const handleRegister = () => {
		if (!role) return;
	};
	return (
		<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
			<DefaultCard>
				<View style={styles.form}>
					<Image style={[styles.baseImageStyle, { borderColor: colors.secondary }]} source={require('@/assets/images/logo-prestau.jpg')} />
					<ThemedText variant="headline" style={styles.title}>Create Account</ThemedText>
					<InputBar style={inputStyle.inputEmail} placeholder="Email" value={inputEmail} onChange={setEmail} />
					<InputBar style={inputStyle.inputPassword} placeholder="Password" value={inputPassword} onChange={setInputPassword} />
					<InputBar style={inputStyle.inputVerifyPassword} placeholder="Verify password" value={inputVerifyPassword} onChange={setInputVerifyPassword} />
				</View>
				<View style={{ flexDirection: "row", gap: 7, marginTop: 48 }}>
					<TouchableOpacity
						onPress={() => setRole('worker')}
						style={[buttonRoleStyle.form, { backgroundColor: role === 'worker' ? Colors.light.secondary : 'transparent' }]}>
						<ThemedText style={buttonRoleStyle.Text}>Worker</ThemedText>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => setRole('company')}
						style={[buttonRoleStyle.form, { backgroundColor: role === 'company' ? Colors.light.secondary : 'transparent' }]}>
						<ThemedText style={buttonRoleStyle.Text}>Company</ThemedText>
					</TouchableOpacity>
				</View>
				<View style={styles.spacer} />
				<NewButton
					title="Create Account"
					onPress={handleRegister}
					style={{ opacity: role === null ? 0.7 : 1 }}
				/>
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

const buttonRoleStyle = StyleSheet.create({
		form: {
		flex: 1,
		padding: 7,
		borderRadius: 13,
		borderWidth: 2,
		borderColor: Colors.light.secondary,
		alignItems: 'center'
		},

		Text: {
			color: '#ffffff',
			fontSize: 13.5,
		},
});