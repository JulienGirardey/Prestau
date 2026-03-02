import api from './axios';

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

	const response = await api.post('/worker', profileData); // Stocke le profil dans le stockage sécurisé
	return response.data;
};
