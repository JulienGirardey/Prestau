import axios from 'axios';
import * as SecureStore from 'expo-secure-store';


// Création d'une instance d'axios avec une configuration de base
const api = axios.create({
	baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
	timeout: 10000, // Temps d'attente maximum pour une réponse du serveur
	headers: {
		'Content-Type': 'application/json',
	},
});

// Intercepteur pour ajouter le token JWT automatiquement
api.interceptors.request.use(async (AxiosRequesConfig) => {
	// AxiosRequesConfig = objet qui contient toute la config de la requête qui va partir (l'URL, les headers, le body...)
	const token = await SecureStore.getItemAsync('token'); // Récupère le token JWT stocké de manière sécurisée
	if (token) AxiosRequesConfig.headers.Authorization = `Bearer ${token}`; // Ajoute le token dans les en-têtes de la requête
	return AxiosRequesConfig; // Retourne la configuration modifiée pour que la requête puisse être envoyée
});

export default api; // Export de l'instance d'axios configurée pour être utilisée dans toute l'application
