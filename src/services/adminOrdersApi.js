import api from '../services/api';

export const adminOrdersService = {
  getAll: async () => {
    return api.get('booking/all');
  },
};

export default adminOrdersService;