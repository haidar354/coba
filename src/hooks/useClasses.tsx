import { useState, useEffect, useCallback } from "react";
import api from "@/utils/axios";

export const useClasses = () => {
  const [classes, setClasses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 10,
    has_next_page: false,
    has_prev_page: false,
  });

  // Load classes with pagination and search
  const loadClasses = useCallback(async (options = {}) => {
    const {
      page = 1,
      limit = 10,
      search = "",
      grade = "",
      departmentId = "",
      academicYearId = "",
    } = options;

    setLoading(true);
    setError(null);

    try {
      const params = {
        page: page,
        limit: limit,
        include_relations: true,
      };

      if (search) params.search = search;
      if (grade) params.grade = grade;
      if (departmentId) params.departmentId = departmentId;
      if (academicYearId) params.academicYearId = academicYearId;

      console.log("📚 Loading classes with params:", params);

      const response = await api.get("/api/classes", { params });

      if (response.data && response.data) {
        console.log(response.headers["x-pagination"]);
        setClasses(response.data);
        if (response.headers["x-pagination"]) {
          setPagination(JSON.parse(response.headers["x-pagination"]));
        }
        console.log("✅ Classes loaded successfully:", response.data.length);
      } else {
        setClasses([]);
        console.log("⚠️ No classes data found");
      }
    } catch (err) {
      console.error("❌ Error loading classes:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to load classes"
      );
      setClasses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load departments
  const loadDepartments = useCallback(async () => {
    try {
      console.log("🏫 Loading departments...");
      const response = await api.get("/api/classes/departments", {
        params: { limit: 100 }, // Get all departments
      });

      if (response.data && response.data) {
        setDepartments(response.data);
      }
    } catch (err) {
      console.error("❌ Error loading departments:", err);
      setError(err.response?.data?.message || "Failed to load departments");
    }
  }, []);

  // Load academic years
  const loadAcademicYears = useCallback(async () => {
    try {
      console.log("📅 Loading academic years...");
      // Since there's no specific endpoint, we'll use mock data for now
      // You might need to implement /api//academic/years endpoint
      const response = await api.get("/api/academic/years", {
        params: { limit: 100 }, // Get all departments
      });

      setAcademicYears(response.data);
      console.log("✅ Academic years loaded:", response.data.length);
    } catch (err) {
      console.error("❌ Error loading academic years:", err);
      setError(err.response?.data?.message || "Failed to load academic years");
    }
  }, []);

  // Create new class
  const createClass = useCallback(async (classData) => {
    try {
      console.log("➕ Creating new class:", classData);

      const dataToSend = {
        grade: classData.grade,
        id_department: parseInt(classData.id_department),
        id_academic_year: parseInt(classData.id_academic_year),
      };

      // Add subgrade if provided
      if (classData.subgrade && classData.subgrade.trim()) {
        dataToSend.subgrade = classData.subgrade.trim();
      }

      const response = await api.post("/api/classes", dataToSend);
      console.log("✅ Class created successfully:", response.data);

      return response.data;
    } catch (err) {
      console.error("❌ Error creating class:", err);
      throw new Error(
        err.response?.data?.message || err.message || "Failed to create class"
      );
    }
  }, []);

  // Update class
  const updateClass = useCallback(async (classId, classData) => {
    try {
      console.log("✏️ Updating class:", classId, classData);

      const dataToSend = {
        grade: classData.grade,
        id_department: parseInt(classData.id_department),
        id_academic_year: parseInt(classData.id_academic_year),
      };

      // Add subgrade if provided, or set to null if empty
      if (classData.subgrade && classData.subgrade.trim()) {
        dataToSend.subgrade = classData.subgrade.trim();
      } else {
        dataToSend.subgrade = null;
      }

      const response = await api.put(`/api/classes/${classId}`, dataToSend);
      console.log("✅ Class updated successfully:", response.data);

      return response.data;
    } catch (err) {
      console.error("❌ Error updating class:", err);
      throw new Error(
        err.response?.data?.message || err.message || "Failed to update class"
      );
    }
  }, []);

  // Delete class
  const deleteClass = useCallback(async (classId) => {
    try {
      console.log("🗑️ Deleting class:", classId);

      const response = await api.delete(`/api/classes/${classId}`);
      console.log("✅ Class deleted successfully");

      return response.data;
    } catch (err) {
      console.error("❌ Error deleting class:", err);
      throw new Error(
        err.response?.data?.message || err.message || "Failed to delete class"
      );
    }
  }, []);

  // Get class by ID
  const getClassById = useCallback(async (classId) => {
    try {
      console.log("🔍 Getting class by ID:", classId);

      const response = await api.get(`/api/classes/${classId}`, {
        params: { include_relations: true },
      });
      console.log("✅ Class found:", response.data);

      return response.data;
    } catch (err) {
      console.error("❌ Error getting class:", err);
      throw new Error(
        err.response?.data?.message || err.message || "Failed to get class"
      );
    }
  }, []);

  // Bulk operations
  const bulkCreateClasses = useCallback(async (classesData) => {
    try {
      console.log("📦 Bulk creating classes:", classesData.length);

      const response = await api.post("/api/classes/bulk", classesData);
      console.log("✅ Bulk create completed:", response.data);

      return response.data;
    } catch (err) {
      console.error("❌ Error bulk creating classes:", err);
      throw new Error(
        err.response?.data?.message ||
          err.message ||
          "Failed to bulk create classes"
      );
    }
  }, []);

  // Get statistics
  const getClassesStats = useCallback(async () => {
    try {
      console.log("📊 Getting classes statistics...");

      const response = await api.get("/api/classes/stats/departments");
      console.log("✅ Statistics loaded:", response.data);

      return response.data;
    } catch (err) {
      console.error("❌ Error getting statistics:", err);
      throw new Error(
        err.response?.data?.message || err.message || "Failed to get statistics"
      );
    }
  }, []);

  return {
    // State
    classes,
    departments,
    academicYears,
    loading,
    error,
    pagination,

    // Actions
    loadClasses,
    loadDepartments,
    loadAcademicYears,
    createClass,
    updateClass,
    deleteClass,
    getClassById,
    bulkCreateClasses,
    getClassesStats,

    // Utils
    setError,
  };
};
