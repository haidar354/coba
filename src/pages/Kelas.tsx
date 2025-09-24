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
  BookOpen,
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { useClasses } from "@/hooks/useClasses";

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

// Class Form Modal
const ClassFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  departments,
  academicYears,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    grade: "",
    id_department: "",
    subgrade: "",
    id_academic_year: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        grade: initialData.grade || "",
        id_department: initialData.id_department?.toString() || "",
        subgrade: initialData.subgrade || "",
        id_academic_year: initialData.id_academic_year?.toString() || "",
      });
    } else {
      setFormData({
        grade: "",
        id_department: "",
        subgrade: "",
        id_academic_year: "",
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.grade.trim()) {
      newErrors.grade = "Tingkat kelas harus diisi";
    }

    if (!formData.id_department) {
      newErrors.id_department = "Jurusan harus dipilih";
    }

    if (!formData.id_academic_year) {
      newErrors.id_academic_year = "Tahun ajaran harus dipilih";
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
            {initialData ? "Edit Kelas" : "Tambah Kelas Baru"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Ubah informasi kelas yang sudah ada"
              : "Masukkan informasi untuk kelas baru"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Tingkat Kelas *
              </label>
              <Input
                placeholder="10, 11, 12"
                value={formData.grade}
                onChange={(e) => handleChange("grade", e.target.value)}
                className={errors.grade ? "border-red-500" : ""}
              />
              {errors.grade && (
                <p className="text-red-500 text-xs mt-1">{errors.grade}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Jurusan *
              </label>
              <Select
                value={formData.id_department}
                onValueChange={(value) => handleChange("id_department", value)}
              >
                <SelectTrigger
                  className={errors.id_department ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Pilih jurusan" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.id_department && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.id_department}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Sub Kelas
              </label>
              <Input
                placeholder="A, B, C (opsional)"
                value={formData.subgrade}
                onChange={(e) => handleChange("subgrade", e.target.value)}
              />
              <p className="text-gray-500 text-xs mt-1">
                Kosongkan jika tidak ada sub kelas
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Tahun Ajaran *
              </label>
              <Select
                value={formData.id_academic_year}
                onValueChange={(value) =>
                  handleChange("id_academic_year", value)
                }
              >
                <SelectTrigger
                  className={errors.id_academic_year ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Pilih tahun" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year) => (
                    <SelectItem key={year.id} value={year.id.toString()}>
                      {year.year} {year.is_active && "(Aktif)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.id_academic_year && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.id_academic_year}
                </p>
              )}
            </div>
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
                      Update Kelas
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Kelas
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

// Class Detail Modal
const ClassDetailModal = ({ isOpen, onClose, kelas }) => {
  if (!kelas) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Detail Kelas</DialogTitle>
          <DialogDescription>Informasi lengkap tentang kelas</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Tingkat Kelas
              </label>
              <p className="text-lg font-semibold">Kelas {kelas.grade}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Sub Kelas
              </label>
              <p className="text-lg">
                {kelas.subgrade ? (
                  <Badge variant="secondary">{kelas.subgrade}</Badge>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Jurusan</label>
            <p className="text-lg">
              <Badge className="bg-blue-100 text-blue-800">
                {kelas.department?.name || "N/A"}
              </Badge>
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">
              Tahun Ajaran
            </label>
            <p className="text-lg">
              <Badge className="bg-purple-100 text-purple-800">
                {kelas.academic_year?.year || "N/A"}
              </Badge>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Dibuat
              </label>
              <p className="text-sm">
                {kelas.created_at
                  ? new Date(kelas.created_at).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "-"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Diupdate
              </label>
              <p className="text-sm">
                {kelas.updated_at
                  ? new Date(kelas.updated_at).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
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
export default function Kelas() {
  const {
    classes,
    departments,
    academicYears,
    loading,
    error,
    pagination,
    loadClasses,
    loadDepartments,
    loadAcademicYears,
    createClass,
    updateClass,
    deleteClass,
    setError,
  } = useClasses();

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("all");

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Search timeout
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Load initial data
  useEffect(() => {
    loadDepartments();
    loadAcademicYears();
  }, [loadDepartments, loadAcademicYears]);

  // Load classes when filters change
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      loadClasses({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        grade: selectedGrade === "all" ? "" : selectedGrade,
        departmentId: selectedDepartment === "all" ? "" : selectedDepartment,
        academicYearId:
          selectedAcademicYear === "all" ? "" : selectedAcademicYear,
      });
    }, 500);

    setSearchTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [
    currentPage,
    itemsPerPage,
    searchTerm,
    selectedGrade,
    selectedDepartment,
    selectedAcademicYear,
    loadClasses,
  ]);

  // Handle form submission
  const handleFormSubmit = async (formData) => {
    setModalLoading(true);
    try {
      if (selectedClass) {
        await updateClass(selectedClass.id, formData);
      } else {
        await createClass(formData);
      }

      // Reload current page
      await loadClasses({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        grade: selectedGrade === "all" ? "" : selectedGrade,
        departmentId: selectedDepartment === "all" ? "" : selectedDepartment,
        academicYearId:
          selectedAcademicYear === "all" ? "" : selectedAcademicYear,
      });

      setIsFormModalOpen(false);
      setSelectedClass(null);
    } catch (error) {
      console.error("Form submission error:", error);
      alert(error.message || "Terjadi kesalahan");
    } finally {
      setModalLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (kelas) => {
    if (
      !window.confirm(
        `Apakah Anda yakin ingin menghapus kelas ${kelas.grade}${
          kelas.subgrade ? " " + kelas.subgrade : ""
        } - ${kelas.department?.name || ""}?`
      )
    ) {
      return;
    }

    try {
      await deleteClass(kelas.id);

      // Reload current page
      await loadClasses({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        grade: selectedGrade === "all" ? "" : selectedGrade,
        departmentId: selectedDepartment === "all" ? "" : selectedDepartment,
        academicYearId:
          selectedAcademicYear === "all" ? "" : selectedAcademicYear,
      });
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.message || "Gagal menghapus kelas");
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
    setSelectedGrade("all");
    setSelectedDepartment("all");
    setSelectedAcademicYear("all");
    setCurrentPage(1);
  };

  // Refresh data
  const refreshData = () => {
    loadClasses({
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm,
      grade: selectedGrade === "all" ? "" : selectedGrade,
      departmentId: selectedDepartment === "all" ? "" : selectedDepartment,
      academicYearId:
        selectedAcademicYear === "all" ? "" : selectedAcademicYear,
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
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Kelas</h1>
          <p className="text-gray-600 mt-1">
            Kelola data kelas sekolah dengan mudah
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
              setSelectedClass(null);
              setIsFormModalOpen(true);
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Tambah Kelas
          </Button>
        </div>
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
            Filter & Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari kelas, jurusan..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Tingkat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tingkat</SelectItem>
                <SelectItem value="10">Kelas 10</SelectItem>
                <SelectItem value="11">Kelas 11</SelectItem>
                <SelectItem value="12">Kelas 12</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger>
                <SelectValue placeholder="Semua Jurusan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jurusan</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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
            <CardTitle>Daftar Kelas</CardTitle>

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
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-600">entries</span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500 mx-auto mb-2" />
                <p className="text-gray-500">Memuat data kelas...</p>
              </div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">No</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Jurusan</TableHead>
                    <TableHead>Sub Kelas</TableHead>
                    <TableHead>Tahun Ajaran</TableHead>
                    <TableHead>Tanggal Dibuat</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-12 text-gray-500"
                      >
                        <div className="text-center">
                          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-lg font-medium">
                            {searchTerm ||
                            selectedGrade !== "all" ||
                            selectedDepartment !== "all"
                              ? "Tidak ada kelas yang sesuai dengan filter"
                              : "Belum ada data kelas"}
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            {searchTerm ||
                            selectedGrade !== "all" ||
                            selectedDepartment !== "all"
                              ? "Coba ubah filter pencarian"
                              : "Tambahkan kelas baru untuk memulai"}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    classes.map((kelas, index) => (
                      <TableRow key={kelas.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">Kelas {kelas.grade}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-800">
                            {kelas.department?.name || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {kelas.subgrade ? (
                            <Badge variant="secondary">{kelas.subgrade}</Badge>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-purple-100 text-purple-800">
                            {kelas.academic_year?.year || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {kelas.created_at
                            ? new Date(kelas.created_at).toLocaleDateString(
                                "id-ID"
                              )
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedClass(kelas);
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
                                setSelectedClass(kelas);
                                setIsFormModalOpen(true);
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(kelas)}
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
      <ClassFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedClass(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedClass}
        departments={departments}
        academicYears={academicYears}
        loading={modalLoading}
      />

      {/* Detail Modal */}
      <ClassDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedClass(null);
        }}
        kelas={selectedClass}
      />
    </div>
  );
}
