
// src/services/adminOrdersApi.js
import api from './api';

const SellerOrdersService = {
  /**
   * Get all bookings
   */
  getAll: async (skip = 0, limit = 50) => {
    return api.get('seller/bookings', {
      params: {
        skip,
        limit,
      },
    });
  },

  /**
   * Get sellers with their orders
   */
  getSellerProfile: async (skip = 0, limit = 50, search = '') => {
    return api.get('seller/profile', {
      params: {
        skip,
        limit,
      },
    });
  },

  /**
   * Get all sellers
   */
  getSellersDashboard: async (skip = 0, limit = 50, search = '') => {
    return api.get('seller/dashboard-stats', {
      params: {
        skip,
        limit
      },
    });
  },

  /**
   * Get all customers
   */
  getProperties: async (skip = 0, limit = 50, search = '') => {
    return api.get('seller/properties', {
      params: {
        skip,
        limit,
        ...(search ? { search } : {}),
      },
    });
  },

  /**
   * Get all users
   */
  getVehicles: async (skip = 0, limit = 50) => {
    return api.get('seller/vehicles', {
      params: {
        skip,
        limit,
      },
    });
  },

  /**
   * Get dashboard statistics
   */
  getSellerBookings: async () => {
    return api.get('seller/bookings',{
        params: {
        skip,
        limit,
      },
    });
  },


};

export default SellerOrdersService;






