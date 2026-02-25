import { View, ViewProps, ViewStyle } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";

type Props = ViewProps & { children?: React.ReactNode };

export function Card({ style, children, ...rest }: Props) {
    const colors = useThemeColors();
    return (
        <View style={[styles, { backgroundColor: colors.primary, borderColor: colors.secondary }]} {...rest}>
            {children}
        </View>
    );
}

const styles = {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'flex-start',
    padding: 30,
    borderRadius: 15,
    borderWidth: 4,
    width: 328,
} satisfies ViewStyle;
