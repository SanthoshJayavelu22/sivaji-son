// api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const fetchOtherDetails = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/GetOtherCustomers`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch other bookings.');
  }
};
