// src/utils/axios.ts
import axios from "axios";

// Base URL configuration (normalize to include trailing slash)
const rawBaseURL = import.meta.env.VITE_API_URL || "/api/v1";
const baseURL = rawBaseURL.endsWith("/") ? rawBaseURL : `${rawBaseURL}/`;

// Create axios instance
const api = axios.create({
  baseURL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Assuming `api` is your Axios instance
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== "/tu/login") {
      // Handle unauthorized access, but skip if already on /tu/login
      localStorage.removeItem("token");
      window.location.href = "/tu/login";
    }
    return Promise.reject(error);
  }
);

export default api;
