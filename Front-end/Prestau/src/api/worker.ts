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

export const createWorkerProfile = async (data: CreateWorkerData) => {
	return api.post('/worker', data);
};

export const getWorkerAvailability = async () => {
    const response = await api.get('/worker/availability');
    return response; 

};
export const updateWorkerAvailability = async (date: string, status: string) => {
    const response = await api.patch('/worker/availability', {
        date,
        status
    });
    return response.data;
};