import api from './api';

/**
 * POST /auth/login
 * @returns {Promise<{accessToken: string, user: object}>}
 */
export const login = (username, password) =>
  api.post('/auth/login', { username, password }).then(res => res.data);

export const register = payload =>
  api.post('/auth/signup', payload).then(res => res.data);

export const logout = () =>
  api.post('/api/v1/auth/logout').then(res => res.data);