import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getFlightCustomers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/GetFlightCustomers`);
    console.log( response.data);
    return response.data;

  } catch (error) {
    console.error("Error fetching flight customers:", error);
    throw error;
  }
};

// export const getFlightCustomerById = async (customerId) => {
//   try {
//     const response = await axios.get(
//       `${API_BASE_URL}/admin/GetFlightCustomer/${customerId}`,
//       { headers: { "Content-Type": "application/json" } }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching flight customer:", error);
//     throw error;
//   }
// };