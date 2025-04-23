import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Customer API functions
export const customerApi = {
  getCustomers: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/GetCustomers`, {
        headers: {
          "Content-Type": "application/json",
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw error;
    }
  }
};

// Mail API functions
export const mailApi = {
  sendMail: async (mailPayload) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/mail`, mailPayload, {
        headers: {
          "Content-Type": "application/json",
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error sending mail:", error);
      throw error;
    }
  }
};