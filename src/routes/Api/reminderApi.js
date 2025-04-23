// src/services/reminderApi.js
import axios from "axios";

const BASE_API_URI = import.meta.env.VITE_API_URL;

export const getFlightReminders = async () => {
  const response = await axios.get(`${BASE_API_URI}/admin/GetFlightReminder`);
  return response.data;
};

export const getHotelReminders = async () => {
  const response = await axios.get(`${BASE_API_URI}/admin/GetHotelReminder`);
  return response.data;
};