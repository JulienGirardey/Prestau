import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Création d'une instance d'axios avec une configuration de base
const api = axios.create({
	baseURL: process.env.EXPO_PUBLIC_API_URL,
	timeout: 10000, // Temps d'attente maximum pour une réponse du serveur
	headers: {
		'Content-Type': 'application/json',
	},
});

// Injecte le token JWT automatiquement dans chaque requête
api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('access_token');
    console.log('Token envoyé:', token);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
	(response) => response, // Si la réponse est réussie, on la retourne telle quelle
	async (error) => {
		if (error.response && error.response.status === 401) {
			// Token invalide ou expiré, on nettoie et redirige
      await SecureStore.deleteItemAsync('access_token');
      await SecureStore.deleteItemAsync('refresh_token');
		}
		else if (error.response && error.response.status === 400) {
			console.error("Bad request:", error.response.data); // Log des erreurs 400 pour aider au debugging
		}
		return Promise.reject(error); // Rejette l'erreur pour que les composants qui ont fait la requête puissent la gérer
	}
);

export default api; // Export de l'instance d'axios configurée pour être utilisée dans toute l'application
