import axios from "axios";

const API = axios.create({
  baseURL: "https://sociosphere-aivj.onrender.com/api/", // <-- live Render backend
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
