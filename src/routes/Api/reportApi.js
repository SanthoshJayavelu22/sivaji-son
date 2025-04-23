import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const reportApi = {
  getDailyReports: async (date, page = 1, limit = 6) => {
    try {
      const response = await api.get(`/admin/GetDailyReport/${date}`, {
        params: { page, limit }
      });
      return {
        reports: Array.isArray(response.data) 
          ? response.data 
          : response.data.reports || response.data.data || [],
        total: response.data?.totalReports || response.data?.total || 0
      };
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteDailyReport: async (reportId) => {
    try {
      await api.post(`/admin/DeleteDailyReport/${reportId}`);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};