import axios from 'axios';

const isLocalDevelopment =
  typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname);

const API_URL =
  process.env.REACT_APP_API_URL ||
  (isLocalDevelopment ? 'http://localhost:5000/api' : '');

console.log('API URL:', API_URL);

if (!API_URL) {
  console.error(
    'REACT_APP_API_URL is missing. Set it in Vercel to your Render backend URL ending with /api.'
  );
}

const api = axios.create({
  baseURL: API_URL || undefined,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (!API_URL) {
      return Promise.reject(
        new Error(
          'Frontend deployment is missing REACT_APP_API_URL. Set it in Vercel to https://your-render-service.onrender.com/api and redeploy.'
        )
      );
    }

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response || error);

    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    const message =
      (error.message === 'Network Error'
        ? 'Network error: backend unreachable or blocked by CORS. Check REACT_APP_API_URL in Vercel and CORS_ORIGIN in Render.'
        : null) ||
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Network error';

    const err = new Error(message);
    err.status = error.response?.status;
    err.data = error.response?.data;

    return Promise.reject(err);
  }
);

export default api;
