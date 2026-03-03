import api from './axios';

interface CreateWorkerData {
	firstName: string;
	lastName: string;
	dateOfBirth: Date;
	phoneNumber: string;
	city: string;
	postalCode: number;
	profession: string;
	languages: string;
	skills: string;
	experience_years?: number;
	qualifications?: string;
	cv_url?: string;
	photoURL?: string;
}

// ------------------------------------------------------------------
// CRÉATION DU PROFIL
// ------------------------------------------------------------------
export const createWorkerProfile = async (data: CreateWorkerData) => {
	// Stocke le profil dans le stockage sécurisé côté serveur
	return api.post('/worker', data);
};

// ------------------------------------------------------------------
// GESTION DES DISPONIBILITÉS (CALENDRIER)
// ------------------------------------------------------------------

/**
 * Récupère les disponibilités du travailleur (jours libres et occupés)
 * Méthode: GET
 * Route attendue sur le backend: /worker/availability
 */
export const getWorkerAvailability = async () => {
    // Le token JWT est ajouté automatiquement par l'intercepteur axios
    const response = await api.get('/worker/availability');
    return response; 
	// Le dashboard s'attend à recevoir response.data.freeDays et response.data.busyDays
};

/**
 * Met à jour le statut d'une date spécifique 
 * Méthode: PATCH (ou POST selon la configuration de ton NestJS)
 * Route attendue sur le backend: /worker/availability
 * @param date - La date au format 'YYYY-MM-DD'
 * @param status - Le nouveau statut ('free', 'busy', ou 'neutral')
 */
export const updateWorkerAvailability = async (date: string, status: string) => {
    const response = await api.patch('/worker/availability', {
        date,
        status
    });
    return response.data;
};