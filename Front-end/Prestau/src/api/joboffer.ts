import api from "./axios";

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

export const getJobOffersByCompany = async () => {
    const response = await api.get('/joboffer/my-offers');
    return response.data;
};

export const createJobOffer = async (jobId: number) => {
	const response = await api.post(`/joboffer/${jobId}`);
	return response.data;
};