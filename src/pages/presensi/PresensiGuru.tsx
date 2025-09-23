import React, { useState, useEffect } from "react";
import {
  Plus,
  Download,
  Upload,
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  FileX,
  CheckCircle,
  AlertCircle,
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
    const response = await api.get("/api//teachers", {
      params: {
        page: params.page,
        limit: params.limit,
        search: params.search,
        sortBy: "created_at",
        sortOrder: "desc",
      },
    });
    return response;
  },

  async uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/api//teachers/bulk", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  },

  async downloadData(format, startDate, endDate) {
    const params = { format };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await api.get("/api//teachers/export", {
      params,
      responseType: "blob",
    });

    // Create download link for blob response
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
  },

  async createTeacher(teacherData) {
    // Transform data to match your backend structure
    const payload = {
      id_user: null, // You'll need to handle user creation first
      id_class: null, // You'll need to get class ID
      nip: teacherData.nip,
      // Additional teacher data can be added here
      userData: {
        full_name: teacherData.nama,
        id_role: 3, // Teacher role ID
        data: {
          phone: teacherData.phone || "",
          email: teacherData.email || "",
        },
      },
    };

    const response = await api.post("/api//teachers", payload);
    return response;
  },

  async deleteTeacher(id) {
    const response = await api.delete(`/api//teachers/${id}`);
    return response;
  },

  async searchTeachers(query, limit = 10) {
    const response = await api.get("/api//teachers/search", {
      params: { q: query, limit },
    });
    return response;
  },

  async getTeachersByClass(classId, page = 1, limit = 10) {
    const response = await api.get(`/api//teachers/class/${classId}`, {
      params: { page, limit },
    });
    return response;
  },

  async getTeachersStats() {
    const response = await api.get("/api//teachers/stats/classes");
    return response;
  },

  async restoreTeacher(id) {
    const response = await api.post(`/api//teachers/${id}/restore`);
    return response;
  },
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
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [modals, setModals] = useState({
    upload: false,
    download: false,
    addData: false,
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

  // Alert state
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  // Fetch teachers data
  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: entriesPerPage,
        search: searchTerm,
      };

      const response = await teachersApi.getTeachers(params);

      // Handle response structure based on your backend
      if (response.data) {
        setTeachers(response.data);
        setPagination(
          JSON.parse(response.headers["x-pagination"]) || {
            current_page: currentPage,
            total_pages: 1,
            total_items: response.data.length,
            items_per_page: entriesPerPage,
            has_next_page: false,
            has_prev_page: false,
          }
        );
      } else {
        setTeachers([]);
        setPagination({
          current_page: 1,
          total_pages: 1,
          total_items: 0,
          items_per_page: entriesPerPage,
          has_next_page: false,
          has_prev_page: false,
        });
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
      showAlert(
        "error",
        error.response?.data?.message || "Gagal memuat data guru"
      );
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

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
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: "", message: "" }), 5000);
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
    if (modalName === "download") {
      setDateRange({ startDate: "", endDate: "" });
      setDownloadFormat("xlsx");
    }
  };

  const openModal = (modalName) => {
    setModals((prev) => ({ ...prev, [modalName]: true }));
  };

  // Handle functions
  const handleSearch = (value) => {
    setSearchTerm(value);
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
      showAlert("error", "Silakan pilih file terlebih dahulu");
      return;
    }

    setLoading(true);
    try {
      const response = await teachersApi.uploadFile(uploadFile);

      // Handle response based on your backend structure
      const responseData = response.data;

      if (responseData.success && responseData.data) {
        const { created, errors, summary } = responseData.data;

        if (summary.successful > 0) {
          showAlert(
            "success",
            `${summary.successful} guru berhasil ditambahkan`
          );
          fetchTeachers(); // Refresh data
          closeModal("upload");
        }

        if (errors && errors.length > 0) {
          showAlert("error", `${errors.length} data gagal diproses`);
        }
      } else {
        showAlert("success", responseData.message || "File berhasil diupload");
        fetchTeachers();
        closeModal("upload");
      }
    } catch (error) {
      console.error("Upload error:", error);
      showAlert(
        "error",
        error.response?.data?.message || "Gagal mengupload file"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      await teachersApi.downloadData(
        downloadFormat,
        dateRange.startDate,
        dateRange.endDate
      );
      showAlert("success", "File berhasil didownload");
      closeModal("download");
    } catch (error) {
      console.error("Download error:", error);
      showAlert(
        "error",
        error.response?.data?.message || "Gagal mendownload file"
      );
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

      if (response.data) {
        showAlert("success", "Data guru berhasil ditambahkan");
        fetchTeachers(); // Refresh data
        closeModal("addData");
      }
    } catch (error) {
      console.error("Create teacher error:", error);
      showAlert(
        "error",
        error.response?.data?.message || "Gagal menambahkan data guru"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeacher = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data guru ini?")) return;

    setLoading(true);
    try {
      const response = await teachersApi.deleteTeacher(id);

      if (response.data || response.status === 200) {
        showAlert("success", "Data guru berhasil dihapus");
        fetchTeachers(); // Refresh data
      }
    } catch (error) {
      console.error("Delete teacher error:", error);
      showAlert(
        "error",
        error.response?.data?.message || "Gagal menghapus data guru"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "hadir":
        return "text-green-600 bg-green-50 border border-green-200";
      case "izin":
        return "text-blue-600 bg-blue-50 border border-blue-200";
      case "sakit":
        return "text-orange-600 bg-orange-50 border border-orange-200";
      case "alpha":
        return "text-red-600 bg-red-50 border border-red-200";
      case "terlambat":
        return "text-yellow-600 bg-yellow-50 border border-yellow-200";
      case "cuti":
        return "text-purple-600 bg-purple-50 border border-purple-200";
      case "dinas":
        return "text-indigo-600 bg-indigo-50 border border-indigo-200";
      default:
        return "text-gray-600 bg-gray-50 border border-gray-200";
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
      {alert.show && (
        <Alert
          className={`mb-4 ${
            alert.type === "error"
              ? "border-red-200 bg-red-50"
              : "border-green-200 bg-green-50"
          }`}
        >
          {alert.type === "error" ? (
            <AlertCircle className="h-4 w-4 text-red-600" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-600" />
          )}
          <AlertDescription
            className={
              alert.type === "error" ? "text-red-700" : "text-green-700"
            }
          >
            {alert.message}
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
                className="pl-10 w-64 border-gray-300 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                disabled={loading}
              />
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
                        {teacher.user?.full_name || teacher.nama}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-gray-600">
                        {teacher.nip}
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
              <p className="text-xs text-blue-600">
                Pastikan file memiliki kolom: Nama Lengkap, NIP, Kelas, Jurusan,
                Subkelas, Tahun Ajaran
              </p>
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
                Format File
              </label>
              <Select value={downloadFormat} onValueChange={setDownloadFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                  <SelectItem value="csv">CSV (.csv)</SelectItem>
                  <SelectItem value="pdf">PDF (.pdf)</SelectItem>
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
    </div>
  );
};

export default EnhancedPresensiGuru;
