import api from './axios';

export type JobStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Job {
		id: number;
    title: string;
    description: string;
    salary: GLfloat;
    address: string;
    start_time: string;
    end_time: string;
    status: JobStatus;
		companyId: number;
}

// créer un job (seulement pour les companies)
export const createJob = async (jobData: Omit<Job, 'id' | 'status' | 'companyId'>) => {
		const response = await api.post('/job', jobData);
		return response.data;
};

// Obtenir la liste de tous les jobs disponibles par les workers
export const getJobs = async () => (await api.get('/job')).data;

// la company peut réupérer la liste de ses jobs postés
export const getMyJobs = async () => (await api.get('/job/my-jobs')).data;

// Obtnenir les détails d'un job spécifique par son id
export const getJobById = async (id: number) => {
    const response = await api.get<Job>(`/job/${id}`);
    return response.data;
};
