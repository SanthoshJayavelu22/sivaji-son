// src/services/travelDocumentsApi.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const submitTravelDocuments = async (formData) => {
    try {
        const submissionData = {
            customername: formData.customername,
            customerid: formData.customerid,
            customernumber: formData.customernumber,
            customermail: formData.customermail,
            visadetails: formData.visa,
            passportdetails: formData.passport,
            travelinsurance: formData.travelinsurance,
            busticket: formData.busticket,
            servicesdetails: formData.servicesdetails,
            submissiondate: formData.submissiondate,
            collectiondate: formData.collectiondate,
            submittedby: localStorage.getItem("userEmpid"),
        };

        const response = await axios.post(`${API_BASE_URL}/staff/AddOtherDetails`, submissionData, {
            headers: getAuthHeaders(),
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getRecentSubmissions = () => {
    const savedSubmissions = localStorage.getItem("travelDocumentSubmissions");
    return savedSubmissions ? JSON.parse(savedSubmissions) : [];
};

export const saveRecentSubmission = (submission) => {
    const currentSubmissions = getRecentSubmissions();
    const updatedSubmissions = [submission, ...currentSubmissions].slice(0, 5);
    localStorage.setItem("travelDocumentSubmissions", JSON.stringify(updatedSubmissions));
    return updatedSubmissions;
};

export const deleteRecentSubmission = (submissionId) => {
    const currentSubmissions = getRecentSubmissions();
    const updatedSubmissions = currentSubmissions.filter((sub) => sub.id !== submissionId);
    localStorage.setItem("travelDocumentSubmissions", JSON.stringify(updatedSubmissions));
    return updatedSubmissions;
};
