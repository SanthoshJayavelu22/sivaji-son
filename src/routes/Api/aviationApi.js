// src/services/aviationApi.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const addAirline = async (airlineData) => {
  const formData = new FormData();
  formData.append('airline', airlineData.name);
  if (airlineData.logo) {
    formData.append('logo', airlineData.logo);
  }

  const response = await axios.post(
    `${API_BASE_URL}/admin/AddAirline`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export const addAirport = async (airportCode) => {
  const response = await axios.post(
    `${API_BASE_URL}/admin/AddAirportCode`,
    { airportcode: airportCode }
  );
  return response.data;
};