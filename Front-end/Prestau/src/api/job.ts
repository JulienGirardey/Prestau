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
		company?: { companyName: string; address: string; city: string; postalCode: number; userId?: number };
		isWorker?: boolean;
    canApply?: boolean;
    alreadyApplied?: boolean;
    hasReviewed?: boolean;
    // Champs supplémentaires retournés par getJobById (non présents sur la liste)
    jobOffers?: {
        id: number;
        status: string;
        createdAt: string;
        worker?: {
            firstName: string;
            lastName: string;
            city?: string;
            phoneNumber?: string;
            profession?: string;
        };
    }[];
}

// créer un job (seulement pour les companies)
export const createJob = async (jobData: Omit<Job, 'id' | 'status' | 'company'>): Promise<Job> => {
		const response = await api.post('/job', jobData);
		return response.data;
};

// Obtenir la liste de tous les jobs disponibles par les workers (avec recherche optionnelle)
export const getJobs = async (search?: string): Promise<Job[]> => {
	const params = search?.trim() ? { search: search.trim() } : {};
	return (await api.get('/job', { params })).data;
};

// la company peut réupérer la liste de ses jobs postés
export const getMyJobs = async (): Promise<Job[]> => (await api.get('/job/my-jobs')).data;

// Obtenir les détails d'un job spécifique par son id
export const getJobById = async (id: number): Promise<Job> => {
    const response = await api.get<Job>(`/job/${id}`);
    return response.data;
};

// Modifier un job (seulement pour la company qui a créé le job)
export const updateJob = async (id: number, jobData: Partial<Omit<Job, 'id' | 'status' | 'company'>>): Promise<Job> => {
	const response = await api.patch(`/job/${id}`, jobData);
	return response.data;
};
