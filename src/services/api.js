// src/services/api.js
import axios from 'axios';
import { refresh } from './authService';

const api = axios.create({
  // آدرس بک‌اند را از متغیر محیطی می‌گیرد؛
  // در حالت توسعه (npm start) از .env.development و در حالت پرود از .env.production خوانده می‌شود.
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081',
  withCredentials: true,              // ارسال کوکی‌ها (در صورت نیاز)
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => error ? prom.reject(error) : prom.resolve(token));
  failedQueue = [];
};

api.interceptors.response.use(
  res => res,
  async err => {
    const { config, response } = err;
    if (response?.status === 401 && !config._retry) {
      config._retry = true;
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          config.headers.common['Authorization'] = `Bearer ${token}`;
          return api(config);
        });
      }
      isRefreshing = true;
      try {
        const { accessToken } = await refresh();
        localStorage.setItem('token', accessToken);
        api.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
        processQueue(null, accessToken);
        config.headers.common['Authorization'] = `Bearer ${accessToken}`;
        return api(config);
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

