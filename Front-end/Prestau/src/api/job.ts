import api from './axios';

export interface Job {
    id: number;
    title: string;
    description: string;
    salary: number;
    address: string;
    start_time: string;
    end_time: string;
    status: string;
    companyId: number;
    createdAt: string;
    updatedAt: string;
}

export const getJobs = async () => {
    const response = await api.get<Job[]>('/job');
    return response.data;
};

export const getJobById = async (id: number) => {
    const response = await api.get<Job>(`/job/${id}`);
    return response.data;
};

export const getMyJobs = async () => {
    const response = await api.get('/job/my-jobs');
    return response.data;
};
