import api from './axios';
import * as SecureStore from 'expo-secure-store';

export interface AuthResponse {
    access_token: string;
    user: {
        id: number;
        email: string;
        role: string;
    };
}

export const register = async (email: string, password: string, role: 'WORKER' | 'COMPANY'): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', { email, password, role });
    await SecureStore.setItemAsync('token', response.data.access_token);
    await SecureStore.setItemAsync('user', JSON.stringify(response.data.user));
    return response.data;
};

export const login = async (email: string, password: string, role: 'WORKER' | 'COMPANY'): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password, role });
    await SecureStore.setItemAsync('token', response.data.access_token);
    await SecureStore.setItemAsync('user', JSON.stringify(response.data.user));
    return response.data;
};

export const logout = async () => {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('user');
};

export const getCurrentUser = async () => {
    const userStr = await SecureStore.getItemAsync('user');
    return userStr ? JSON.parse(userStr) : null;
};

export const getToken = async () => {
    return await SecureStore.getItemAsync('token');
};
