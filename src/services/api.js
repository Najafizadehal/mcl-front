import axios from 'axios';
import { refresh } from './authService';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081/',
  withCredentials: true             // اگر قصد ارسال کوکی دارید
});

// ➊ ‌درخواست‌ها ─ افزودن Header
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ➋ پاسخ‌ها ─ رفرش توکن در برخورد با 401
let isRefreshing = false;
let failedQueue  = [];

const processQueue = (error, newToken) => {
  failedQueue.forEach(p => (error ? p.reject(error) : p.resolve(newToken)));
  failedQueue = [];
};

api.interceptors.response.use(
  res => res,
  async err => {
    const originalReq = err.config;

    // اگر 401 و قبلاً تلاش نکرده‌ایم
    if (err.response?.status === 401 && !originalReq._retry) {
      originalReq._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalReq.headers.Authorization = `Bearer ${token}`;
            return api(originalReq);
          })
          .catch(Promise.reject);
      }

      isRefreshing = true;
      const refreshToken = localStorage.getItem('refreshToken');

      try {
        const { accessToken } = await refresh(refreshToken);
        localStorage.setItem('token', accessToken);
        api.defaults.headers.Authorization = `Bearer ${accessToken}`;
        processQueue(null, accessToken);
        originalReq.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalReq);       // درخواست اول تکرار می‌شود
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.clear();
        window.location.assign('/login');
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default api;
