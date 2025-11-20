// src/services/api.js
import axios from 'axios';
import { refresh } from './authService';
import config from '../config/env';

const api = axios.create({
  baseURL: config.API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(requestConfig => {
  const token = localStorage.getItem('token');
  if (token) {
    requestConfig.headers = requestConfig.headers || {};
    requestConfig.headers['Authorization'] = `Bearer ${token}`;
  }
  return requestConfig;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => (error ? prom.reject(error) : prom.resolve(token)));
  failedQueue = [];
};

api.interceptors.response.use(
  res => res,
  async err => {
    const { config: originalConfig, response } = err;
    if (response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalConfig.headers.common['Authorization'] = `Bearer ${token}`;
          return api(originalConfig);
        });
      }
      isRefreshing = true;
      try {
        const { accessToken } = await refresh();
        localStorage.setItem('token', accessToken);
        api.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
        processQueue(null, accessToken);
        originalConfig.headers.common['Authorization'] = `Bearer ${accessToken}`;
        return api(originalConfig);
      } catch (e) {
        processQueue(e, null);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  }
);

export default api;

