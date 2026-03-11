import { StyleSheet, Text, View, Image, useWindowDimensions } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

// Hook responsive pour adapter les tailles en fonction de la largeur de l'écran
function useResponsive() {
	const { width, height } = useWindowDimensions();
	const scale = (size: number) => (width / 390) * size;
	const scaleFont = (size: number) => Math.min(scale(size), size * 1.4);
	return { width, height, scale, scaleFont };
}

// Composant de page d'accueil, affichant le logo de l'application et des liens vers les pages de login et d'inscription
export default function Index() {
	const { scale, scaleFont } = useResponsive();
	const styles = getStyles(scale, scaleFont);

	return (
		<SafeAreaView style={styles.container}>
			<Image
				source={require('@/assets/images/logo-prestau.jpg')}
				style={styles.logo}
			/>
			<Text style={styles.title}>Prestau</Text>
			<View style={styles.linksContainer}>
				<Link href="/register" style={styles.link}><Text style={styles.linkText}>Register</Text></Link>
				<Link href="/login" style={styles.link}><Text style={styles.linkText}>Login</Text></Link>
				<Link href="/dashboard-worker" style={styles.link}><Text style={styles.linkText}>Dashboard Worker</Text></Link>
				<Link href="/dashboard-company" style={styles.link}><Text style={styles.linkText}>Dashboard Company</Text></Link>
				<Link href="/workerCreation" style={styles.link}><Text style={styles.linkText}>Worker Creation</Text></Link>
				<Link href="/companyCreation" style={styles.link}><Text style={styles.linkText}>Company Creation</Text></Link>
			</View>
		</SafeAreaView>
	);
}

const getStyles = (scale: (n: number) => number, scaleFont: (n: number) => number) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: '#F5F2D9',
			alignItems: 'center',
			justifyContent: 'center',
			padding: scale(40),
		},
		logo: {
			width: scale(120),
			height: scale(120),
			borderRadius: scale(10),
			marginBottom: scale(10),
			borderWidth: 2,
			borderColor: '#EE4832',
		},
		title: {
			color: '#264d84',
			fontSize: scaleFont(25),
			fontWeight: 'bold',
			marginBottom: scale(40),
		},
		linksContainer: {
			width: '90%',
			gap: scale(12),
		},
		link: {
			backgroundColor: '#264d84',
			paddingVertical: scale(15),
			paddingHorizontal: scale(20),
			borderRadius: scale(10),
			alignItems: 'center',
		},
		linkText: {
			color: '#fff',
			fontSize: scaleFont(16),
			fontWeight: '600',
			textAlign: 'center',
		},
	});
