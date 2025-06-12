import api from './api';


/**
 * POST /auth/login
 * @returns {Promise<{user: object, accessToken: string}>}
 */
export const login = (username, password) =>
  api.post('/auth/login', { username, password })
     .then(res => {
       const { user, accessToken, refreshToken } = res.data.result;
       localStorage.setItem('token', accessToken);
       localStorage.setItem('refreshToken', refreshToken);
       return { user, accessToken };
     });
/**
 * POST /auth/refresh
 * @returns {Promise<{accessToken: string}>}
 * بدون نیاز به ارسال پارامتر؛ کوکی HttpOnly شامل RefreshToken است
 */
export const refresh = () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return Promise.reject(new Error('No refresh token stored'));
    }
    return api
      .post('/auth/refresh', { refreshToken })
      .then(res => res.data.result);
  };
/**
 * POST /auth/logout
 */
export const logout = () => {
    const refreshToken = localStorage.getItem('refreshToken');
    return api
      .post('/auth/logout', { refreshToken })
      .then(() => {
        localStorage.clear();
        window.location.href = '/login';
      });
  };


export const register = payload =>
  api.post('/auth/signup', payload).then(res => res.data);  