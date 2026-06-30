import api from './axios';
import * as SecureStore from 'expo-secure-store';

// Interface pour typer le payload JWT
export interface JwtPayload {
    role: string;
    sub: number;
    iat?: number;
    exp?: number;
}

export const register = async (email: string, password: string, role: 'WORKER' | 'COMPANY') => {
  const response = await api.post('/auth/register', { email, password, role });
  await SecureStore.setItemAsync('access_token', response.data.access_token);
  await SecureStore.setItemAsync('refresh_token', response.data.refresh_token);
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  await SecureStore.setItemAsync('access_token', response.data.access_token);
  await SecureStore.setItemAsync('refresh_token', response.data.refresh_token);
  return response.data;
};

export const logout = async () => {
  try {
    await api.post('/auth/logout'); // invalide le refresh token en base
  } catch (error) {
    // on logout quand même si le back est inaccessible
  } finally {
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('refresh_token');
  }
};

export const refreshToken = async () => {
  const token = await SecureStore.getItemAsync('refresh_token');
  if (!token) throw new Error('No refresh token available'); // cas où le token aurait déjà été supprimé
  const response = await api.post('/auth/refresh-token', { refreshToken: token });
  await SecureStore.setItemAsync('access_token', response.data.access_token);
  await SecureStore.setItemAsync('refresh_token', response.data.refresh_token);
  return response.data;
};
