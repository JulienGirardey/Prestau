import api from './axios';
import * as SecureStore from 'expo-secure-store';

export const register = async (email: string, password: string, role: 'WORKER' | 'COMPANY') => {
	const response = await api.post('/auth/register', { email, password, role });
	await SecureStore.setItemAsync('token', response.data.access_token);
	return response.data;
};

export const login = async (email: string, password: string) => {
	const response = await api.post('/auth/login', { email, password });
	await SecureStore.setItemAsync('token', response.data.access_token);
	return response.data;
};
