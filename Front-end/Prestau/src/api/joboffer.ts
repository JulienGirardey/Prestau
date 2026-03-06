import api from './axios';

export interface JobOffer {
    id: number;
    jobId: number;
    workerId: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    job: {
        id: number;
        title: string;
        description: string;
        salary: number;
        address: string;
        start_time: string;
        end_time: string;
        status: string;
        companyId: number;
    };
}

export const getMyJobOffers = async (): Promise<JobOffer[]> => {
	const response = await api.get<JobOffer[]>('/joboffer/my-offers');
	return response.data;
};

export const getMissionHistory = async () => {
    const response = await api.get('/joboffer/history');
    return response.data;
};

export const getJobOffersByCompany = async () => {
    const response = await api.get('/joboffer/my-offers');
    return response.data;
};

export const getJobOffersByWorker = async () => {
    const response = await api.get('/joboffer/my-applications');
    return response.data;
};