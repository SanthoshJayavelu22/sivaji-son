import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const apiService = {
  // Staff related endpoints
  getAllStaff: async () => {
    return await axios.get(`${API_BASE_URL}/admin/GetAllStaff`);
  },

  // Task related endpoints
  getAllTasks: async () => {
    return await axios.get(`${API_BASE_URL}/admin/GetAllTasks`);
  },

  addTask: async (taskData) => {
    return await axios.post(`${API_BASE_URL}/admin/AddTask`, taskData);
  },

  deleteTask: async (taskId) => {
    return await axios.post(`${API_BASE_URL}/admin/DeleteTask/${taskId}`);
  },

  reassignTask: async (taskData) => {
    return await axios.post(`${API_BASE_URL}/admin/ReassignTask`, taskData);
  },

  // Report related endpoints (add your actual endpoints here)
  getStaffReports: async () => {
    // Replace with your actual report endpoint
    return await axios.get(`${API_BASE_URL}/admin/GetStaffReports`);
  }
};

export default apiService;