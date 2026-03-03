import api from './axios';

interface CreateWorkerProfileDto {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  phoneNumber: string;
  city: string;
  postalCode: number;
  profession: string;
  languages: string;
  skills: string;
  experience_years?: number;
  qualifications?: string;
  cv_url?: string;
  photoURL?: string;
}

export const createWorkerProfile = async (data: CreateWorkerProfileDto) => {
  const response = await api.post('/worker', data);
  return response.data;
};
