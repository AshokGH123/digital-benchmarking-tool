import api from './api';

const delay = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const withNetworkRetry = async (request, retries = 2) => {
  let attempt = 0;

  while (attempt <= retries) {
    try {
      return await request();
    } catch (error) {
      const isNetworkIssue =
        error.message &&
        error.message.toLowerCase().includes('network error');

      if (!isNetworkIssue || attempt === retries) {
        throw error;
      }

      await delay(800 * (attempt + 1));
      attempt += 1;
    }
  }
};

export const authService = {
  login: async (email, password) => {
    const response = await withNetworkRetry(() =>
      api.post('/auth/login', { email, password })
    );
    return response.data;
  },

  googleLogin: async (credential) => {
    const response = await withNetworkRetry(() =>
      api.post('/auth/google', { credential })
    );
    return response.data;
  },

  register: async (userData) => {
    const response = await withNetworkRetry(() =>
      api.post('/auth/register', userData)
    );
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data.user;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },
};
