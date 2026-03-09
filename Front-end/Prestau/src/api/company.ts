import api from './axios';

interface CreateCompanyProfileDto {
	companyName: string;
	address: string;
	postalCode: number;
	city: string;
	siret: string;
	phoneNumber: string;
	establishment_type: string;
	description?: string;
	website?: string;
	social_media?: string;
}

interface CompanyProfile {
	id: number;
	companyName: string;
	address: string;
	postalCode: number;
	city: string;	
}

export const createCompanyProfile = async (data: CreateCompanyProfileDto) => {
	const response = await api.post('/company', data);
	return response.data;
};

export const getCompanyProfile = async (): Promise<CompanyProfile> => {
	const response = await api.get('/company/MyCompany');
	return response.data;
};
