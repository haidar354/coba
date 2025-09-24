  import {
    Search,
    Edit,
    Plus,
    Download,
    Upload,
    X,
    ChevronLeft,
    ChevronRight,
    Trash2,
    RotateCcw,
    FileSpreadsheet,
    AlertCircle,
    CheckCircle,
    Loader2,
  } from "lucide-react";
  import { Input } from "@/components/ui/input";
  import { Button } from "@/components/ui/button";
  import { Card, CardContent } from "@/components/ui/card";
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
  import { useState, useEffect, useCallback } from "react";
  import api from "@/utils/axios";

  // Modal Component
  const Modal = ({ isOpen, onClose, title, children, size = "default" }) => {
    if (!isOpen) return null;

    const sizeClass = size === "large" ? "max-w-7xl" : "max-w-4xl";

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <div
          className={`bg-white rounded-lg ${sizeClass} w-full max-h-[90vh] overflow-hidden shadow-2xl`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
            {children}
          </div>
        </div>
      </div>
    );
  };

  // Alert Component
  const Alert = ({ type, message, onClose }) => {
    const bgColor =
      type === "success"
        ? "bg-green-50 border-green-200"
        : "bg-red-50 border-red-200";
    const textColor = type === "success" ? "text-green-800" : "text-red-800";
    const Icon = type === "success" ? CheckCircle : AlertCircle;

    return (
      <div
        className={`${bgColor} border rounded-lg p-4 mb-4 flex items-center gap-3`}
      >
        <Icon className={`h-5 w-5 ${textColor}`} />
        <span className={`flex-1 ${textColor}`}>{message}</span>
        <button onClick={onClose} className={`${textColor} hover:opacity-70`}>
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  };

  // Download Modal Content
  const DownloadModal = ({ onClose, onDownload }) => {
    const [format, setFormat] = useState("excel");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleDownload = async () => {
      setIsLoading(true);
      try {
        await onDownload({ format, startDate, endDate });
        onClose();
      } catch (error) {
        console.error("Download error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Pilih format file dan periode data guru yang ingin diunduh
        </p>

        <div>
          <label className="block text-sm font-medium mb-2">Format File</label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excel">Excel (.xlsx)</SelectItem>
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
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Input
                type="date"
                placeholder="Tanggal Akhir"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button onClick={handleDownload} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Mengunduh...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download
              </>
            )}
          </Button>
        </div>
      </div>
    );
  };

  // Upload Modal Content
  const UploadModal = ({ onClose, onUpload }) => {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadResult, setUploadResult] = useState(null);

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      setFile(file);
      setUploadResult(null);
    };

    const handleUpload = async () => {
      if (!file) {
        alert("Pilih file terlebih dahulu");
        return;
      }

      setIsLoading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder_name", "data/guru");

        const response = await api.post("/api/upload/excel", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
        });

        if (response.status === 200) {
          console.log("Response data:", response);
          const responseada = await api.post("/api/teachers/bulk", {
            type: "excel",
            data: response.data,
          });
          if (responseada.status === 201) {
            alert(`Upload berhasil!`);
            onClose();
          }
        }
      } catch (error) {
        if (error.response) {
          alert("Upload gagal: " + error.response.data.message);
        } else {
          alert("Error: " + error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    const handleDownload = () => {
      // Create a temporary link element to trigger download
      const link = document.createElement("a");
      link.href = "/tu/file_template/Template%20Data%20Guru.xlsx";
      link.download = "template_data_guru.xlsx";
      link.target = "_blank";

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Upload file data guru dalam format Excel atau CSV
        </p>

        {uploadResult && (
          <Alert
            type={uploadResult.success ? "success" : "error"}
            message={uploadResult.message}
            onClose={() => setUploadResult(null)}
          />
        )}

        <div>
          <label className="block text-sm font-medium mb-2">
            Pilih File Data Guru
          </label>
          <Input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Format yang didukung: Excel (.xlsx, .xls), CSV (.csv)
          </p>
        </div>

        <div className="p-4 border rounded-lg bg-blue-50">
                <h4 className="font-medium text-sm mb-2">Template Excel:</h4>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download size={16} />
                  Download Template Excel
                </button>
              </div>

        {uploadResult && uploadResult.data && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Hasil Upload:</h4>
            <div className="text-xs space-y-1">
              <p>Total: {uploadResult.data.summary?.total || 0}</p>
              <p className="text-green-600">
                Berhasil: {uploadResult.data.summary?.successful || 0}
              </p>
              <p className="text-red-600">
                Gagal: {uploadResult.data.summary?.failed || 0}
              </p>
            </div>
            {uploadResult.data.errors && uploadResult.data.errors.length > 0 && (
              <details className="mt-2">
                <summary className="cursor-pointer text-xs font-medium">
                  Lihat Error
                </summary>
                <div className="mt-2 text-xs text-red-600 space-y-1">
                  {uploadResult.data.errors.slice(0, 5).map((error, index) => (
                    <p key={index}>
                      Baris {error.index + 1}: {error.error}
                    </p>
                  ))}
                  {uploadResult.data.errors.length > 5 && (
                    <p>
                      ... dan {uploadResult.data.errors.length - 5} error lainnya
                    </p>
                  )}
                </div>
              </details>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button onClick={handleUpload} disabled={!file || isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Mengupload...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </>
            )}
          </Button>
        </div>
      </div>
    );
  };

  // Add Teacher Modal Content
  const AddTeacherModal = ({ onClose, onAdd }) => {
    const [formData, setFormData] = useState({
      full_name: "",
      nip: "",
      email: "",
      phone: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!formData.full_name || !formData.nip) {
        alert("Nama dan NIP harus diisi!");
        return;
      }

      setIsLoading(true);
      try {
        await onAdd(formData);
        onClose();
      } catch (error) {
        console.error("Add teacher error:", error);
        alert(
          "Gagal menambahkan guru: " +
            (error.response?.data?.message || error.message)
        );
      } finally {
        setIsLoading(false);
      }
    };

    const handleChange = (field) => (e) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-600">
          Silakan isi form untuk menambah data guru baru
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nama Lengkap *
            </label>
            <Input
              placeholder="Masukkan nama lengkap guru"
              value={formData.full_name}
              onChange={handleChange("full_name")}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">NIP *</label>
            <Input
              placeholder="Masukkan NIP"
              value={formData.nip}
              onChange={handleChange("nip")}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Email (Opsional)
          </label>
          <Input
            type="email"
            placeholder="Masukkan email guru"
            value={formData.email}
            onChange={handleChange("email")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            No. Telepon (Opsional)
          </label>
          <Input
            placeholder="Masukkan nomor telepon"
            value={formData.phone}
            onChange={handleChange("phone")}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Data
              </>
            )}
          </Button>
        </div>
      </form>
    );
  };

  // Edit Teacher Modal Content
  const EditTeacherModal = ({ teacher, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
      full_name: teacher.user?.full_name || "",
      nip: teacher.nip || "",
      email: teacher.user?.data?.email || "",
      phone: teacher.user?.data?.phone || "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!formData.full_name || !formData.nip) {
        alert("Nama dan NIP harus diisi!");
        return;
      }

      setIsLoading(true);
      try {
        await onUpdate(teacher.id, formData);
        onClose();
      } catch (error) {
        console.error("Update teacher error:", error);
        alert(
          "Gagal mengupdate guru: " +
            (error.response?.data?.message || error.message)
        );
      } finally {
        setIsLoading(false);
      }
    };

    const handleChange = (field) => (e) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-600">Edit data guru</p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nama Lengkap *
            </label>
            <Input
              placeholder="Masukkan nama lengkap guru"
              value={formData.full_name}
              onChange={handleChange("full_name")}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">NIP *</label>
            <Input
              placeholder="Masukkan NIP"
              value={formData.nip}
              onChange={handleChange("nip")}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Email (Opsional)
          </label>
          <Input
            type="email"
            placeholder="Masukkan email guru"
            value={formData.email}
            onChange={handleChange("email")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            No. Telepon (Opsional)
          </label>
          <Input
            placeholder="Masukkan nomor telepon"
            value={formData.phone}
            onChange={handleChange("phone")}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Update Data
              </>
            )}
          </Button>
        </div>
      </form>
    );
  };

  export default function Guru() {
    // State management
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pagination, setPagination] = useState({});

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalType, setModalType] = useState("");
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    // Debounced search
    const [searchTimeout, setSearchTimeout] = useState(null);

    // Load teachers data
    const loadTeachers = useCallback(
      async (page = 1, limit = 10, search = "") => {
        setLoading(true);
        try {
          const params = {
            page,
            limit,
            ...(search && { search }),
          };

          const response = await api.get("/api/teachers", { params });

          if (response.data) {
            setTeachers(response.data || []);
            console.log(JSON.parse(response.headers["x-pagination"]).total_items);
            if (response.headers["x-pagination"]) {
              setPagination(response.data.pagination);
              setTotalPages(
                JSON.parse(response.headers["x-pagination"]).total_pages
              );
              setTotalItems(
                JSON.parse(response.headers["x-pagination"]).total_items
              );
            }
          }
        } catch (error) {
          console.error("Error loading teachers:", error);
          setTeachers([]);
        } finally {
          setLoading(false);
        }
      },
      []
    );

    // Initial load
    useEffect(() => {
      loadTeachers(currentPage, itemsPerPage, searchTerm);
    }, [loadTeachers, currentPage, itemsPerPage]);

    // Debounced search effect
    useEffect(() => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      const timeout = setTimeout(() => {
        setCurrentPage(1);
        loadTeachers(1, itemsPerPage, searchTerm);
      }, 500);

      setSearchTimeout(timeout);

      return () => {
        if (timeout) clearTimeout(timeout);
      };
    }, [searchTerm, itemsPerPage, loadTeachers]);

    // Modal handlers
    const openModal = (type, title, teacher = null) => {
      setModalType(type);
      setModalTitle(title);
      setSelectedTeacher(teacher);
      setIsModalOpen(true);
    };

    const closeModal = () => {
      setIsModalOpen(false);
      setModalType("");
      setModalTitle("");
      setSelectedTeacher(null);
    };

    // API handlers
    const handleDownload = async ({ format, startDate, endDate }) => {
      try {
        const params = {
          format: format === "excel" ? "xlsx" : "csv",
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        };

        const response = await api.get("/api/teachers/export", {
          params,
          responseType: "blob",
        });

        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;

        const extension = format === "excel" ? "xlsx" : "csv";
        const fileName = `data-guru-${
          new Date().toISOString().split("T")[0]
        }.${extension}`;

        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download error:", error);
        throw new Error("Gagal mengunduh data");
      }
    };

    const handleUpload = async (file) => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "excel");

        const response = await api.post("/api/teachers/bulk", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data) {
          // Reload data after successful upload
          await loadTeachers(currentPage, itemsPerPage, searchTerm);

          return {
            success: response.data.success,
            message: response.data.message,
            data: response.data.data,
          };
        }
      } catch (error) {
        console.error("Upload error:", error);
        throw new Error(error.response?.data?.message || "Upload gagal");
      }
    };

    const handleAddTeacher = async (teacherData) => {
      console.log("Adding teacher:", teacherData);
      try {
        // Create user data structure for teacher
        const userData = {
          full_name: teacherData.full_name,
          id_role: 3, // Teacher role ID
          data: {
            nip: teacherData.nip,
            email: teacherData.email || "",
            phone: teacherData.phone || "",
            id_class: null, // Will be assigned later
          },
        };

        await api.post("/api/users", userData);

        // Reload data
        await loadTeachers(currentPage, itemsPerPage, searchTerm);
      } catch (error) {
        console.error("Add teacher error:", error);
        throw error;
      }
    };

    const handleUpdateTeacher = async (teacherId, teacherData) => {
      try {
        // Update teacher data
        const updateData = {
          nip: teacherData.nip,
        };

        // Update user data
        const teacher = teachers.find((t) => t.id === teacherId);
        if (teacher?.user?.id) {
          const userUpdateData = {
            full_name: teacherData.full_name,
            data: {
              ...teacher.user.data,
              nip: teacherData.nip,
              ...(teacherData.email && { email: teacherData.email }),
              ...(teacherData.phone && { phone: teacherData.phone }),
            },
          };

          await api.put(`/api/users/${teacher.user.id}`, userUpdateData);
        }

        await api.put(`/api/teachers/${teacherId}`, updateData);

        // Reload data
        await loadTeachers(currentPage, itemsPerPage, searchTerm);
      } catch (error) {
        console.error("Update teacher error:", error);
        throw error;
      }
    };

    const handleDeleteTeacher = async (teacherId) => {
      if (!confirm("Apakah Anda yakin ingin menghapus data guru ini?")) {
        return;
      }

      try {
        await api.delete(`/api/teachers/${teacherId}`);
        await loadTeachers(currentPage, itemsPerPage, searchTerm);
      } catch (error) {
        console.error("Delete teacher error:", error);
        alert(
          "Gagal menghapus guru: " +
            (error.response?.data?.message || error.message)
        );
      }
    };

    // Pagination handlers
    const handlePageChange = (page) => {
      setCurrentPage(page);
    };

    const handleItemsPerPageChange = (value) => {
      setItemsPerPage(Number(value));
      setCurrentPage(1);
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;

      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      return pages;
    };

    const renderModalContent = () => {
      switch (modalType) {
        case "download":
          return (
            <DownloadModal onClose={closeModal} onDownload={handleDownload} />
          );
        case "upload":
          return <UploadModal onClose={closeModal} onUpload={handleUpload} />;
        case "add":
          return (
            <AddTeacherModal onClose={closeModal} onAdd={handleAddTeacher} />
          );
        case "edit":
          return (
            <EditTeacherModal
              teacher={selectedTeacher}
              onClose={closeModal}
              onUpdate={handleUpdateTeacher}
            />
          );
        default:
          return null;
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Data Guru</h1>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => openModal("upload", "Upload Data Guru")}
            >
              <Upload className="h-4 w-4" />
              Upload
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => openModal("download", "Download Data Guru")}
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button
              className="gap-2"
              onClick={() => openModal("add", "Tambah Data Guru")}
            >
              <Plus className="h-4 w-4" />
              Tambah Data
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Show</span>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={handleItemsPerPageChange}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-gray-600">entries</span>
                </div>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari nama atau NIP..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                <span className="ml-2 text-gray-500">Loading...</span>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NO</TableHead>
                      <TableHead>NAMA</TableHead>
                      <TableHead>NIP</TableHead>
                      <TableHead>KELAS</TableHead>
                      <TableHead>AKSI</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teachers.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-8 text-gray-500"
                        >
                          {searchTerm
                            ? "Tidak ada data guru yang sesuai dengan pencarian"
                            : "Belum ada data guru"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      teachers.map((teacher, index) => (
                        <TableRow key={teacher.id}>
                          <TableCell>
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div>
                                <div className="font-medium">
                                  {teacher.user?.full_name || "N/A"}
                                </div>
                                {teacher.user?.data?.email && (
                                  <div className="text-xs text-gray-500">
                                    {teacher.user.data.email}
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {teacher.nip}
                          </TableCell>
                          <TableCell>
                            {teacher.class ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {teacher.class.grade}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">
                                Belum ditugaskan
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  openModal("edit", "Edit Data Guru", teacher)
                                }
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteTeacher(teacher.id)}
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

                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-600">
                    {totalItems > 0 ? (
                      <>
                        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                        {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                        {totalItems} entries
                      </>
                    ) : (
                      "No entries found"
                    )}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      {getPageNumbers().map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      ))}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={modalTitle}
          size="default"
        >
          {renderModalContent()}
        </Modal>
      </div>
    );
  }
