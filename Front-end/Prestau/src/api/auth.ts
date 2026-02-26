import api from './axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const register = async (email: string, password: string, role: 'WORKER' | 'COMPANY') => {
    const response = await api.post('/auth/register', { email, password, role });
    await AsyncStorage.setItem('token', response.data.access_token);
    return response.data;
};

export const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    await AsyncStorage.setItem('token', response.data.access_token);
    return response.data;
};
