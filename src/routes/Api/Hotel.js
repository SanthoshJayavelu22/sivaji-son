import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getHotelCustomers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/GetHotelCustomers`);
    console.log("Hotel customers data:", response.data); 
    return response.data;
  } catch (error) {
    console.error("Error fetching hotel customers:", error);
    throw error;
  }
};