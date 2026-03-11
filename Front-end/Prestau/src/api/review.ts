import api from './axios';

export interface CreateReviewPayload {
    rating: number;
    comment?: string;
    jobId: number;
    reviewerType: string;
    reviewerId: number;
    revieweeType: string;
    revieweeId: number;
}

export const createReview = async (payload: CreateReviewPayload) => {
    const response = await api.post('/review', payload);
    return response.data;
};
