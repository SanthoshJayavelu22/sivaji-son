import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getPresentStaff = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/CurrentDayAttendance`);
    return response.data;
  } catch (error) {
    console.error("Error fetching present staff:", error);
    throw error;
  }
};

export const getAbsentStaff = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/CurrentDayAbsentees`);
    return response.data;
  } catch (error) {
    console.error("Error fetching absent staff:", error);
    throw error;
  }
};


export const getMonthlyAttendance = async (empid, year, month) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/admin/MonthlyAttendence`,
        { empid, year, month },
        { headers: { 'Content-Type': 'application/json' } }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching monthly attendance:", error);
      throw error;
    }
  };