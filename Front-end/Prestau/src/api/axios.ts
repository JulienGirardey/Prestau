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
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config; // On garde en mémoire la requête qui a échoué.

    if (error.response?.status === 401 && !originalRequest._retry) { // Si l'API renvoie 401 Unauthorized et qu'on n'a pas déjà tenté un renouvellement du token.
      originalRequest._retry = true; // Empêche de refaire plusieurs fois la même tentative de refresh.

      try {
        const refreshToken = await SecureStore.getItemAsync('refresh_token'); // Lit le refresh token stocké sur le téléphone.
        // S'il n'existe pas, on considère que l'utilisateur doit se reconnecter
        if (!refreshToken) throw new Error('No refresh token');

        // demande d'un nouveau token
        const { data } = await axios.post( // axios natif, pas "api", pour éviter de repasser dans l'intercepteur
          `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh-token`,
          { refreshToken } // envoie du refresh token dans le corps de la requête
        );

        await SecureStore.setItemAsync('access_token', data.access_token); // Stocke le nouveau token d'accès
        await SecureStore.setItemAsync('refresh_token', data.refresh_token); // Stocke le nouveau refresh token

        // Rejoue la requête originale avec le nouveau token
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`; // Met à jour le header avec le nouveau token
        return api(originalRequest); // Rejoue automatiquement la requête qui avait échoué

      } catch { // si echec, refresh expiré ou invalide → déconnexion propre
        await SecureStore.deleteItemAsync('access_token'); // Supprime le token d'accès
        await SecureStore.deleteItemAsync('refresh_token'); // Supprime le refresh token
      }
    }

    if (error.response?.status === 400) { // Vérifie si l'erreur est une mauvaise requête
      console.error('Bad request:', error.response.data); // Affiche les détails de l'erreur pour aider au débogage
    }

    return Promise.reject(error);
  }
);

export default api; // Export de l'instance d'axios configurée pour être utilisée dans toute l'application
