import api from './api';

export const processService = {
  createProcess: async (data) => {
    const response = await api.post('/processes', data);
    return response.data;
  },

  getProcesses: async () => {
    const response = await api.get('/processes');
    return response.data;
  },

  getProcess: async (id) => {
    const response = await api.get(`/processes/${id}`);
    return response.data;
  },

  updateProcess: async (id, data) => {
    const response = await api.put(`/processes/${id}`, data);
    return response.data;
  },

  deleteProcess: async (id) => {
    const response = await api.delete(`/processes/${id}`);
    return response.data;
  },

  getAlerts: async () => {
    const response = await api.get('/processes/alerts');
    return response.data;
  },
};
