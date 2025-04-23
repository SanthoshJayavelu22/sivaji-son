import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create axios instance with base config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for auth tokens if needed
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Staff API functions
export const staffApi = {
  getAll: async () => {
    try {
      const response = await api.get("/admin/GetAllStaff");
      console.log(response.data)
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  register: async (staffData) => {
    try {
      const response = await api.post("/register", staffData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  update: async (staffId, staffData) => {
    try {
      const response = await api.put(`/admin/EditStaff/${staffId}`, staffData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  delete: async (staffId) => {
    try {
      await api.post(`/admin/DeleteStaff/${staffId}`);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};