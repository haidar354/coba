import React, { useState, useEffect, useCallback } from "react";
import * as XLSX from 'xlsx';
import {
  Plus,
  Download,
  Upload,
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  FileX,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import api from "@/utils/axios";

// API functions using your backend
const teachersApi = {
  async getTeachers(params) {
    try {
      const response = await api.get(
        "/api/attendance?id_role=3&include_relations=true",
        {
          params: {
            include_relations: true,
            page: params.page || 1,
            limit: params.limit || 10,
            search: params.search || "",
            sortBy: "created_at",
            sortOrder: "desc",
          },
        }
      );
      return response.data ? { data: response.data, pagination: JSON.parse(response.headers["x-pagination"] || '{}') } : { data: [], pagination: { current_page: 1, total_pages: 1, total_items: 0, items_per_page: params.limit || 10, has_next_page: false, has_prev_page: false } };
    } catch (error) {
      console.error("API Error in getTeachers:", error);
      throw new Error(error.response?.data?.message || "Gagal memuat data guru");
    }
  },

  async uploadFile(file) {
    try {
      if (!file) throw new Error("No file selected");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder_name", "data_presensi/guru");

      const response = await api.post("/api/attendance?id_role=3&include_relations=true/bulk", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.status === 201 ? { success: true } : { success: false };
    } catch (error) {
      console.error("API Error in uploadFile:", error);
      throw new Error("File gagal diupload");
    }
  },

  async downloadData(format, start_date, end_date) {
    try {
      const params = { format };
      if (start_date) params.start_date = start_date;
      if (end_date) params.end_date = end_date;

      const response = await api.get(
        "/api/attendance?id_role=3&include_relations=true/export",
        {
          params,
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `data-guru-${new Date().toISOString().split("T")[0]}.${format}`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error("API Error in downloadData:", error);
      throw new Error("Gagal mengunduh data");
    }
  },

  async createTeacher(teacherData) {
    try {
      if (!teacherData.nama || !teacherData.nip || !teacherData.status) throw new Error("Missing required fields");
      const payload = {
        id_user: null,
        id_class: null,
        nip: teacherData.nip,
        userData: {
          full_name: teacherData.nama,
          id_role: 3,
          data: {
            phone: teacherData.phone || "",
            email: teacherData.email || "",
          },
        },
      };

      const response = await api.post(
        "/api/attendance?id_role=3&include_relations=true",
        payload
      );
      return response.data ? { success: true, data: response.data } : { success: false };
    } catch (error) {
      console.error("API Error in createTeacher:", error);
      throw new Error(error.response?.data?.message || "Gagal menambahkan data guru");
    }
  },

  async updateTeacher(id, teacherData) {
    try {
      if (!teacherData.nama || !teacherData.nip || !teacherData.status) throw new Error("Missing required fields");
      const payload = {
        nip: teacherData.nip,
        userData: {
          full_name: teacherData.nama,
          id_role: 3,
          data: {
            phone: teacherData.phone || "",
            email: teacherData.email || "",
          },
        },
      };

      const response = await api.put(
        `/api/attendance?id_role=3&include_relations=true/${id}`,
        payload
      );
      return response.data ? { success: true, data: response.data } : { success: false };
    } catch (error) {
      console.error("API Error in updateTeacher:", error);
      throw new Error(error.response?.data?.message || "Gagal memperbarui data guru");
    }
  },

  async deleteTeacher(id) {
    try {
      if (!id) throw new Error("Invalid teacher ID");
      const response = await api.delete(
        `/api/attendance/${id}`
      );
      return response.status === 200 ? { success: true } : { success: false };
    } catch (error) {
      console.error("API Error in deleteTeacher:", error);
      throw new Error("Gagal menghapus data guru");
    }
  },

  async searchTeachers(query, limit = 10) {
    try {
      const response = await api.get(
        "/api/attendance?id_role=3&include_relations=true/search",
        {
          params: { q: query || "", limit },
        }
      );
      return response.data ? { data: response.data } : { data: [] };
    } catch (error) {
      console.error("API Error in searchTeachers:", error);
      throw new Error("Gagal mencari data guru");
    }
  },

  async getTeachersByClass(classId, page = 1, limit = 10) {
    try {
      if (!classId) throw new Error("Invalid class ID");
      const response = await api.get(
        `/api/attendance?id_role=3&include_relations=true/class/${classId}`,
        {
          params: { page, limit },
        }
      );
      return response.data ? { data: response.data, pagination: JSON.parse(response.headers["x-pagination"] || '{}') } : { data: [], pagination: { current_page: page, total_pages: 1, total_items: 0, items_per_page: limit, has_next_page: false, has_prev_page: false } };
    } catch (error) {
      console.error("API Error in getTeachersByClass:", error);
      throw new Error("Gagal memuat data guru berdasarkan kelas");
    }
  },

  async getTeachersStats() {
    try {
      const response = await api.get(
        "/api/attendance?id_role=3&include_relations=true/stats/classes"
      );
      return response.data ? { data: response.data } : { data: {} };
    } catch (error) {
      console.error("API Error in getTeachersStats:", error);
      throw new Error("Gagal memuat statistik guru");
    }
  },

  async restoreTeacher(id) {
    try {
      if (!id) throw new Error("Invalid teacher ID");
      const response = await api.post(
        `/api/attendance?id_role=3&include_relations=true/${id}/restore`
      );
      return response.status === 200 ? { success: true } : { success: false };
    } catch (error) {
      console.error("API Error in restoreTeacher:", error);
      throw new Error("Gagal memulihkan data guru");
    }
  },
};

// Custom hook for debounced value
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const EnhancedPresensiGuru = () => {
  // State management
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 10,
    has_next_page: false,
    has_prev_page: false,
  });

  // Filter states
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState(""); // State untuk input search
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearchFocused, setIsSearchFocused] = useState(false); // State untuk focus search

  // Debounced search term - akan trigger fetch setelah user berhenti mengetik selama 500ms
  const debouncedSearchTerm = useDebounce(searchInput, 500);

  // Modal states
  const [modals, setModals] = useState({
    upload: false,
    download: false,
    addData: false,
    editData: false,
  });

  // Form states
  const [uploadFile, setUploadFile] = useState(null);
  const [downloadFormat, setDownloadFormat] = useState("xlsx");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [newTeacher, setNewTeacher] = useState({
    nama: "",
    nip: "",
    status: "",
    keterangan: "",
    email: "",
    phone: "",
  });
  const [editingTeacher, setEditingTeacher] = useState(null);

  // Alert state
  const [alert1, setAlert1] = useState({ show: false, type: "", message: "" });

  // Fetch teachers data
  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: entriesPerPage,
        search: debouncedSearchTerm.length >= 3 ? debouncedSearchTerm.toLowerCase() : "",
      };
      const { data, pagination: pag } = await teachersApi.getTeachers(params);

      setTeachers(data || []);
      setPagination(pag || {
        current_page: currentPage,
        total_pages: 1,
        total_items: data?.length || 0,
        items_per_page: entriesPerPage,
        has_next_page: false,
        has_prev_page: false,
      });
    } catch (error) {
      console.error("Error fetching teachers:", error);
      showAlert("error", error.message || "Gagal memuat data guru");
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  // Effect untuk update searchTerm ketika debouncedSearchTerm berubah
  useEffect(() => {
    setSearchTerm(debouncedSearchTerm.toLowerCase());
  }, [debouncedSearchTerm]);

  // Effects
  useEffect(() => {
    fetchTeachers();
  }, [currentPage, entriesPerPage, searchTerm]);

  // Reset to first page when search term or entries per page changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm, entriesPerPage]);

  // Helper functions
  const showAlert = (type, message) => {
    setAlert1({ show: true, type, message });
    setTimeout(() => setAlert1({ show: false, type: "", message: "" }), 5000);
  };

  const closeModal = (modalName) => {
    setModals((prev) => ({ ...prev, [modalName]: false }));
    // Reset form data when closing modals
    if (modalName === "upload") setUploadFile(null);
    if (modalName === "addData") {
      setNewTeacher({
        nama: "",
        nip: "",
        status: "",
        keterangan: "",
        email: "",
        phone: "",
      });
    }
    if (modalName === "editData") {
      setEditingTeacher(null);
    }
    if (modalName === "download") {
      setDateRange({ startDate: "", endDate: "" });
      setDownloadFormat("xlsx");
    }
  };

  const openModal = (modalName) => {
    setModals((prev) => ({ ...prev, [modalName]: true }));
  };

  // Handle functions
  const handleSearchInputChange = (value) => {
    setSearchInput(value.toLowerCase()); // Update input value to lowercase
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    // Delay blur untuk memungkinkan clear button diklik
    setTimeout(() => {
      setIsSearchFocused(false);
    }, 100);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleEntriesChange = (value) => {
    setEntriesPerPage(parseInt(value));
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.total_pages) {
      setCurrentPage(page);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      showAlert("error", "Silakan pilih file untuk diupload");
      return;
    }

    setLoading(true);

    try {
      const response = await teachersApi.uploadFile(uploadFile);
      if (response.success) {
        showAlert("success", "File berhasil diupload");
        fetchTeachers();
        closeModal("upload");
      }
    } catch (error) {
      showAlert("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    // Create a temporary link element to trigger download
    const link = document.createElement("a");
    link.href = "/tu/file_template/Template%20Presensi%20Guru%20-%20Harian.xlsx";
    link.download = "template_presensi_guru.xlsx";
    link.target = "_blank";

    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = async () => {
    // Validate date range
    if (dateRange.startDate && dateRange.endDate) {
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        showAlert("error", "Tanggal mulai atau tanggal akhir tidak valid");
        return;
      }
      if (end < start) {
        showAlert("error", "Tanggal akhir tidak boleh sebelum tanggal mulai");
        return;
      }
    }

    setLoading(true);
    const fetchAllTeachersData = async () => {
      try {
        let allTeachers = [];
        let page = 1;
        const limit = 100;
        const params = {
          include_relations: true,
          limit,
        };
        if (dateRange.startDate) params.start_date = dateRange.startDate;
        if (dateRange.endDate) params.end_date = dateRange.endDate;

        while (true) {
          const response = await api.get(
            "/api/attendance?id_role=3&include_relations=true",
            { params: { ...params, page } }
          );

          let teachersData = [];
          if (Array.isArray(response.data)) {
            teachersData = response.data;
          } else if (response.data && Array.isArray(response.data.data)) {
            teachersData = response.data.data;
          } else if (response.data && Array.isArray(response.data)) {
            teachersData = response.data;
          }

          allTeachers = [...allTeachers, ...teachersData];

          const paginationHeader = response.headers["x-pagination"];
          if (paginationHeader) {
            try {
              const pag = JSON.parse(paginationHeader);
              if (!pag.has_next_page) break;
              page = pag.current_page + 1;
            } catch (e) {
              break;
            }
          } else {
            break;
          }
        }

        return allTeachers;
      } catch (error) {
        console.error("Error fetching teachers data:", error);
        throw error;
      }
    };

    const generateTeacherExcelFile = (teachersData) => {
      try {
        if (
          !teachersData ||
          !Array.isArray(teachersData) ||
          teachersData.length === 0
        ) {
          throw new Error("Data guru tidak valid atau kosong");
        }

        const wb = XLSX.utils.book_new();

        const excelData = teachersData.map((teacher, index) => {
          if (!teacher || typeof teacher !== "object") {
            console.warn(`Data guru pada index ${index} tidak valid:`, teacher);
            return {
              NO: index + 1,
              NAMA: "Data tidak valid",
              NIP: "N/A",
              EMAIL: "N/A",
              PHONE: "N/A",
              KELAS: "N/A",
              TANGGAL_DIBUAT: "N/A",
            };
          }

          return {
            NO: index + 1,
            NAMA: teacher.user?.full_name || "N/A",
            NIP: teacher.nip || teacher.user?.data?.nip || "N/A",
            EMAIL: teacher.user?.data?.email || "N/A",
            PHONE: teacher.user?.data?.phone || "N/A",
            KELAS:
              teacher.class?.name || teacher.user?.data?.id_class
                ? `Kelas ${teacher.user.data.id_class}`
                : "Tidak ada kelas",
            TANGGAL_DIBUAT: teacher.created_at
              ? (() => {
                  try {
                    return new Date(teacher.created_at).toLocaleDateString(
                      "id-ID"
                    );
                  } catch (dateError) {
                    console.warn(
                      `Error parsing date for teacher ${index}:`,
                      dateError
                    );
                    return "N/A";
                  }
                })()
              : "N/A",
          };
        });

        const ws = XLSX.utils.json_to_sheet([]);

        const colWidths = [
          { wch: 5 }, // NO
          { wch: 25 }, // NAMA
          { wch: 15 }, // NIP
          { wch: 25 }, // EMAIL
          { wch: 15 }, // PHONE
          { wch: 20 }, // KELAS
          { wch: 15 }, // TANGGAL_DIBUAT
        ];
        ws["!cols"] = colWidths;

        XLSX.utils.sheet_add_aoa(ws, [["DATA GURU"]], { origin: "A1" });

        XLSX.utils.sheet_add_aoa(ws, [[""]], { origin: "A2" });

        const headers = [
          "NO",
          "NAMA",
          "NIP",
          "EMAIL",
          "TELEPON",
          "KELAS",
          "TANGGAL DIBUAT",
        ];
        XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A3" });

        const dataRows = excelData.map((row) => [
          row.NO,
          row.NAMA,
          row.NIP,
          row.EMAIL,
          row.PHONE,
          row.KELAS,
          row.TANGGAL_DIBUAT,
        ]);

        XLSX.utils.sheet_add_aoa(ws, dataRows, { origin: "A4" });

        const range = XLSX.utils.encode_range({
          s: { c: 0, r: 0 },
          e: { c: 6, r: 2 + excelData.length },
        });
        ws["!ref"] = range;

        ws["!merges"] = [
          {
            s: { r: 0, c: 0 },
            e: { r: 0, c: 6 },
          },
        ];

        const titleCell = "A1";
        if (!ws[titleCell]) ws[titleCell] = { v: "DATA GURU", t: "s" };
        ws[titleCell].s = {
          font: { bold: true, sz: 16 },
          alignment: { horizontal: "center", vertical: "center" },
          fill: { fgColor: { rgb: "CCCCCC" } },
        };

        headers.forEach((header, colIndex) => {
          const cellAddress = XLSX.utils.encode_cell({
            r: 2,
            c: colIndex,
          });
          if (!ws[cellAddress]) {
            ws[cellAddress] = { v: header, t: "s" };
          }
          ws[cellAddress].s = {
            font: { bold: true },
            fill: { fgColor: { rgb: "E6E6E6" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
            },
          };
        });

        dataRows.forEach((row, rowIndex) => {
          row.forEach((cellValue, colIndex) => {
            const cellAddress = XLSX.utils.encode_cell({
              r: 3 + rowIndex,
              c: colIndex,
            });
            if (ws[cellAddress]) {
              ws[cellAddress].s = {
                border: {
                  top: { style: "thin" },
                  bottom: { style: "thin" },
                  left: { style: "thin" },
                  right: { style: "thin" },
                },
                alignment:
                  colIndex === 0
                    ? { horizontal: "center" }
                    : { horizontal: "left" },
              };
            }
          });
        });

        XLSX.utils.book_append_sheet(wb, ws, "Data Guru");

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;
        const filename = `Data_Guru_${dateStr}.xlsx`;

        XLSX.writeFile(wb, filename);

        console.log(`File Excel berhasil dibuat: ${filename}`);
        return filename;
      } catch (error) {
        console.error("Detailed error in generateTeacherExcelFile:", error);

        let errorMessage = "Gagal membuat file Excel";

        if (error.message.includes("XLSX")) {
          errorMessage =
            "Library XLSX tidak tersedia. Pastikan SheetJS sudah dimuat.";
        } else if (error.message.includes("Data guru")) {
          errorMessage = "Data guru tidak valid atau kosong";
        } else if (error.message.includes("writeFile")) {
          errorMessage =
            "Gagal menyimpan file. Coba tutup file Excel yang sedang terbuka.";
        } else if (error.stack) {
          console.error("Stack trace:", error.stack);
        }

        throw new Error(errorMessage);
      }
    };

    // Function untuk menjalankan export
    try {
      setLoading(true);

      // Fetch data guru
      const teachersData = await fetchAllTeachersData();

      if (!teachersData || teachersData.length === 0) {
        throw new Error("Tidak ada data guru untuk diekspor");
      }

      // Generate Excel file
      const filename = generateTeacherExcelFile(teachersData);

      showAlert("success", `File ${filename} berhasil diunduh`);
    } catch (error) {
      console.error("Error exporting teachers to Excel:", error);
      showAlert("error", error.message || "Gagal mengunduh data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeacher = async () => {
    if (!newTeacher.nama || !newTeacher.nip || !newTeacher.status) {
      showAlert("error", "Silakan lengkapi semua field yang wajib");
      return;
    }

    setLoading(true);
    try {
      const response = await teachersApi.createTeacher(newTeacher);

      if (response.success) {
        showAlert("success", "Data guru berhasil ditambahkan");
        fetchTeachers(); // Refresh data
        closeModal("addData");
      }
    } catch (error) {
      console.error("Add teacher error:", error);
      showAlert("error", error.message || "Gagal menambahkan data guru");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (teacher) => {
    setEditingTeacher({
      id: teacher.id,
      nama: teacher.user?.full_name || "",
      nip: teacher.nip || "",
      status: teacher.status || "",
      keterangan: teacher.keterangan || "",
      email: teacher.user?.data?.email || "",
      phone: teacher.user?.data?.phone || "",
    });
    openModal("editData");
  };

  const handleUpdateTeacher = async () => {
    if (!editingTeacher.nama || !editingTeacher.nip || !editingTeacher.status) {
      showAlert("error", "Silakan lengkapi semua field yang wajib");
      return;
    }

    setLoading(true);
    try {
      const response = await teachersApi.updateTeacher(editingTeacher.id, editingTeacher);

      if (response.success) {
        showAlert("success", "Data guru berhasil diperbarui");
        fetchTeachers(); // Refresh data
        closeModal("editData");
      }
    } catch (error) {
      console.error("Update teacher error:", error);
      showAlert("error", error.message || "Gagal memperbarui data guru");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeacher = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data guru ini?")) return;

    setLoading(true);
    try {
      const response = await teachersApi.deleteTeacher(id);

      if (response.success) {
        showAlert("success", "Data guru berhasil dihapus");
        fetchTeachers(); // Refresh data
      }
    } catch (error) {
      console.error("Delete teacher error:", error);
      showAlert("error", error.message || "Gagal menghapus data guru");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    // Convert status to string and handle non-string cases
    const statusString = typeof status === 'string' ? status.toLowerCase() : '';
    
    switch (statusString) {
      case 'hadir':
        return 'text-green-600 bg-green-50 border border-green-200';
      case 'izin':
        return 'text-blue-600 bg-blue-50 border border-blue-200';
      case 'sakit':
        return 'text-orange-600 bg-orange-50 border border-orange-200';
      case 'alpha':
        return 'text-red-600 bg-red-50 border border-red-200';
      case 'terlambat':
        return 'text-yellow-600 bg-yellow-50 border border-yellow-200';
      case 'cuti':
        return 'text-purple-600 bg-purple-50 border border-purple-200';
      case 'dinas':
        return 'text-indigo-600 bg-indigo-50 border border-indigo-200';
      default:
        return 'text-gray-600 bg-gray-50 border border-gray-200';
    }
  };

  // Pagination helpers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    const totalPages = pagination.total_pages;
    const current = pagination.current_page;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (current >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = current - 1; i <= current + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Alert */}
      {alert1.show && (
        <Alert
          className={`mb-4 ${
            alert1.type === "error"
              ? "border-red-200 bg-red-50"
              : "border-green-200 bg-green-50"
          }`}
        >
          {alert1.type === "error" ? (
            <AlertCircle className="h-4 w-4 text-red-600" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-600" />
          )}
          <AlertDescription
            className={
              alert1.type === "error" ? "text-red-700" : "text-green-700"
            }
          >
            {alert1.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Data Presensi Guru
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola data kehadiran guru sekolah
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="gap-2 hover:bg-blue-50 hover:border-blue-300"
            onClick={() => openModal("upload")}
            disabled={loading}
          >
            <Upload className="h-4 w-4" />
            Upload
          </Button>
          <Button
            variant="outline"
            className="gap-2 hover:bg-green-50 hover:border-green-300"
            onClick={() => openModal("download")}
            disabled={loading}
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button
            className="gap-2 bg-blue-600 hover:bg-blue-700"
            onClick={() => openModal("addData")}
            disabled={loading}
          >
            <Plus className="h-4 w-4" />
            Tambah Data
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Card className="shadow-sm border-0 ring-1 ring-gray-200 bg-white">
        <CardContent className="p-6">
          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show</span>
              <Select
                value={entriesPerPage.toString()}
                onValueChange={handleEntriesChange}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-600">entries</span>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari nama atau NIP..."
                className="pl-10 pr-10 w-64 border-gray-300 focus:border-blue-500"
                value={searchInput} // Menggunakan searchInput untuk display
                onChange={(e) => handleSearchInputChange(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
              />

              {/* Clear button - muncul ketika ada input atau sedang focus */}
              {(searchInput || isSearchFocused) && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {/* Loading indicator saat sedang search */}
              {searchInput !== searchTerm && searchInput && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold text-gray-700">
                    NO
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    NAMA
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    NIP
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    KELAS
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    KEHADIRAN
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    KETERANGAN
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">
                    AKSI
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="text-gray-500">Memuat data...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : teachers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center space-y-3">
                        <FileX className="h-12 w-12 text-gray-300" />
                        <span className="text-gray-500 text-lg">
                          Tidak ada data guru
                        </span>
                        <span className="text-gray-400 text-sm">
                          {searchTerm
                            ? `Tidak ditemukan hasil untuk "${searchTerm}"`
                            : "Belum ada data guru yang tersedia"}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  teachers.map((teacher, index) => (
                    <TableRow key={teacher.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {(pagination.current_page - 1) *
                          pagination.items_per_page +
                          index +
                          1}
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">
                        {teacher.user?.full_name || teacher.nama || "-"}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-gray-600">
                        {teacher.nip || "-"}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {teacher.class?.grade || "-"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            teacher.status || "Hadir"
                          )}`}
                        >
                          {teacher.status || "Hadir"}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                        {teacher.keterangan || "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => openEditModal(teacher)}
                          disabled={loading}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteTeacher(teacher.id)}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Info and Controls */}
          {!loading && teachers.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Showing{" "}
                {(pagination.current_page - 1) * pagination.items_per_page + 1}{" "}
                to{" "}
                {Math.min(
                  pagination.current_page * pagination.items_per_page,
                  pagination.total_items
                )}{" "}
                of {pagination.total_items} entries
                {searchTerm && ` (filtered from total entries)`}
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={!pagination.has_prev_page}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center space-x-1">
                  {getPageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                      {page === "..." ? (
                        <span className="px-2 py-1 text-gray-400">...</span>
                      ) : (
                        <Button
                          variant={
                            page === pagination.current_page
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className={`min-w-[2.5rem] ${
                            page === pagination.current_page
                              ? "bg-blue-600 text-white"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </Button>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={!pagination.has_next_page}
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Modal */}
      <Dialog open={modals.upload} onOpenChange={() => closeModal("upload")}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Upload Data Presensi Guru
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Upload file data presensi guru dalam format Excel atau CSV
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Pilih File Data Presensi
              </label>
              <Input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => setUploadFile(e.target.files[0])}
                className="file:mr-4 file:py-0 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                Format yang didukung: Excel (.xlsx, .xls), CSV (.csv)
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-sm mb-2 text-blue-800">
                Format Template:
              </h4>
              <button
                onClick={handleDownloadTemplate}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download size={16} />
                Download Template Excel
              </button>
            </div>

            {uploadFile && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">
                  File dipilih:{" "}
                  <span className="font-medium">{uploadFile.name}</span>
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => closeModal("upload")}
              disabled={loading}
            >
              Batal
            </Button>
            <Button onClick={handleUpload} disabled={loading || !uploadFile}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Download Modal */}
      <Dialog
        open={modals.download}
        onOpenChange={() => closeModal("download")}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Download Data Presensi Guru
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Pilih format file dan periode data presensi guru yang ingin
              diunduh
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Format Download
              </label>
              <Select value={downloadFormat} onValueChange={setDownloadFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                  <SelectItem value="csv">CSV (.csv)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Periode Data (Opsional)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    type="date"
                    placeholder="Tanggal Mulai"
                    value={dateRange.startDate}
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">Tanggal mulai</p>
                </div>
                <div>
                  <Input
                    type="date"
                    placeholder="Tanggal Akhir"
                    value={dateRange.endDate}
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">Tanggal akhir</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-700">
                Kosongkan periode untuk mendownload semua data guru
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => closeModal("download")}
              disabled={loading}
            >
              Batal
            </Button>
            <Button onClick={handleDownload} disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Data Modal */}
      <Dialog open={modals.addData} onOpenChange={() => closeModal("addData")}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Tambah Data Presensi Guru
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Silakan isi form untuk menambah data presensi guru baru
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Masukkan nama guru"
                  value={newTeacher.nama}
                  onChange={(e) =>
                    setNewTeacher((prev) => ({ ...prev, nama: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  NIP <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Masukkan NIP"
                  value={newTeacher.nip}
                  onChange={(e) =>
                    setNewTeacher((prev) => ({ ...prev, nip: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  placeholder="Masukkan email"
                  value={newTeacher.email}
                  onChange={(e) =>
                    setNewTeacher((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Telepon
                </label>
                <Input
                  placeholder="Masukkan nomor telepon"
                  value={newTeacher.phone}
                  onChange={(e) =>
                    setNewTeacher((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Status Kehadiran <span className="text-red-500">*</span>
              </label>
              <Select
                value={newTeacher.status}
                onValueChange={(value) =>
                  setNewTeacher((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status kehadiran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hadir">Hadir</SelectItem>
                  <SelectItem value="Izin">Izin</SelectItem>
                  <SelectItem value="Sakit">Sakit</SelectItem>
                  <SelectItem value="Alpha">Alpha</SelectItem>
                  <SelectItem value="Terlambat">Terlambat</SelectItem>
                  <SelectItem value="Cuti">Cuti</SelectItem>
                  <SelectItem value="Dinas Luar">Dinas Luar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Keterangan (Opsional)
              </label>
              <Input
                placeholder="Masukkan keterangan tambahan"
                value={newTeacher.keterangan}
                onChange={(e) =>
                  setNewTeacher((prev) => ({
                    ...prev,
                    keterangan: e.target.value,
                  }))
                }
              />
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-sm mb-1 text-blue-800">
                Catatan:
              </h4>
              <p className="text-xs text-blue-600">
                Field yang bertanda (*) wajib diisi. Data guru akan disimpan ke
                dalam sistem setelah berhasil ditambahkan.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => closeModal("addData")}
              disabled={loading}
            >
              Batal
            </Button>
            <Button onClick={handleAddTeacher} disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Menambahkan...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Data
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Data Modal */}
      <Dialog open={modals.editData} onOpenChange={() => closeModal("editData")}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Edit Data Presensi Guru
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Silakan ubah form untuk memperbarui data presensi guru
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Masukkan nama guru"
                  value={editingTeacher?.nama || ""}
                  onChange={(e) =>
                    setEditingTeacher((prev) => ({ ...prev, nama: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  NIP <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Masukkan NIP"
                  value={editingTeacher?.nip || ""}
                  onChange={(e) =>
                    setEditingTeacher((prev) => ({ ...prev, nip: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  placeholder="Masukkan email"
                  value={editingTeacher?.email || ""}
                  onChange={(e) =>
                    setEditingTeacher((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Telepon
                </label>
                <Input
                  placeholder="Masukkan nomor telepon"
                  value={editingTeacher?.phone || ""}
                  onChange={(e) =>
                    setEditingTeacher((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Status Kehadiran <span className="text-red-500">*</span>
              </label>
              <Select
                value={editingTeacher?.status || ""}
                onValueChange={(value) =>
                  setEditingTeacher((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status kehadiran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hadir">Hadir</SelectItem>
                  <SelectItem value="Izin">Izin</SelectItem>
                  <SelectItem value="Sakit">Sakit</SelectItem>
                  <SelectItem value="Alpha">Alpha</SelectItem>
                  <SelectItem value="Terlambat">Terlambat</SelectItem>
                  <SelectItem value="Cuti">Cuti</SelectItem>
                  <SelectItem value="Dinas Luar">Dinas Luar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Keterangan (Opsional)
              </label>
              <Input
                placeholder="Masukkan keterangan tambahan"
                value={editingTeacher?.keterangan || ""}
                onChange={(e) =>
                  setEditingTeacher((prev) => ({
                    ...prev,
                    keterangan: e.target.value,
                  }))
                }
              />
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-sm mb-1 text-blue-800">
                Catatan:
              </h4>
              <p className="text-xs text-blue-600">
                Field yang bertanda (*) wajib diisi. Data guru akan diperbarui di
                dalam sistem setelah berhasil disimpan.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => closeModal("editData")}
              disabled={loading}
            >
              Batal
            </Button>
            <Button onClick={handleUpdateTeacher} disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Memperbarui...
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Perbarui Data
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedPresensiGuru;
