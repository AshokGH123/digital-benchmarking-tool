import api from './api';

export const benchmarkService = {
  createBenchmark: async (benchmarkData) => {
    const response = await api.post('/benchmarks', benchmarkData);
    return response.data;
  },

  getBenchmarks: async () => {
    const response = await api.get('/benchmarks');
    return response.data;
  },

  getBenchmark: async (id) => {
    const response = await api.get(`/benchmarks/${id}`);
    return response.data;
  },

  updateBenchmark: async (id, benchmarkData) => {
    const response = await api.put(`/benchmarks/${id}`, benchmarkData);
    return response.data;
  },

  deleteBenchmark: async (id) => {
    const response = await api.delete(`/benchmarks/${id}`);
    return response.data;
  },

  getIndustryBenchmarks: async (industry, params = {}) => {
    const response = await api.get(`/benchmarks/industry/${industry}`, { params });
    return response.data;
  },

  getDashboardData: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  },

  sendReport: async () => {
    const response = await api.post('/benchmarks/send-report');
    return response.data;
  },
};
