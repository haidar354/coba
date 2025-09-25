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

// Attendance API helper functions (Presensi)
export const presensiGuruAPI = {
  // USERS - Get users for attendance with optional filters
  getUsers: (params = {}) => api.get("/attendance/users", { params }),

  // Get users by role and name
  getUsersByRole: (roleId, fullName = "") => {
    const params = {
      id_role: roleId,
      ...(fullName && { full_name: fullName })
    };
    return api.get("/attendance/users", { params });
  },

  // TEACHERS - Get teachers for attendance with optional filters
  getTeachers: (params = {}) => api.get("/attendance/teachers", { params }),

  // Get teachers by role and name
  getTeachersByRole: (roleId, fullName = "") => {
    const params = {
      id_role: roleId,
      ...(fullName && { full_name: fullName })
    };
    return api.get("/attendance/teachers", { params });
  },

  // Get teachers by subject for attendance
  getTeachersBySubject: (subjectId) => api.get("/attendance/teachers", { params: { subject_id: subjectId } }),

  // Get teachers by department for attendance
  getTeachersByDepartment: (deptId) => api.get("/attendance/teachers", { params: { department_id: deptId } }),

  // STUDENTS - Get students for attendance with optional filters
  getStudents: (params = {}) => api.get("/attendance/students", { params }),

  // Get students by role and name
  getStudentsByRole: (roleId, fullName = "") => {
    const params = {
      id_role: roleId,
      ...(fullName && { full_name: fullName })
    };
    return api.get("/attendance/students", { params });
  },

  // Get students by class for attendance
  getStudentsByClass: (classId) => api.get("/attendance/students", { params: { class_id: classId } }),

  // Get students by grade for attendance
  getStudentsByGrade: (grade) => api.get("/attendance/students", { params: { grade } }),

  // GENERAL ATTENDANCE OPERATIONS
  // Get all attendance records with optional filters
  getAll: (params = {}) => api.get("/attendance", { params }),

  // Get attendance by ID
  getById: (id) => api.get(`/attendance/${id}`),

  // Create new attendance record
  create: (data) => api.post("/attendance", data),

  // Update attendance record
  update: (id, data) => api.put(`/attendance/${id}`, data),

  // Delete attendance record
  delete: (id) => api.delete(`/attendance/${id}`),

  // Get attendance by date
  getByDate: (date, params = {}) => {
    const queryParams = { date, ...params };
    return api.get("/attendance", { params: queryParams });
  },

  // Get attendance by user ID
  getByUserId: (userId, params = {}) => {
    const queryParams = { user_id: userId, ...params };
    return api.get("/attendance", { params: queryParams });
  },

  // Get attendance statistics
  getStats: (params = {}) => api.get("/attendance/stats", { params }),

  // Bulk create attendance records
  createBulk: (data) => api.post("/attendance/bulk", data),

  // Check in
  checkIn: (data) => api.post("/attendance/checkin", data),

  // Check out
  checkOut: (data) => api.post("/attendance/checkout", data),
};

// Alias untuk backward compatibility
export const attendanceAPI = presensiGuruAPI;

// Helper functions for common API operations (existing)
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

// Users API helper functions
export const usersAPI = {
  // Get all users with optional filters
  getAll: (params = {}) => api.get("/users", { params }),

  // Get users by role and name
  getByRole: (roleId, fullName = "") => {
    const params = {
      id_role: roleId,
      ...(fullName && { full_name: fullName })
    };
    return api.get("/users", { params });
  },

  // Get user by ID
  getById: (id) => api.get(`/users/${id}`),

  // Create new user
  create: (data) => api.post("/users", data),

  // Update user
  update: (id, data) => api.put(`/users/${id}`, data),

  // Delete user
  delete: (id) => api.delete(`/users/${id}`),

  // Search users by name
  searchByName: (name) => api.get("/users", { params: { full_name: name } }),

  // Get users by status
  getByStatus: (status) => api.get("/users", { params: { status } }),
};

// Students API helper functions
export const studentsAPI = {
  // Get all students with optional filters
  getAll: (params = {}) => api.get("/students", { params }),

  // Get students by role and name
  getByRole: (roleId, fullName = "") => {
    const params = {
      id_role: roleId,
      ...(fullName && { full_name: fullName })
    };
    return api.get("/students", { params });
  },

  // Get student by ID
  getById: (id) => api.get(`/students/${id}`),

  // Create new student
  create: (data) => api.post("/students", data),

  // Update student
  update: (id, data) => api.put(`/students/${id}`, data),

  // Delete student
  delete: (id) => api.delete(`/students/${id}`),

  // Search students by name
  searchByName: (name) => api.get("/students", { params: { full_name: name } }),

  // Get students by class
  getByClass: (classId) => api.get("/students", { params: { class_id: classId } }),

  // Get students by grade
  getByGrade: (grade) => api.get("/students", { params: { grade } }),

  // Get active students
  getActive: () => api.get("/students", { params: { status: "active" } }),
};

// Teachers API helper functions
export const teachersAPI = {
  // Get all teachers with optional filters
  getAll: (params = {}) => api.get("/teachers", { params }),

  // Get teachers by role and name
  getByRole: (roleId, fullName = "") => {
    const params = {
      id_role: roleId,
      ...(fullName && { full_name: fullName })
    };
    return api.get("/teachers", { params });
  },

  // Get teacher by ID
  getById: (id) => api.get(`/teachers/${id}`),

  // Create new teacher
  create: (data) => api.post("/teachers", data),

  // Update teacher
  update: (id, data) => api.put(`/teachers/${id}`, data),

  // Delete teacher
  delete: (id) => api.delete(`/teachers/${id}`),

  // Search teachers by name
  searchByName: (name) => api.get("/teachers", { params: { full_name: name } }),

  // Get teachers by subject
  getBySubject: (subjectId) => api.get("/teachers", { params: { subject_id: subjectId } }),

  // Get teachers by department
  getByDepartment: (deptId) => api.get("/teachers", { params: { department_id: deptId } }),

  // Get active teachers
  getActive: () => api.get("/teachers", { params: { status: "active" } }),
};

// Usage examples:
// 
// USERS API:
// usersAPI.getByRole(3, "guru 1");
// usersAPI.getAll({ status: "active" });
// usersAPI.searchByName("john");
//
// STUDENTS API:
// studentsAPI.getByRole(1, "siswa 1");
// studentsAPI.getByClass(5);
// studentsAPI.getByGrade("10");
// studentsAPI.getActive();
//
// TEACHERS API:
// teachersAPI.getByRole(3, "guru 1");
// teachersAPI.getBySubject(2);
// teachersAPI.getByDepartment(1);
// teachersAPI.searchByName("guru matematika");
//
// ATTENDANCE API:
// attendanceAPI.getUsersByRole(3, "guru 1");
// attendanceAPI.getUsers();
// attendanceAPI.create({ user_id: 1, date: "2024-01-15", status: "present" });
// attendanceAPI.getByDate("2024-01-15");
// attendanceAPI.checkIn({ user_id: 1, timestamp: new Date().toISOString() });