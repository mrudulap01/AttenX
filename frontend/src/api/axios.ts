import axios from 'axios';
import { useAuthStore } from '../features/auth/store/authStore';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  withCredentials: true, // This ensures HttpOnly cookies (RefreshToken) are sent with every request
});

// Interceptor to attach the short-lived Access Token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle 401s and attempt silent token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 Unauthorized and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh the token using the HttpOnly cookie
        const res = await axios.post('http://localhost:8080/api/v1/auth/refresh', {}, { withCredentials: true });
        
        const { accessToken, role, email, firstName } = res.data;
        
        // Update the Zustand store with the new access token
        useAuthStore.getState().setAuth(accessToken, role, email, firstName);
        
        // Attach the new token to the failed request and retry it
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        // If refresh fails (e.g., Refresh Token expired), clear state and force login
        useAuthStore.getState().clearAuth();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
