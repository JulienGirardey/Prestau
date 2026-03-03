import api from './axios';

export const getJobs = async () => (await api.get('/job'));

export const getMyJobs = async () => api.get('/job/my-jobs');
