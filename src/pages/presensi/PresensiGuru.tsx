import React, { useState, useEffect, Fragment } from "react";
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
  Eye,
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
import Modal from "@/components/Modal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { presensiGuruAPI } from "@/utils/axios2";

// Custom hook for debounced value
const useDebounce = (value: string, delay: number): string => {
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

// Status mapping functions
const capitalizeStatus = (status: string | string[] | undefined | null): string => {
  if (!status) return "Unknown";
  let statusStr: string;
  if (Array.isArray(status)) {
    statusStr = status[0] || "Unknown";
  } else if (typeof status === 'string') {
    statusStr = status;
  } else {
    return "Unknown";
  }
  const map: Record<string, string> = {
    "hadir": "Hadir",
    "izin": "Izin",
    "sakit": "Sakit",
    "alpha": "Alpha",
    "terlambat": "Terlambat",
    "cuti": "Cuti",
    "dinas": "Dinas Luar"
  };
  return map[statusStr as keyof typeof map] || statusStr.charAt(0).toUpperCase() + statusStr.slice(1).toLowerCase();
};

const normalizeStatus = (status: string): string => {
  const map: Record<string, string> = {
    "Hadir": "hadir",
    "Izin": "izin",
    "Sakit": "sakit",
    "Alpha": "alpha",
    "Terlambat": "terlambat",
    "Cuti": "cuti",
    "Dinas Luar": "dinas"
  };
  return map[status as keyof typeof map] || status.toLowerCase();
};

// Interfaces
interface Teacher {
  id: number;
  id_user?: number | null;
  id_role?: number | null;
  id_class: number | null;
  status: string[] | null;
  information?: string;
  date?: string;
  time?: string;
  created_at?: string;
  updated_at?: string;
  user?: {
    full_name?: string;
  };
  role?: {
    name?: string;
  };
}

interface APIError {
  response?: {
    data?: {
      error?: string;
      message?: string;
      errors?: Record<string, string[]>;
      issues?: string[] | { message: string }[];
      name?: string;
    };
    status?: number;
  };
  message?: string;
}

interface NewTeacher {
  id_user?: number | null;
  id_role?: number | null;
  id_class?: number | null;
  status: string[];
  information?: string;
  date?: string;
  time?: string;
}

// Modal content component
const DaftarPresensiGuru = ({
  text,
  category,
  onClose,
  onSubmit,
  selectedTeacher,
}: {
  text: string;
  category: string;
  onClose: () => void;
  onSubmit: (formData: NewTeacher | { file: File } | { format: string; startDate?: string; endDate?: string }) => void;
  selectedTeacher?: Teacher | null;
}) => {
  const [formData, setFormData] = useState<NewTeacher>({
    id_user: null,
    id_role: null,
    id_class: null,
    status: [],
    information: "",
    date: "",
    time: "",
  });

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [downloadFormat, setDownloadFormat] = useState("xlsx");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    console.log("Selected Teacher:", selectedTeacher); // Debug log
    if (category === "Edit" && selectedTeacher) {
      setFormData({
        id_user: selectedTeacher.id_user || null,
        id_role: selectedTeacher.id_role || null,
        id_class: selectedTeacher.id_class || null,
        status: selectedTeacher.status ? [capitalizeStatus(selectedTeacher.status)] : [],
        information: selectedTeacher.information || "",
        date: selectedTeacher.date || selectedTeacher.created_at?.split(' ')[0] || "",
        time: selectedTeacher.time || selectedTeacher.created_at?.split(' ')[1]?.split(':').slice(0, 2).join(':') || "",
      });
    } else if (category === "Tambah Data" && !selectedTeacher) {
      setFormData({
        id_user: null,
        id_role: null,
        id_class: null,
        status: [],
        information: "",
        date: "",
        time: "",
      });
    }
  }, [category, selectedTeacher]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.status || formData.status.length === 0) {
      alert("Status kehadiran harus dipilih");
      return;
    }
    
    if (category === "Tambah Data" && (!formData.id_user || formData.id_user <= 0)) {
      alert("ID User harus diisi dengan angka yang valid");
      return;
    }
    
    if (category === "Tambah Data" && (!formData.id_role || formData.id_role <= 0)) {
      alert("ID Role harus diisi dengan angka yang valid");
      return;
    }
    
    // Validate and format date
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!formData.date || !dateRegex.test(formData.date)) {
      alert("Tanggal harus diisi dalam format YYYY-MM-DD");
      return;
    }
    
    // Validate and format time
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!formData.time || !timeRegex.test(formData.time)) {
      alert("Waktu harus diisi dalam format HH:MM");
      return;
    }
    
    console.log("Form Data sebelum submit:", formData);
    onSubmit(formData);
  };

  const handleChange = (field: keyof NewTeacher, value: string | string[] | number | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUploadSubmit = () => {
    if (!uploadFile) {
      alert("Pilih file dulu");
      return;
    }
    onSubmit({ file: uploadFile });
  };

  const handleDownloadSubmit = () => {
    onSubmit({
      format: downloadFormat,
      startDate: dateRange.startDate || undefined,
      endDate: dateRange.endDate || undefined,
    });
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement("a");
    link.href = "/tu/file_template/Template%20Presensi%20Guru%20-%20Harian.xlsx";
    link.download = "template_presensi_guru.xlsx";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      {category === "Upload" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{text}</p>
          <div>
            <label className="block text-sm font-medium mb-2">
              Pilih File Data Presensi
            </label>
            <Input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
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
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadTemplate}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download Template Excel
            </Button>
          </div>

          {uploadFile && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">
                File dipilih: <span className="font-medium">{uploadFile.name}</span>
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button className="gap-2" onClick={handleUploadSubmit}>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>
      )}

      {category === "Download" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{text}</p>
          <div>
            <label className="block text-sm font-medium mb-2">Format File</label>
            <Select value={downloadFormat} onValueChange={setDownloadFormat}>
              <SelectTrigger>
                <SelectValue />
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
                  value={dateRange.startDate}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, startDate: e.target.value }))
                  }
                  placeholder="Tanggal Mulai"
                />
              </div>
              <div>
                <Input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
                  }
                  placeholder="Tanggal Akhir"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button className="gap-2" onClick={handleDownloadSubmit}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      )}

      {(category === "Tambah Data" || category === "Edit") && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                ID User <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                placeholder="Masukkan ID User"
                value={formData.id_user !== null && formData.id_user !== undefined ? formData.id_user.toString() : ""}
                onChange={(e) => {
                  const value = e.target.value;
                  handleChange("id_user", value ? parseInt(value) : null);
                }}
                disabled={category === "Edit"}
              />
              <p className="text-xs text-gray-500 mt-1">
                ID User yang akan dikaitkan dengan data presensi
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                ID Role <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                placeholder="Masukkan ID Role"
                value={formData.id_role !== null && formData.id_role !== undefined ? formData.id_role.toString() : ""}
                onChange={(e) => {
                  const value = e.target.value;
                  handleChange("id_role", value ? parseInt(value) : null);
                }}
                disabled={category === "Edit"}
              />
              <p className="text-xs text-gray-500 mt-1">
                ID Role untuk guru (misal: 1 untuk Guru)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                ID Kelas
              </label>
              <Input
                type="number"
                placeholder="Masukkan ID Kelas"
                value={formData.id_class !== null && formData.id_class !== undefined ? formData.id_class.toString() : ""}
                onChange={(e) => {
                  const value = e.target.value;
                  handleChange("id_class", value ? parseInt(value) : null);
                }}
                disabled={category === "Edit"}
              />
              <p className="text-xs text-gray-500 mt-1">
                ID Kelas yang terkait (opsional)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Status Kehadiran <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2 border border-gray-300 rounded-md p-3">
                {["Hadir", "Izin", "Sakit", "Alpha", "Terlambat", "Cuti", "Dinas Luar"].map((option) => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.status.includes(option)}
                      onChange={(e) => {
                        const newStatus = e.target.checked
                          ? [...formData.status, option]
                          : formData.status.filter((s) => s !== option);
                        handleChange("status", newStatus);
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Tanggal <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={formData.date || ""}
                onChange={(e) => handleChange("date", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Waktu <span className="text-red-500">*</span>
              </label>
              <Input
                type="time"
                value={formData.time || ""}
                onChange={(e) => handleChange("time", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Informasi (Opsional)
              </label>
              <Input
                placeholder="Masukkan informasi tambahan"
                value={formData.information || ""}
                onChange={(e) => handleChange("information", e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button className="gap-2" onClick={handleSubmit}>
              Simpan
            </Button>
          </div>
        </div>
      )}

      {category === "Detail" && selectedTeacher && (
        <div className="space-y-4">
          <div className="space-y-3">
            <p><strong>ID:</strong> {selectedTeacher.id}</p>
            <p><strong>ID User:</strong> {selectedTeacher.id_user || "-"}</p>
            <p><strong>ID Role:</strong> {selectedTeacher.id_role || "-"}</p>
            <p><strong>ID Kelas:</strong> {selectedTeacher.id_class || "-"}</p>
            <p><strong>Nama:</strong> {selectedTeacher.user?.full_name || "-"}</p>
            <p><strong>Role:</strong> {selectedTeacher.role?.name || "-"}</p>
            <p><strong>Status:</strong> {capitalizeStatus(selectedTeacher.status)}</p>
            <p><strong>Informasi:</strong> {selectedTeacher.information || "-"}</p>
            <p><strong>Tanggal:</strong> {selectedTeacher.date || selectedTeacher.created_at?.split(' ')[0] || "-"}</p>
            <p><strong>Waktu:</strong> {selectedTeacher.time || selectedTeacher.created_at?.split(' ')[1] || "-"}</p>
            <p><strong>Dibuat pada:</strong> {formatDate(selectedTeacher.created_at)}</p>
            <p><strong>Diperbarui pada:</strong> {formatDate(selectedTeacher.updated_at)}</p>
          </div>

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Tutup
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const EnhancedPresensiGuru = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalText, setModalText] = useState("");
  const [category, setCategory] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedDetailTeacher, setSelectedDetailTeacher] = useState<Teacher | null>(null);

  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearchTerm = useDebounce(searchInput, 500);

  useEffect(() => {
    loadPresensiGuruData();
  }, []);

  useEffect(() => {
    setSearchTerm(debouncedSearchTerm.toLowerCase());
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const loadPresensiGuruData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await presensiGuruAPI.getAll();
      console.log("Response dari API:", response.data); // Debug API response
      setTeachers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      const apiError = err as APIError;
      setError(
        apiError.response?.data?.error || 
        apiError.response?.data?.message || 
        apiError.message || 
        "Gagal memuat data presensi guru"
      );
      console.error("Error loading presensi guru data:", err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (title: string, text = "", cat = "", teacherItem: Teacher | null = null) => {
    setModalTitle(title);
    setModalText(text);
    setCategory(cat);
    setSelectedTeacher(teacherItem);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalTitle("");
    setModalText("");
    setCategory("");
    setSelectedTeacher(null);
  };

  const openDetailModal = (teacher: Teacher) => {
    setSelectedDetailTeacher(teacher);
    setIsDetailOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailOpen(false);
    setSelectedDetailTeacher(null);
  };

  const handleUpload = () => {
    openModal(
      "Upload Data Presensi Guru",
      "Upload file data presensi guru dalam format Excel atau CSV",
      "Upload"
    );
  };

  const handleDownload = () => {
    openModal(
      "Download Data Presensi Guru",
      "Pilih format file dan periode data yang ingin diunduh",
      "Download"
    );
  };

  const handleTambahData = () => {
    openModal("Tambah Data Presensi Guru", "", "Tambah Data");
  };

  const handleSubmitData = async (formData: NewTeacher | { file: File } | { format: string; startDate?: string; endDate?: string }) => {
    try {
      setLoading(true);

      if ("file" in formData) {
        const fileFormData = new FormData();
        fileFormData.append("file", formData.file);
        
        const response = await presensiGuruAPI.uploadFile(fileFormData);
        alert("File berhasil diupload");
        await loadPresensiGuruData();
        closeModal();
        return;
      }

      if ("format" in formData) {
        const teachersData = getFilteredTeachers();
        
        if (!teachersData || teachersData.length === 0) {
          throw new Error("Tidak ada data guru untuk diekspor");
        }

        const wb = XLSX.utils.book_new();

        const excelData = teachersData.map((teacher, index) => ({
          NO: index + 1,
          ID_USER: teacher.id_user || "N/A",
          ID_ROLE: teacher.id_role || "N/A",
          ID_KELAS: teacher.id_class || "N/A",
          NAMA: teacher.user?.full_name || "N/A",
          ROLE: teacher.role?.name || "N/A",
          STATUS: teacher.status ? teacher.status[0] : "N/A",
          INFORMASI: teacher.information || "N/A",
          TANGGAL: teacher.date || "N/A",
          WAKTU: teacher.time || "N/A",
          TANGGAL_DIBUAT: teacher.created_at ? new Date(teacher.created_at).toLocaleDateString("id-ID") : "N/A",
        }));

        const ws = XLSX.utils.json_to_sheet(excelData);
        XLSX.utils.book_append_sheet(wb, ws, "Data Presensi Guru");

        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const filename = `Data_Presensi_Guru_${dateStr}.${formData.format}`;

        XLSX.writeFile(wb, filename);
        
        alert(`File ${filename} berhasil diunduh`);
        closeModal();
        return;
      }

      const teacherData = formData as NewTeacher;
      
      if (!teacherData.status || teacherData.status.length === 0) {
        throw new Error("Status kehadiran harus dipilih");
      }
      
      if (category === "Tambah Data" && (!teacherData.id_user || teacherData.id_user <= 0)) {
        throw new Error("ID User harus diisi dengan angka yang valid");
      }
      
      if (category === "Tambah Data" && (!teacherData.id_role || teacherData.id_role <= 0)) {
        throw new Error("ID Role harus diisi dengan angka yang valid");
      }
      
      if (category === "Tambah Data" && !teacherData.date) {
        throw new Error("Tanggal harus diisi");
      }
      
      if (category === "Tambah Data" && !teacherData.time) {
        throw new Error("Waktu harus diisi");
      }

      const normalizedStatus = [normalizeStatus(teacherData.status[0])];
      
      const teacherPayload: Record<string, string | number | string[] | null> = {
        id_user: teacherData.id_user,
        id_role: teacherData.id_role,
        id_class: teacherData.id_class,
        status: normalizedStatus,
        information: teacherData.information && teacherData.information.trim() ? teacherData.information.trim() : null,
        date: teacherData.date,
        time: teacherData.time,
      };

      console.log("Payload dikirim ke API:", teacherPayload);

      if (category === "Edit" && selectedTeacher) {
        await presensiGuruAPI.update(selectedTeacher.id, teacherPayload);
        alert("Data presensi guru berhasil diperbarui!");
      } else {
        await presensiGuruAPI.create(teacherPayload);
        alert("Data presensi guru berhasil ditambahkan!");
      }

      await loadPresensiGuruData();
      closeModal();
    } catch (err) {
      const apiError = err as APIError;
      let errorMessage = "Terjadi kesalahan yang tidak diketahui";
      
      if (apiError.response?.data) {
        console.log("API Error Response:", apiError.response.data);
        if (apiError.response.data.error) {
          errorMessage = apiError.response.data.error;
        } else if (apiError.response.data.message) {
          errorMessage = apiError.response.data.message;
        } else if (apiError.response.data.errors) {
          const errors = apiError.response.data.errors;
          errorMessage = Object.values(errors).flat().join(', ') || errorMessage;
        } else if (apiError.response.data.issues) {
          errorMessage = Array.isArray(apiError.response.data.issues)
            ? apiError.response.data.issues.map((issue: any) => issue.message || issue).join(', ')
            : JSON.stringify(apiError.response.data.issues);
        } else if (apiError.response.data.name) {
          errorMessage = apiError.response.data.name;
        }
      } else if (apiError.message) {
        errorMessage = apiError.message;
      }
      
      setError(errorMessage);
      console.error("Error saving presensi guru:", err);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeacher = async (id: number) => {
    if (!confirm("Yakin ingin menghapus data presensi guru ini?")) return;
    
    try {
      setLoading(true);
      await presensiGuruAPI.delete(id);
      await loadPresensiGuruData();
      alert("Data presensi guru berhasil dihapus!");
    } catch (err) {
      const apiError = err as APIError;
      const errorMessage =
        apiError.response?.data?.error ||
        apiError.response?.data?.message ||
        apiError.message ||
        "Gagal menghapus data presensi guru";
      
      console.error("Error deleting presensi guru:", err);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTeachers = () => {
    let filtered = teachers;
    if (searchTerm) {
      filtered = filtered.filter(
        (teacher) =>
          teacher.user?.full_name?.toLowerCase().includes(searchTerm) ||
          (teacher.status && teacher.status[0].toLowerCase().includes(searchTerm))
      );
    }
    return filtered;
  };

  const filteredData = getFilteredTeachers();
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + entriesPerPage);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleEntriesChange = (value: string) => {
    setEntriesPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getStatusColor = (status?: string[] | null) => {
    const statusStr = status && status[0] ? status[0].toLowerCase() : "unknown";
    
    switch (statusStr) {
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
      case 'dinas luar':
        return 'text-indigo-600 bg-indigo-50 border border-indigo-200';
      default:
        return 'text-gray-600 bg-gray-50 border border-gray-200';
    }
  };

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {error && (
        <Alert className="mb-4 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            {typeof error === 'string' ? error : JSON.stringify(error)}
            <Button onClick={loadPresensiGuruData} variant="outline" size="sm" className="ml-2">
              Coba Lagi
            </Button>
          </AlertDescription>
        </Alert>
      )}

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
            onClick={handleUpload}
            disabled={loading}
          >
            <Upload className="h-4 w-4" />
            Upload
          </Button>
          <Button
            variant="outline"
            className="gap-2 hover:bg-green-50 hover:border-green-300"
            onClick={handleDownload}
            disabled={loading}
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button
            className="gap-2 bg-blue-600 hover:bg-blue-700"
            onClick={handleTambahData}
            disabled={loading}
          >
            <Plus className="h-4 w-4" />
            Tambah Data
          </Button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
        <DaftarPresensiGuru
          text={modalText}
          category={category}
          onClose={closeModal}
          onSubmit={handleSubmitData}
          selectedTeacher={selectedTeacher}
        />
      </Modal>

      <Modal
        isOpen={isDetailOpen}
        onClose={closeDetailModal}
        title="Detail Presensi Guru"
      >
        <DaftarPresensiGuru
          text=""
          category="Detail"
          onClose={closeDetailModal}
          onSubmit={() => {}}
          selectedTeacher={selectedDetailTeacher}
        />
      </Modal>

      <Card className="shadow-sm border-0 ring-1 ring-gray-200 bg-white">
        <CardContent className="p-6">
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
                placeholder="Cari nama atau status..."
                className="pl-10 pr-10 w-64 border-gray-300 focus:border-blue-500"
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
              />

              {searchInput && (
                <button
                  type="button"
                  onClick={() => handleSearchChange("")}
                  className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {searchInput !== searchTerm && searchInput && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
          </div>

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
                    ROLE
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    KEHADIRAN
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    INFORMASI
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    TANGGAL
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
                ) : paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center space-y-3">
                        <FileX className="h-12 w-12 text-gray-300" />
                        <span className="text-gray-500 text-lg">
                          Tidak ada data guru
                        </span>
                        <span className="text-gray-400 text-sm">
                          {searchTerm
                            ? `Tidak ditemukan hasil untuk "${searchInput}"`
                            : "Belum ada data guru yang tersedia"}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((teacher, index) => (
                    <TableRow key={teacher.id || index} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {startIndex + index + 1}
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">
                        {teacher.user?.full_name || "-"}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {teacher.role?.name || "-"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            teacher.status
                          )}`}
                        >
                          {capitalizeStatus(teacher.status)}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                        {teacher.information || "-"}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {teacher.date || "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex gap-2 justify-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                            onClick={() => openDetailModal(teacher)}
                            disabled={loading}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => openModal("Edit Data Presensi Guru", "", "Edit", teacher)}
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
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {!loading && paginatedData.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(startIndex + entriesPerPage, filteredData.length)} of {filteredData.length} entries
                {searchTerm && ` (filtered from total entries)`}
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center space-x-1">
                  {getPageNumbers().map((page, index) => (
                    <Fragment key={index}>
                      {page === "..." ? (
                        <span className="px-2 py-1 text-gray-400">...</span>
                      ) : (
                        <Button
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page as number)}
                          className={`min-w-[2.5rem] ${
                            page === currentPage
                              ? "bg-blue-600 text-white"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </Button>
                      )}
                    </Fragment>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
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
    </div>
  );
};

export default EnhancedPresensiGuru;