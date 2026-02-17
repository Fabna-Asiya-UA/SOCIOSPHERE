import axios from "axios";

const API = axios.create({
  baseURL: "https://sociosphere-backend.onrender.com/api/",
  
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access"); // JWT token

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
