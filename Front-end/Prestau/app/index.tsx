import {StyleSheet, Text } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    // SafeAreaView will add padding to the top of the screen automatically on iOS to avoid the notch, and on Android to avoid the status bar
    <SafeAreaView style={styles.container}>
      <Text>Aurélie ? ça va ? oui!</Text>
      <Link href="/register">Go to Register</Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c9f4f0',
  },
});
