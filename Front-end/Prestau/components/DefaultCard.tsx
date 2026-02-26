import { View, ViewProps, ViewStyle, useWindowDimensions } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";

type Props = ViewProps & { children?: React.ReactNode };

export function DefaultCard({ style, children, ...rest }: Props) {
    const colors = useThemeColors();
    const { height } = useWindowDimensions();
    return (
        <View style={[styles, { backgroundColor: colors.primary, borderColor: colors.secondary, padding: height * 0.02 }, style]} {...rest}>
            {children}
        </View>
    );
}

const styles = {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    borderWidth: 4,
} satisfies ViewStyle;
