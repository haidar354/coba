import { useState, useEffect, useCallback } from "react";
import api from "@/utils/axios";

export const useDepartment = () => {
  const [departments, setDepartments] = useState([]);
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

  // Load departments with pagination and search
  const loadDepartments = useCallback(async (options = {}) => {
    const { page = 1, limit = 10, search = "" } = options;

    setLoading(true);
    setError(null);

    try {
      const params = {
        page: page,
        limit: limit,
      };

      if (search) params.search = search;

      console.log("🏢 Loading departments with params:", params);

      const response = await api.get("/api/classes/departments", { params });

      if (response.data && response.data) {
        console.log(response.headers["x-pagination"]);
        setDepartments(response.data);
        if (response.headers["x-pagination"]) {
          setPagination(JSON.parse(response.headers["x-pagination"]));
        }
        console.log(
          "✅ Departments loaded successfully:",
          response.data.length
        );
      } else {
        setDepartments([]);
        console.log("⚠️ No departments data found");
      }
    } catch (err) {
      console.error("❌ Error loading departments:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load departments"
      );
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new department
  const createDepartment = useCallback(async (departmentData) => {
    try {
      console.log("➕ Creating new department:", departmentData);

      const dataToSend = {
        name: departmentData.name,
        description: departmentData.description || null,
      };

      const response = await api.post("/api/classes/departments", dataToSend);
      console.log("✅ Department created successfully:", response.data);

      return response.data;
    } catch (err) {
      console.error("❌ Error creating department:", err);
      throw new Error(
        err.response?.data?.message ||
          err.message ||
          "Failed to create department"
      );
    }
  }, []);

  // Update department
  const updateDepartment = useCallback(async (departmentId, departmentData) => {
    try {
      console.log("✏️ Updating department:", departmentId, departmentData);

      const dataToSend = {
        name: departmentData.name,
        description: departmentData.description || null,
      };

      const response = await api.put(
        `/api/classes/departments/${departmentId}`,
        dataToSend
      );
      console.log("✅ Department updated successfully:", response.data);

      return response.data;
    } catch (err) {
      console.error("❌ Error updating department:", err);
      throw new Error(
        err.response?.data?.message ||
          err.message ||
          "Failed to update department"
      );
    }
  }, []);

  // Delete department
  const deleteDepartment = useCallback(async (departmentId) => {
    try {
      console.log("🗑️ Deleting department:", departmentId);

      const response = await api.delete(
        `/api/classes/departments/${departmentId}`
      );
      console.log("✅ Department deleted successfully");

      return response.data;
    } catch (err) {
      console.error("❌ Error deleting department:", err);
      throw new Error(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete department"
      );
    }
  }, []);

  // Get department by ID
  const getDepartmentById = useCallback(async (departmentId) => {
    try {
      console.log("🔍 Getting department by ID:", departmentId);

      const response = await api.get(
        `/api/classes/departments/${departmentId}`
      );
      console.log("✅ Department found:", response.data);

      return response.data;
    } catch (err) {
      console.error("❌ Error getting department:", err);
      throw new Error(
        err.response?.data?.message || err.message || "Failed to get department"
      );
    }
  }, []);

  // Bulk operations
  const bulkCreateDepartments = useCallback(async (departmentsData) => {
    try {
      console.log("📦 Bulk creating departments:", departmentsData.length);

      const response = await api.post(
        "/api/classes/departments/bulk",
        departmentsData
      );
      console.log("✅ Bulk create completed:", response.data);

      return response.data;
    } catch (err) {
      console.error("❌ Error bulk creating departments:", err);
      throw new Error(
        err.response?.data?.message ||
          err.message ||
          "Failed to bulk create departments"
      );
    }
  }, []);

  // Get statistics
  const getDepartmentsStats = useCallback(async () => {
    try {
      console.log("📊 Getting departments statistics...");

      const response = await api.get("/api/classes/departments/stats");
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
    departments,
    loading,
    error,
    pagination,

    // Actions
    loadDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getDepartmentById,
    bulkCreateDepartments,
    getDepartmentsStats,

    // Utils
    setError,
  };
};
