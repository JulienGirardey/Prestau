import api from './axios';

export enum JobOfferStatus { 
	PENDING = 'PENDING',
	ACCEPTED = 'ACCEPTED',
	REJECTED = 'REJECTED',
	CANCELLED = 'CANCELLED',
	COMPLETED = 'COMPLETED',
}

export interface JobOffer {
    id: number;
    jobId: number;
    workerId: number;
    status: JobOfferStatus;
    createdAt: string;
    updatedAt: string;
    hasReviewed?: boolean;
    myRating?: number | null;
    myComment?: string | null;
    receivedRating?: number | null;
    receivedComment?: string | null;
    job: {
        id: number;
        title: string;
        description: string;
        salary: number;
        start_time: string;
        end_time: string;
        status: string;
        companyId: number;
        company?: { companyName: string; userId: number; address: string; city: string; postalCode: number };
    };
    worker?: {
        firstName: string;
        lastName: string;
        userId: number;
    };
}

export const getJobOfferById = async (id: number): Promise<JobOffer> => {
    const response = await api.get<JobOffer>(`/joboffer/${id}`);
    return response.data;
};

export const getMissionHistory = async (): Promise<JobOffer[]> => {
    const response = await api.get('/joboffer/history');
    return response.data;
};

export const getJobOffersByCompany = async (): Promise<JobOffer[]> => {
    const response = await api.get('/joboffer/my-offers');
    return response.data;
};

export const getJobOffersByWorker = async (): Promise<JobOffer[]> => {
    const response = await api.get('/joboffer/my-applications');
    return response.data;
};

export const createJobOffer = async (jobId: number): Promise<JobOffer> => {
  const response = await api.post(`/joboffer/${jobId}`);
  return response.data;
};

export const deleteJobOffer = async (jobId: number) => {
		const response = await api.delete(`/joboffer/cancel/${jobId}`);
		return response.data;
};

export const acceptJobOffer = async (offerId: number) => {
		const response = await api.post(`/joboffer/${offerId}/accept`);
		return response.data;
};

export const rejectJobOffer = async (offerId: number) => {
		const response = await api.post(`/joboffer/${offerId}/reject`);
		return response.data;
};

export const completeJobOffer = async (offerId: number) => {
		const response = await api.post(`/joboffer/${offerId}/complete`);
		return response.data;
};

export const cancelJobOffer = async (offerId: number) => {
		const response = await api.post(`/joboffer/${offerId}/cancel`);
		return response.data;
};

export const deleteJob = async (jobId: number) => {
	const response = await api.delete(`/job/${jobId}`);
	return response.data;
};