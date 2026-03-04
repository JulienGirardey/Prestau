import { api } from "./axios";

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
	const response = await api.get<JobOffer[]>('/job-offer/my-offers');
	return response.data;
};

export const acceptJobOffer = async (offerId: number) => {
	await api.post(`/job-offer/${offerId}/accept`);
};