// src/services/dailyReportService.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const dailyReportService = {
  // Send a new daily report
  sendDailyReport: async (reportData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/staff/SendDailyReport`,
        reportData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Get all reports for a user (if you implement this in the future)
  getReportsByEmployee: async (empId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/staff/GetDailyReports/${empId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Delete a report (if you implement this in the future)
  deleteReport: async (reportId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/staff/DeleteDailyReport/${reportId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },
};