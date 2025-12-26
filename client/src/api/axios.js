import axios from 'axios'
import { useAuthStore } from '../auth/auth.store'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    const isAuthRequest = originalRequest.url?.includes('/login') || originalRequest.url?.includes('/register');

    if (error.response?.status === 401 && !isAuthRequest) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);
