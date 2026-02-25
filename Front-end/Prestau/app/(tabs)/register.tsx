import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Card } from "@/components/Card";
import { NewButton } from "@/components/Button";
import { InputBar } from "@/components/InputBar";
import { useState } from "react";


export default function Register() {
    const colors = useThemeColors();
    const [inputEmail, setEmail] = useState("");
    const [inputPassword, setInputPassword] = useState("");
    const [inputVerifyPassword, setInputVerifyPassword] = useState("");
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <Card style={styles.body}>
                <View style={styles.form}>
                    <ThemedText variant="headline" style={styles.title}>Create Account</ThemedText>
                    <InputBar style={inputStyle.inputEmail} placeholder="Email" value={inputEmail} onChange={setEmail} />
                    <InputBar style={inputStyle.inputPassword} placeholder="Password" value={inputPassword} onChange={setInputPassword} />
                    <InputBar style={inputStyle.inputVerifyPassword} placeholder="Verify password" value={inputVerifyPassword} onChange={setInputVerifyPassword} />
                </View>
                <View style={styles.spacer} />
                <NewButton style={styles.buttonCreateAccount} title="Create Account" />
            </Card>
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
    body: {
        flex: 1,
        justifyContent: "space-between"
    },
    form: {
        width: "100%"
    },
    spacer: {
        flex: 1
    },
    buttonCreateAccount: {
        marginTop: 30
    }
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
