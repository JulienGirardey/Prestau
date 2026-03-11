import { useThemeColors } from "@/hooks/useThemeColors";
import { View, TextInput, StyleSheet, StyleProp, ViewStyle } from "react-native"

// Props du composant InputBar
type Props = {
    value: string,
    onChange: (s: string) => void,
    placeholder?: string,
    style?: StyleProp<ViewStyle>
}

// Composant de barre de saisie personnalisée, utilisé pour les champs de formulaire
export function InputBar({ value, onChange, placeholder, style }: Props) {
    const colors = useThemeColors();
    return <View style={[styles.container, style]}>
        <TextInput placeholder={placeholder} placeholderTextColor="#898E95" onChangeText={onChange} value={value} style={[styles.container, { backgroundColor: colors.background }]} />
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 10,
        width: '100%',
    },
});