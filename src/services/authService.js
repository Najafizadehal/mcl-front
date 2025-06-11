import api from './api';

/**
 * POST /auth/login
 * @returns {Promise<{user: object, accessToken: string, refreshToken: string}>}
 */
export const login = (username, password) =>
  api.post('/auth/login', { username, password }).then(res => res.data.result);

/**
 * POST /auth/refresh
 * @param {string} refreshToken
 * @returns {Promise<{accessToken: string}>}
 */
export const refresh = refreshToken =>
  api.post('/auth/refresh', { refreshToken }).then(res => res.data.result);

export const logout = () => {
  localStorage.clear();
  return api.post('/auth/logout');
};

export const register = payload =>
  api.post('/auth/signup', payload).then(res => res.data);  