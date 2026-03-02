import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Création d'une instance d'axios avec une configuration de base
const api = axios.create({
	baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.14:3000',
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

api.interceptors.response.use(
	(response) => response, // Si la réponse est réussie, on la retourne telle quelle
	(error) => {
		if (error.response && error.response.status === 401) {
			SecureStore.deleteItemAsync('token'); // Si le serveur répond avec une erreur 401 (non autorisé), on supprime le token stocké
		}
		else if (error.response && error.response.status === 400) {
			console.error("Bad request:", error.response.data); // Log des erreurs 400 pour aider au debugging
		}
		return Promise.reject(error); // Rejette l'erreur pour que les composants qui ont fait la requête puissent la gérer
	}
);

export default api; // Export de l'instance d'axios configurée pour être utilisée dans toute l'application
