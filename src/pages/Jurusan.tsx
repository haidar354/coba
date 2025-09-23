import React, { useState, useEffect } from "react";
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
  Eye,
  Filter,
  RefreshCw,
  Building,
  Users,
  GraduationCap,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";

import { useDepartment } from "@/hooks/useDepartment";

// Statistics Card Component
const StatsCard = ({ title, value, icon: Icon, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
  };

  return (
    <Card className={`border ${colorClasses[color]}`}>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <Icon className="h-8 w-8 opacity-60" />
        </div>
      </CardContent>
    </Card>
  );
};

// Department Form Modal
const DepartmentFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    short_name: "",
    code: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    short_name: "",
    code: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        short_name: initialData.short_name || "",
        code: initialData.code || "",
      });
    } else {
      setFormData({
        name: "",
        short_name: "",
        code: "",
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors = {
      name: "",
      short_name: "",
      code: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Nama jurusan harus diisi";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Nama jurusan minimal 3 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Jurusan" : "Tambah Jurusan Baru"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Ubah informasi jurusan yang sudah ada"
              : "Masukkan informasi untuk jurusan baru"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nama Jurusan *
            </label>
            <Input
              placeholder="Contoh: Teknik Informatika, Akuntansi"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Nama Akronim *
            </label>
            <Input
              placeholder="Contoh: Teknik Informatika, Akuntansi"
              value={formData.short_name}
              onChange={(e) => handleChange("short_name", e.target.value)}
              className={errors.short_name ? "border-red-500" : ""}
            />
            {errors.short_name && (
              <p className="text-red-500 text-xs mt-1">{errors.short_name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Kode *</label>
            <Input
              placeholder="Contoh: Teknik Informatika, Akuntansi"
              value={formData.code}
              onChange={(e) => handleChange("code", e.target.value)}
              className={errors.code ? "border-red-500" : ""}
            />
            {errors.code && (
              <p className="text-red-500 text-xs mt-1">{errors.code}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {initialData ? "Mengupdate..." : "Menyimpan..."}
                </>
              ) : (
                <>
                  {initialData ? (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Update Jurusan
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Jurusan
                    </>
                  )}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Department Detail Modal
const DepartmentDetailModal = ({ isOpen, onClose, department }) => {
  if (!department) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Detail Jurusan</DialogTitle>
          <DialogDescription>
            Informasi lengkap tentang jurusan
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Nama Jurusan
            </label>
            <p className="text-lg font-semibold">{department.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Akronim</label>
            <p className="text-lg font-semibold">{department.short_name}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Kode</label>
            <p className="text-sm">
              {department.code || (
                <span className="text-gray-400">Tidak ada kode</span>
              )}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Dibuat
              </label>
              <p className="text-sm">
                {department.created_at
                  ? new Date(department.created_at).toLocaleDateString(
                      "id-ID",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )
                  : "-"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Diupdate
              </label>
              <p className="text-sm">
                {department.updated_at
                  ? new Date(department.updated_at).toLocaleDateString(
                      "id-ID",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )
                  : "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Tutup</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Main Component
export default function Department() {
  const {
    departments,
    loading,
    error,
    pagination,
    loadDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    setError,
  } = useDepartment();

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Search timeout
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Load departments when filters change
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      loadDepartments({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
      });
    }, 500);

    setSearchTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [currentPage, itemsPerPage, searchTerm, loadDepartments]);

  // Handle form submission
  const handleFormSubmit = async (formData) => {
    setModalLoading(true);
    try {
      if (selectedDepartment) {
        await updateDepartment(selectedDepartment.id, formData);
      } else {
        await createDepartment(formData);
      }

      // Reload current page
      await loadDepartments({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
      });

      setIsFormModalOpen(false);
      setSelectedDepartment(null);
    } catch (error) {
      console.error("Form submission error:", error);
      alert(error.message || "Terjadi kesalahan");
    } finally {
      setModalLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (department) => {
    if (
      !window.confirm(
        `Apakah Anda yakin ingin menghapus jurusan "${department.name}"?`
      )
    ) {
      return;
    }

    try {
      await deleteDepartment(department.id);

      // Reload current page
      await loadDepartments({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
      });
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.message || "Gagal menghapus jurusan");
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

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Refresh data
  const refreshData = () => {
    loadDepartments({
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm,
    });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const totalPages = pagination.total_pages;

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

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Manajemen Jurusan
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola data jurusan sekolah dengan mudah
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={refreshData}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            onClick={() => {
              setSelectedDepartment(null);
              setIsFormModalOpen(true);
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Tambah Jurusan
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Jurusan"
          value={pagination.total_items || 0}
          icon={Building}
          color="blue"
        />
        <StatsCard
          title="Halaman Saat Ini"
          value={currentPage}
          icon={FileSpreadsheet}
          color="green"
        />
        <StatsCard
          title="Total Halaman"
          value={pagination.total_pages || 1}
          icon={Users}
          color="purple"
        />
        <StatsCard
          title="Per Halaman"
          value={itemsPerPage}
          icon={GraduationCap}
          color="orange"
        />
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
            <Button
              variant="link"
              className="p-0 ml-2 text-red-800"
              onClick={() => setError(null)}
            >
              Tutup
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Pencarian Jurusan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari nama jurusan..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <Button
              variant="outline"
              onClick={clearFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Daftar Jurusan</CardTitle>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-600">entries</span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500 mx-auto mb-2" />
                <p className="text-gray-500">Memuat data jurusan...</p>
              </div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">No</TableHead>
                    <TableHead>Nama Jurusan</TableHead>
                    <TableHead>Akronim</TableHead>
                    <TableHead>Kode</TableHead>
                    <TableHead>Tanggal Dibuat</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-12 text-gray-500"
                      >
                        <div className="text-center">
                          <Building className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-lg font-medium">
                            {searchTerm
                              ? "Tidak ada jurusan yang sesuai dengan pencarian"
                              : "Belum ada data jurusan"}
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            {searchTerm
                              ? "Coba ubah kata kunci pencarian"
                              : "Tambahkan jurusan baru untuk memulai"}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    departments.map((department, index) => (
                      <TableRow
                        key={department.id}
                        className="hover:bg-gray-50"
                      >
                        <TableCell className="font-medium">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{department.name}</div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">
                            {department.short_name || (
                              <span className="text-gray-400 text-sm">
                                Tidak ada Akronim
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">
                            {department.code || (
                              <span className="text-gray-400 text-sm">
                                Tidak ada Kode
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {department.created_at
                            ? new Date(
                                department.created_at
                              ).toLocaleDateString("id-ID")
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedDepartment(department);
                                setIsDetailModalOpen(true);
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedDepartment(department);
                                setIsFormModalOpen(true);
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(department)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
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

              {/* Pagination */}
              {pagination.total_pages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-600">
                    Menampilkan {(currentPage - 1) * itemsPerPage + 1} sampai{" "}
                    {Math.min(
                      currentPage * itemsPerPage,
                      pagination.total_items
                    )}{" "}
                    dari {pagination.total_items} data
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <ChevronLeft className="h-4 w-4 -ml-2" />
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
                      disabled={currentPage === pagination.total_pages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.total_pages)}
                      disabled={currentPage === pagination.total_pages}
                    >
                      <ChevronRight className="h-4 w-4" />
                      <ChevronRight className="h-4 w-4 -ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Form Modal */}
      <DepartmentFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedDepartment(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedDepartment}
        loading={modalLoading}
      />

      {/* Detail Modal */}
      <DepartmentDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedDepartment(null);
        }}
        department={selectedDepartment}
      />
    </div>
  );
}
