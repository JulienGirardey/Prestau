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
        <Link href="/dashboard-company" style={styles.link}><Text style={styles.linkText}>Dashboard Company</Text></Link>
        <Link href="/dashboard-worker" style={styles.link}><Text style={styles.linkText}>Dashboard Worker</Text></Link>
        <Link href="/workerCreation" style={styles.link}><Text style={styles.linkText}>Worker Creation</Text></Link>
        <Link href="/JobWorker" style={styles.link}><Text style={styles.linkText}>Job Worker</Text></Link>
        <Link href="/Message" style={styles.link}><Text style={styles.linkText}>Message</Text></Link>
        <Link href="/ProfileWorker" style={styles.link}><Text style={styles.linkText}>Profile Worker</Text></Link>
        <Link href="/create-job" style={styles.link}><Text style={styles.linkText}>Create Job</Text></Link>
		<Link href="/companyCreation" style={styles.link}><Text style={styles.linkText}>Company Creation</Text></Link>
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
