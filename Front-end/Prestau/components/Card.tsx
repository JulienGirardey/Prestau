import { Image, View, ViewProps, ViewStyle } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";

type Props = ViewProps & { children?: React.ReactNode };

export function Card({ style, children, ...rest }: Props) {
    const colors = useThemeColors();
    return (
        <View style={[style, styles, { backgroundColor: colors.primary, borderColor: colors.secondary }]} {...rest}>
            <Image style={[baseImageStyle, { borderColor: colors.secondary }]} source={require('@/assets/images/logo-prestau.jpg')} />
            {children}
        </View>
    );
}

const styles = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 30,
    borderRadius: 15,
    borderWidth: 4,
    width: 327,
} satisfies ViewStyle;

const baseImageStyle = {
    width: 80,
    height: 80,
    borderRadius: 5,
    borderWidth: 2
}