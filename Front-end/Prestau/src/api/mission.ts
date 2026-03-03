import api from './axios';

export interface Mission {
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

export const getMissions = async () => {
    const response = await api.get<Mission[]>('/job');
    return response.data;
};

export const getMissionById = async (id: number) => {
    const response = await api.get<Mission>(`/job/${id}`);
    return response.data;
};