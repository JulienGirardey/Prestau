import api from './axios';

export type JobStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Job {
		id: number;
    title: string;
    description: string;
    salary: number;
    start_time: string;
    end_time: string;
    status: JobStatus;
		company?: { companyName: string; address: string; city: string; postalCode: number };
		isWorker?: boolean;
    canApply?: boolean;
    alreadyApplied?: boolean;
}

// créer un job (seulement pour les companies)
export const createJob = async (jobData: Omit<Job, 'id' | 'status' | 'company'>): Promise<Job> => {
		const response = await api.post('/job', jobData);
		return response.data;
};

// Obtenir la liste de tous les jobs disponibles par les workers
export const getJobs = async (): Promise<Job[]> => (await api.get('/job')).data;

// la company peut réupérer la liste de ses jobs postés
export const getMyJobs = async (): Promise<Job[]> => (await api.get('/job/my-jobs')).data;

// Obtnenir les détails d'un job spécifique par son id
export const getJobById = async (id: number): Promise<Job> => {
    const response = await api.get<Job>(`/job/${id}`);
    return response.data;
};
