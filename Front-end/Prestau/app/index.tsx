import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Prestau - Dev</Text>
      <View style={styles.linksContainer}>
        <Link href="/register" style={styles.link}><Text style={styles.linkText}>Register</Text></Link>
        <Link href="/login" style={styles.link}><Text style={styles.linkText}>Login</Text></Link>
        <Link href="/history" style={styles.link}><Text style={styles.linkText}>History</Text></Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c9f4f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  linksContainer: {
    width: '80%',
    gap: 12,
  },
  link: {
    backgroundColor: '#4a90d9',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
