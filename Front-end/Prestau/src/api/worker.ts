import api from './axios';

// ------------------------------------------------------------------
// CRÉATION DU PROFIL
// ------------------------------------------------------------------
export const createWorkerProfile = async (
	firstName: string,
	lastName: string,
	dateOfBirth: Date,
	phoneNumber: string,
	city: string,
	postalCode: number,
	profession: string,
	languages: string,
	skills: string,
	experience_years?: number,
	qualifications?: string,
	cv_url?: string,
	photoURL?: string,
) => {
	const profileData = {
		firstName,
		lastName,
		dateOfBirth,
		phoneNumber,
		city,
		postalCode,
		profession,
		languages,
		skills,
		experience_years,
		qualifications,
		cv_url,
		photoURL,
	};

	// Stocke le profil dans le stockage sécurisé côté serveur
	const response = await api.post('/worker', profileData); 
	return response.data;
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