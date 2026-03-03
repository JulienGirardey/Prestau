import api from './axios';

interface CreateCompanyProfileDto {
	companyName: string;
	address: string;
	siret: string;
	phoneNumber: string;
	establishment_type: string;
	description?: string;
	website?: string;
	social_media?: string;
}

export const createCompanyProfile = async (data: CreateCompanyProfileDto) => {
	const response = await api.post('/company', data);
	return response.data;
};
