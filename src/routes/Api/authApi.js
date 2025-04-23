// src/services/authApi.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post('/login', credentials);

    
    return response.data;
  } catch (error) {
    // Transform error into a consistent format
    if (error.response) {
      throw {
        message: error.response.data?.message || 'Login failed',
        status: error.response.status,
        code: 'API_ERROR'
      };
    } else if (error.request) {
      throw {
        message: 'Network error - could not reach server',
        code: 'NETWORK_ERROR'
      };
    } else {
      throw {
        message: 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR'
      };
    }
  }
};

export const storeUserData = (userData) => {
  localStorage.setItem('userRole', userData.role);
  localStorage.setItem('userToken', userData.token);
  localStorage.setItem('userUsername', userData.username);
  localStorage.setItem('staffName', userData.name);

  localStorage.setItem('userEmpid', userData.empid);
};

export const clearUserData = () => {
  localStorage.removeItem('userRole');
  localStorage.removeItem('userToken');
  localStorage.removeItem('userUsername');
  localStorage.removeItem('userEmpid');
};