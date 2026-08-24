// src/services/adminOrdersApi.js
import api from "./api";

const adminOrdersService = {
  /**
   * Get all bookings/orders
   */
  getAll: async (skip = 0, limit = 100) => {
    return api.get("admin/all-bookings", {
      params: {
        skip,
        limit,
      },
    });
  },

  getAllBookings: async (skip = 0, limit = 100) => {
    return api.get("admin/all-bookings", {
      params: {
        skip,
        limit,
      },
    });
  },

  /**
   * Get sellers with their orders
   */
  getSellersWithOrders: async (skip = 0, limit = 50, search = "") => {
    return api.get("admin/sellers-with-orders", {
      params: {
        skip,
        limit,
        ...(search ? { search } : {}),
      },
    });
  },

  /**
   * Get all sellers
   */
  getSellers: async (skip = 0, limit = 50, search = "") => {
    return api.get("admin/sellers", {
      params: {
        skip,
        limit,
        ...(search ? { search } : {}),
      },
    });
  },

  /**
   * Get all customers
   */
  getCustomers: async (skip = 0, limit = 50, search = "") => {
    return api.get("admin/customers", {
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
  getUsers: async (skip = 0, limit = 50) => {
    return api.get("admin/users", {
      params: {
        skip,
        limit,
      },
    });
  },

 /**
   * Get all Property and Vehicle Details
   */
  getProperty_Vehicles_Details: async (skip = 0, limit = 50) => {
    return api.get("admin/all-property-vehicle", {
      params: {
        skip,
        limit,
      },
    });
  },

  /**
   * Get dashboard statistics
   */
  getDashboardStats: async () => {
    return api.get("admin/dashboard-stats");
  },

  /**
   * Get rich analytics summary
   */
  getAnalyticsSummary: async () => {
    return api.get("admin/analytics-summary");
  },

  /**
   * Get pending listings
   */
  getPendingListings: async () => {
    return api.get("admin/pending-listings");
  },

  /**
   * Export all users Excel
   */
  exportUsers: async () => {
    return api.get("admin/export/users.xlsx", {
      responseType: "blob",
    });
  },

  /**
   * Export customers Excel
   */
  exportCustomers: async () => {
    return api.get("admin/export/customers.xlsx", {
      responseType: "blob",
    });
  },

  /**
   * Export sellers Excel
   */
  exportSellers: async () => {
    return api.get("admin/export/sellers.xlsx", {
      responseType: "blob",
    });
  },

  /**
   * Get premium subscriptions and total revenue
   */
  getPremiumSubscriptions: async () => {
    return api.get("admin/premium-subscriptions");
  },

  /**
   * Export premium subscriptions Excel
   */
  exportPremiumSubscriptions: async () => {
    return api.get("admin/export/premium-subscriptions.xlsx", {
      responseType: "blob",
    });
  },
};

export default adminOrdersService;

