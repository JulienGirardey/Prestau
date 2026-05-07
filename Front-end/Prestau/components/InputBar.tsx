import { useThemeColors } from "@/hooks/useThemeColors";
import { View, TextInput, StyleSheet, StyleProp, ViewStyle, TouchableOpacity } from "react-native"
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

// Props du composant InputBar
type Props = {
	value: string,
	onChange: (s: string) => void,
	placeholder?: string,
	style?: StyleProp<ViewStyle>,
	secureTextEntry?: boolean
}

export function InputBar({ value, onChange, placeholder, style, secureTextEntry }: Props) {
	const colors = useThemeColors();
	const [isVisible, setIsVisible] = useState(false);
	const [selection, setSelection] = useState<{ start: number; end: number } | undefined>(undefined);
	return (
		<View style={[styles.container, { backgroundColor: colors.background }, style]}>
			<TextInput
				value={value}
				onChangeText={onChange}
				placeholder={placeholder}
				secureTextEntry={secureTextEntry && !isVisible}
				selection={selection}
				onFocus={() => {
					if (secureTextEntry) {
						setSelection({ start: value.length, end: value.length });
					}
				}}
				onSelectionChange={() => {
					if (selection !== undefined) setSelection(undefined);
				}}
				style={styles.textInput}
			/>
			{secureTextEntry && (
				<TouchableOpacity onPress={() => setIsVisible(!isVisible)} style={styles.eyeIcon}>
					<Ionicons
						name={isVisible ? "eye-off" : "eye"}
						size={20}
						color="#000000"
					/>
				</TouchableOpacity>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
		marginTop: 9,
		marginBottom: 9,
		borderRadius: 10,
		width: '100%',
	},
	textInput: {
		flex: 1,
		fontSize: 14,
	},
	eyeIcon: {
		marginLeft: 8,
	},
});