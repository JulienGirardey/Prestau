import api from './axios';

export type JobOfferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';

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
        address: string;
        start_time: string;
        end_time: string;
        status: string;
        companyId: number;
        company?: { companyName: string; userId: number };
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
    return await api.delete(`/joboffer/cancel/${jobId}`); 
};

export const acceptJobOffer = async (offerId: number) => {
    return await api.post(`/joboffer/accept/${offerId}`);
};

export const rejectJobOffer = async (offerId: number) => {
    return await api.post(`/joboffer/reject/${offerId}`);
};
