// src/api/axiosInstance.js
import axios from 'axios';

let logoutHandler = () => {};

export const setLogoutHandler = (handler) => {
  logoutHandler = handler;
};

const axiosInstance = axios.create({
  baseURL: 'https://server-client.ngrok.app'
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
          const { data } = await axiosInstance.post('/api/token/refresh/', {
              refresh: refreshToken,
            });
          localStorage.setItem('accessToken', data.access);
          originalRequest.headers['Authorization'] = `Bearer ${data.access}`;
            return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Trigger logout on refresh failure
          logoutHandler();
          return Promise.reject(refreshError);
        }
        }
      }
      return Promise.reject(error);
    }
  );

export default axiosInstance;