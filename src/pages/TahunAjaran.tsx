import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Edit,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Loader2,
  CheckCircle,
  AlertCircle,
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
import api from "@/utils/axios";

// Interface untuk data tahun ajaran
interface AcademicYear {
  id: number;
  year: string; // e.g., "2025/2026"
  start_date: string; // e.g., "2025-01-01"
  end_date: string; // e.g., "2026-12-31"
  is_active: boolean;
}

// Interface untuk props Modal
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "default" | "large";
}

// Interface untuk props Alert
interface AlertProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

// Modal Component
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "default",
}) => {
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
const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
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

// Add Academic Year Modal Content
const AddAcademicYearModal: React.FC<AddAcademicYearModalProps> = ({
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState({
    start_year: "",
    end_year: "",
    is_active: false,
    year: "",
    start_date: "",
    end_date: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Update year automatically and validate format
  useEffect(() => {
    if (formData.start_year && formData.end_year) {
      const startYear = parseInt(formData.start_year, 10);
      const endYear = parseInt(formData.end_year, 10);

      // Validate that both years are four-digit numbers
      if (
        !isNaN(startYear) &&
        !isNaN(endYear) &&
        formData.start_year.length === 4 &&
        formData.end_year.length === 4 &&
        endYear === startYear + 1 // Optional: Ensure end_year is start_year + 1
      ) {
        setFormData((prev) => ({
          ...prev,
          year: `${formData.start_year}/${formData.end_year}`,
        }));
        setErrorMessage(null);
      } else {
        setFormData((prev) => ({ ...prev, year: "" }));
        setErrorMessage(
          "Tahun harus dalam format YYYY/YYYY (contoh: 2024/2025)"
        );
      }
    } else {
      setFormData((prev) => ({ ...prev, year: "" }));
    }
  }, [formData.start_year, formData.end_year]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const startYear = parseInt(formData.start_year, 10);
    const endYear = parseInt(formData.end_year, 10);
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);

    if (
      !formData.start_year ||
      !formData.end_year ||
      !formData.start_date ||
      !formData.end_date ||
      !formData.year
    ) {
      setErrorMessage(
        "Semua kolom wajib diisi dan tahun harus dalam format YYYY/YYYY!"
      );
      return;
    }

    if (endYear !== startYear + 1) {
      setErrorMessage("Tahun akhir harus satu tahun setelah tahun mulai!");
      return;
    }

    if (endDate <= startDate) {
      setErrorMessage("Tanggal akhir harus setelah tanggal mulai!");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      await onAdd({
        year: formData.year,
        start_date: formData.start_date,
        end_date: formData.end_date,
        is_active: formData.is_active,
      });
      onClose();
    } catch (error) {
      console.error("Add academic year error:", error);
      setErrorMessage(
        "Gagal menambahkan tahun ajaran: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleToggleActive = () => {
    setFormData((prev) => ({ ...prev, is_active: !prev.is_active }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <Alert
          type="error"
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}
      <p className="text-sm text-gray-600">
        Silakan isi form untuk menambah data tahun ajaran baru
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Tahun Mulai *
          </label>
          <Input
            type="number"
            placeholder="Masukkan tahun mulai (contoh: 2025)"
            value={formData.start_year}
            onChange={handleChange("start_year")}
            required
            min="2000"
            max="2099"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Tahun Akhir *
          </label>
          <Input
            type="number"
            placeholder="Masukkan tahun akhir (contoh: 2026)"
            value={formData.end_year}
            onChange={handleChange("end_year")}
            required
            min="2000"
            max="2099"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Tahun Ajaran (otomatis) *
        </label>
        <Input
          type="text"
          value={formData.year}
          readOnly
          placeholder="Contoh: 2025/2026"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Tanggal Mulai *
        </label>
        <Input
          type="date"
          placeholder="Masukkan tanggal mulai (contoh: 2025-01-01)"
          value={formData.start_date}
          onChange={handleChange("start_date")}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">
          Tanggal Akhir *
        </label>
        <Input
          type="date"
          placeholder="Masukkan tanggal akhir (contoh: 2026-12-31)"
          value={formData.end_date}
          onChange={handleChange("end_date")}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Status Aktif</label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={handleToggleActive}
            className="h-4 w-4"
          />
          <span>Aktif</span>
        </label>
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

// Edit Academic Year Modal Content
interface EditAcademicYearModalProps {
  academicYear: AcademicYear;
  onClose: () => void;
  onUpdate: (
    id: number,
    data: { start_year: number; end_year: number; is_active: boolean }
  ) => Promise<void>;
}

const EditAcademicYearModal: React.FC<EditAcademicYearModalProps> = ({
  academicYear,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    year: academicYear.year,
    start_date: academicYear.start_date,
    end_date: academicYear.end_date,
    is_active: academicYear.is_active,
    start_year: academicYear.year.split("/")[0] || "", // Extract start_year from year
    end_year: academicYear.year.split("/")[1] || "", // Extract end_year from year
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Update year automatically and validate format
  useEffect(() => {
    if (formData.start_year && formData.end_year) {
      const startYear = parseInt(formData.start_year, 10);
      const endYear = parseInt(formData.end_year, 10);

      if (
        !isNaN(startYear) &&
        !isNaN(endYear) &&
        formData.start_year.length === 4 &&
        formData.end_year.length === 4 &&
        endYear === startYear + 1
      ) {
        setFormData((prev) => ({
          ...prev,
          year: `${formData.start_year}/${formData.end_year}`,
        }));
        setErrorMessage(null);
      } else {
        setFormData((prev) => ({ ...prev, year: "" }));
        setErrorMessage(
          "Tahun harus dalam format YYYY/YYYY (contoh: 2024/2025)"
        );
      }
    } else {
      setFormData((prev) => ({ ...prev, year: "" }));
    }
  }, [formData.start_year, formData.end_year]);

  // Fungsi untuk memastikan format YYYY-MM-DD
  const formatDate = (dateInput: string | Date): string => {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date input");
    }
    return date.toISOString().split("T")[0]; // hasil: YYYY-MM-DD
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const startDate = formatDate(formData.start_date);
      const endDate = formatDate(formData.end_date);

      await onUpdate(academicYear.id, {
        year: formData.year,
        start_date: startDate,
        end_date: endDate,
        is_active: formData.is_active,
      });
      onClose();
    } catch (err) {
      setErrorMessage("Tanggal tidak valid, gunakan format YYYY-MM-DD!");
    }
  };

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleToggleActive = () => {
    setFormData((prev) => ({ ...prev, is_active: !prev.is_active }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <Alert
          type="error"
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}
      <p className="text-sm text-gray-600">Edit data tahun ajaran</p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Tahun Mulai *
          </label>
          <Input
            type="number"
            placeholder="Masukkan tahun mulai (contoh: 2025)"
            value={formData.start_year}
            onChange={handleChange("start_year")}
            required
            min="2000"
            max="2099"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Tahun Akhir *
          </label>
          <Input
            type="number"
            placeholder="Masukkan tahun akhir (contoh: 2026)"
            value={formData.end_year}
            onChange={handleChange("end_year")}
            required
            min="2000"
            max="2099"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Tahun Ajaran (otomatis) *
        </label>
        <Input
          type="text"
          value={formData.year}
          readOnly
          placeholder="Contoh: 2025/2026"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Tanggal Mulai *
        </label>
        <Input
          type="date"
          placeholder="Masukkan tanggal mulai (contoh: 2025-01-01)"
          value={new Date(formData.start_date).toISOString().split("T")[0]}
          onChange={handleChange("start_date")}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">
          Tanggal Akhir *
        </label>
        <Input
          type="date"
          placeholder="Masukkan tanggal akhir (contoh: 2026-12-31)"
          value={new Date(formData.end_date).toISOString().split("T")[0]}
          onChange={handleChange("end_date")}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Status Aktif</label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={handleToggleActive}
            className="h-4 w-4"
          />
          <span>Aktif</span>
        </label>
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

export default function TahunAjaran() {
  // State management
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalType, setModalType] = useState<"add" | "edit" | "">("");
  const [selectedAcademicYear, setSelectedAcademicYear] =
    useState<AcademicYear | null>(null);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  // Load academic years data
  const loadAcademicYears = useCallback(
    async (page: number = 1, limit: number = 10, search: string = "") => {
      setLoading(true);
      try {
        const params = {
          page,
          limit,
          ...(search && { search }),
        };

        const response = await api.get("/api/academic/years", { params });

        if (response.data) {
          // Map response data if needed
          const mappedData = response.data.map((item: any) => ({
            id: item.id,
            year: item.year, // Ensure year is in YYYY/YYYY format
            start_date: item.start_date,
            end_date: item.end_date,
            is_active: item.is_active,
          }));
          setAcademicYears(mappedData);
          if (response.headers["x-pagination"]) {
            const pagination = JSON.parse(response.headers["x-pagination"]);
            setTotalPages(pagination.total_pages);
            setTotalItems(pagination.total_items);
          }
        }
      } catch (error) {
        console.error("Error loading academic years:", error);
        setAcademicYears([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Initial load
  useEffect(() => {
    loadAcademicYears(currentPage, itemsPerPage, searchTerm);
  }, [loadAcademicYears, currentPage, itemsPerPage]);

  // Debounced search effect
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      setCurrentPage(1);
      loadAcademicYears(1, itemsPerPage, searchTerm);
    }, 500);

    setSearchTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [searchTerm, itemsPerPage, loadAcademicYears]);

  // Modal handlers
  const openModal = (
    type: "add" | "edit",
    title: string,
    academicYear: AcademicYear | null = null
  ) => {
    setModalType(type);
    setModalTitle(title);
    setSelectedAcademicYear(academicYear);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType("");
    setModalTitle("");
    setSelectedAcademicYear(null);
  };

  // API handlers
  const handleAddAcademicYear = async (data: {
    year: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
  }) => {
    try {
      await api.post("/api/academic/years", data);
      await loadAcademicYears(currentPage, itemsPerPage, searchTerm);
    } catch (error) {
      console.error("Add academic year error:", error);
      throw error;
    }
  };

  const handleUpdateAcademicYear = async (
    id: number,
    data: {
      year: string;
      start_date: string;
      end_date: string;
      is_active: boolean;
    }
  ) => {
    try {
      await api.put(`/api/academic/years/${id}`, data);
      await loadAcademicYears(currentPage, itemsPerPage, searchTerm);
    } catch (error) {
      console.error("Update academic year error:", error);
      throw error;
    }
  };

  const handleDeleteAcademicYear = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data tahun ajaran ini?")) {
      return;
    }

    try {
      await api.delete(`/api/academic/years/${id}`);
      await loadAcademicYears(currentPage, itemsPerPage, searchTerm);
    } catch (error) {
      console.error("Delete academic year error:", error);
      alert(
        "Gagal menghapus tahun ajaran: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: number[] = [];
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
      case "add":
        return (
          <AddAcademicYearModal
            onClose={closeModal}
            onAdd={handleAddAcademicYear}
          />
        );
      case "edit":
        return (
          selectedAcademicYear && (
            <EditAcademicYearModal
              academicYear={selectedAcademicYear}
              onClose={closeModal}
              onUpdate={handleUpdateAcademicYear}
            />
          )
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Data Tahun Ajaran</h1>
        <Button
          className="gap-2"
          onClick={() => openModal("add", "Tambah Data Tahun Ajaran")}
        >
          <Plus className="h-4 w-4" />
          Tambah Data
        </Button>
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
                placeholder="Cari tahun ajaran..."
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
                    <TableHead>TAHUN AJARAN</TableHead>
                    <TableHead>STATUS</TableHead>
                    <TableHead>AKSI</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {academicYears.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-8 text-gray-500"
                      >
                        {searchTerm
                          ? "Tidak ada data tahun ajaran yang sesuai dengan pencarian"
                          : "Belum ada data tahun ajaran"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    academicYears.map((year, index) => (
                      <TableRow key={year.id}>
                        <TableCell>
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </TableCell>
                        <TableCell>{`${year.year}`}</TableCell>
                        <TableCell>
                          {year.is_active ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Aktif
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">
                              Tidak Aktif
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
                                openModal(
                                  "edit",
                                  "Edit Data Tahun Ajaran",
                                  year
                                )
                              }
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteAcademicYear(year.id)}
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
