import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const attendanceService = {
  // Register new attendance
  registerAttendance: async (attendanceData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/staff/RegisterAttendence`,
        attendanceData,
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      return response;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Check existing attendance
  checkAttendance: async (empId, date) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/staff/RegisterAttendence/${empId}/${date}`
      );
      return response;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  },

  // Add more attendance-related methods as needed
};