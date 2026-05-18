import api from '../services/api';

export const adminUsersService = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`admin/users${query ? `?${query}` : ''}`);
  },
};

export default adminUsersService;
