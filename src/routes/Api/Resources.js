import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getFiles = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/GetFiles`);
    return response.data;
  } catch (error) {
    console.error("Error fetching files:", error);
    throw error;
  }
};

export const uploadFile = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/admin/UploadFile`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const removeFile = async (fileId) => {
  try {
    await axios.post(`${API_BASE_URL}/admin/DeleteFile/${fileId}`);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

export const removeMultipleFiles = async (fileIds) => {
  try {
    await axios.post(`${API_BASE_URL}/admin/DeleteFiles`, { fileIds });
  } catch (error) {
    console.error("Error deleting files:", error);
    throw error;
  }
};


export const downloadFile = async (fileId, fileName) => {
    try {
      const response = await axios({
        url: `${API_BASE_URL}/admin/DownloadFile/${fileId}`,
        method: 'GET',
        responseType: 'blob', // Important for file downloads
      });
  
      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || `file-${fileId}`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
  
      return true;
    } catch (error) {
      console.error("Error downloading file:", error);
      throw error;
    }
  };