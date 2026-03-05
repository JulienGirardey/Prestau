import api from './axios';
import { Job } from './job';

export interface JobOffer {
    id: number;
    contract_signed?: boolean;
    contract_url?: string;
    jobId: number;
    workerId: number;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
    signed_at?: string;
    selected_by_company: boolean;
    response_at?: string;
    requested_at?: string;
    createdAt: string;
    updatedAt: string;
		job : Job; // pour accéder aux détails du job directement depuis l'offre
}

export const getJobOfferById = async (id: number) => {
    const response = await api.get<JobOffer>(`/job-offer/${id}`);
    return response.data;
};

export const getJobOffersByCompany = async () => {
    const response = await api.get('/joboffer/my-offers');
    return response.data;
};