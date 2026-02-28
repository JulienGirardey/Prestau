import api from './axios';

export const getJobs = async () => (await api.get('/job'));

export const getJobById = async (id: number) => (await api.get(`/job/${id}`));
