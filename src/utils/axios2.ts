import axios from "axios";

// Get backend URL from environment
// const BACKEND_URL =
//   "http://localhost:3000";
const rawBaseURL = import.meta.env.VITE_API_URL || "/api/v1/api";
const baseURL = rawBaseURL.endsWith("/") ? rawBaseURL : `${rawBaseURL}/`;

// Create axios instance
const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      // Optionally redirect to login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Helper functions for common API operations
export const agendaAPI = {
  // Get all agendas with optional filters
  getAll: (params = {}) => api.get("/academic/agendas?limit=100", { params }),

  // Get agenda by ID
  getById: (id) => api.get(`/academic/agendas/${id}`),

  // Create new agenda
  create: (data) => api.post("/academic/agendas", data),

  // Update agenda
  update: (id, data) => api.put(`/academic/agendas/${id}`, data),

  // Delete agenda
  delete: (id) => api.delete(`/academic/agendas/${id}`),

  // Get today's latest agenda
  getTodayLatest: () => api.get("/academic/agendas/today/latest"),
};

export const authAPI = {
  // Login
  login: (credentials) => api.post("/auth/login", credentials),

  // Register
  register: (userData) => api.post("/auth/register", userData),

  // Get profile
  getProfile: () => api.get("/auth/profile"),
};
