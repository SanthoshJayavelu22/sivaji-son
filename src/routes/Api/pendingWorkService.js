import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL

export const pendingWorkService = {
  // Get all tasks for employee
  getTasks: async (empId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/staff/ViewTask/${empId}`,
        { headers: { "Content-Type": "application/json" } }
      );
      return response;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Mark task as complete
  completeTask: async (taskData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/staff/UpdateTask`,
        taskData,
        { headers: { "Content-Type": "application/json" } }
      );
      return response;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Submit query about task
  submitQuery: async (queryData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/staff/SendRemark`,
        queryData,
        { headers: { "Content-Type": "application/json" } }
      );
      return response;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  }
};