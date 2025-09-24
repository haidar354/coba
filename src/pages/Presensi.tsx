// Upload Modal for Bulk Attendance
const UploadModal = ({ onClose, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Pilih file terlebih dahulu");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("folder_name", "data_presensi/siswa");

      const response = await api.post("/api/upload/excel", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (response.status === 200) {
        const responseada = await api.post("/api/attendance/bulk", {
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
    link.href = "/tu/file_template/Template%20Presensi%20Siswa%20-%20Harian.xlsx";
    link.download = "template_presensi_siswa.xlsx";
    link.target = "_blank";

    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Upload file data presensi dalam format Excel atau CSV
      </p>

      <div>
        <label className="text-sm font-medium">Pilih File Data Presensi</label>
        <Input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileSelect}
          className="mt-2"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Format yang didukung: Excel (.xlsx, .xls), CSV (.csv)
        </p>
        {selectedFile && (
          <p className="text-sm text-green-600 mt-2">
            File dipilih: {selectedFile.name}
          </p>
        )}
      </div>

      <div className="p-4 border rounded-lg bg-blue-50">
        <h4 className="font-medium text-sm mb-2">Format Template Excel:</h4>
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download size={16} />
          Download Template Excel
        </button>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Batal
        </Button>
        <Button onClick={handleUpload} disabled={isLoading}>
          {isLoading ? (
            <Loader className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Upload className="h-4 w-4 mr-2" />
          )}
          Upload
        </Button>
      </div>
    </div>
  );
};

// SelectWithSearch Component for dropdowns
const SelectWithSearch = ({
  placeholder,
  value,
  onSelect,
  fetchOptions,
  displayField,
  valueField = "id",
  searchField,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (value && options.length > 0) {
      const found = options.find((opt) => opt[valueField] == value);
      setSelectedOption(found);
    } else {
      setSelectedOption(null);
    }
  }, [value, options, valueField]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen && searchTerm === "") return;

      setLoading(true);
      try {
        const data = await fetchOptions(searchTerm);
        setOptions(data);
      } catch (error) {
        console.error("Error fetching options:", error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchData, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, isOpen, fetchOptions]);

  const handleSelect = (option) => {
    setSelectedOption(option);
    onSelect(option[valueField], option);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleOpen = async () => {
    if (disabled) return;
    setIsOpen(true);
    if (options.length === 0) {
      setLoading(true);
      try {
        const data = await fetchOptions("");
        setOptions(data);
      } catch (error) {
        console.error("Error fetching options:", error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        disabled={disabled}
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span
          className={
            selectedOption ? "text-foreground" : "text-muted-foreground"
          }
        >
          {selectedOption ? selectedOption[displayField] : placeholder}
        </span>
        <svg
          className="h-4 w-4 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 10l5 5 5-5"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-hidden">
          <div className="p-2">
            <Input
              placeholder={`Cari ${placeholder.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8"
            />
          </div>

          <div className="max-h-48 overflow-auto">
            {loading ? (
              <div className="p-2 text-center">
                <Loader className="h-4 w-4 animate-spin mx-auto" />
              </div>
            ) : options.length > 0 ? (
              options.map((option) => (
                <button
                  key={option[valueField]}
                  onClick={() => handleSelect(option)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:bg-accent block"
                >
                  <div>
                    <div className="font-medium">{option[displayField]}</div>
                    {searchField && option[searchField] && (
                      <div className="text-xs text-muted-foreground">
                        {option[searchField]}
                      </div>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="p-2 text-center text-sm text-muted-foreground">
                {searchTerm ? "Tidak ada hasil ditemukan" : "Tidak ada data"}
              </div>
            )}
          </div>

          <div className="p-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => setIsOpen(false)}
            >
              Tutup
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Manual Add Attendance Modal
const AddAttendanceModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id_user: "",
    id_class: "",
    id_role: 4, // Default to student
    date: new Date().toISOString().split("T")[0],
    status: ["hadir"],
    information: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch users for dropdown
  const fetchUsers = async (search = "") => {
    try {
      const params = {
        limit: 50,
        include_role: true,
        ...(search && { search }),
      };
      const response = await api.get("/api/users", { params });
      return response.data || [];
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  // Fetch classes for dropdown
  const fetchClasses = async (search = "") => {
    try {
      const params = {
        limit: 50,
        include_relations: true,
        ...(search && { search }),
      };
      const response = await api.get("/api/classes", { params });

      const classes = response.data || [];
      return classes.map((cls) => ({
        ...cls,
        class_display: `${cls.grade} ${cls.department?.name || ""} ${
          cls.subgrade || ""
        }`.trim(),
      }));
    } catch (error) {
      console.error("Error fetching classes:", error);
      return [];
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStatusChange = (status) => {
    const statusArray = Array.isArray(formData.status) ? formData.status : [];

    if (statusArray.includes(status)) {
      // Remove status if already selected
      setFormData((prev) => ({
        ...prev,
        status: statusArray.filter((s) => s !== status),
      }));
    } else {
      // Add status if not selected
      setFormData((prev) => ({
        ...prev,
        status: [...statusArray, status],
      }));
    }
  };

  const handleSave = async () => {
    if (
      !formData.id_user ||
      !formData.id_class ||
      !formData.date ||
      formData.status.length === 0
    ) {
      alert("Mohon lengkapi semua field yang wajib diisi!");
      return;
    }
    formData.time = formData.date.toString().split("T")[1] || "00:00:00";
    formData.date = formData.date.toString().split("T")[0] || "00:00:00";
    try {
      setIsLoading(true);

      const response = await api.post("/api/attendance", formData);

      if (response.status === 200 || response.status === 201) {
        alert("Data presensi berhasil ditambahkan!");
        onSave && onSave(response.data);
        onClose();
      }
    } catch (error) {
      console.error("Save attendance error:", error);
      alert(
        "Gagal menyimpan data presensi: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const statusOptions = [
    { value: "hadir", label: "Hadir", color: "bg-green-100 text-green-800" },
    { value: "sakit", label: "Sakit", color: "bg-yellow-100 text-yellow-800" },
    { value: "izin", label: "Izin", color: "bg-blue-100 text-blue-800" },
    { value: "alpha", label: "Alpha", color: "bg-red-100 text-red-800" },
    {
      value: "terlambat",
      label: "Terlambat",
      color: "bg-orange-100 text-orange-800",
    },
    { value: "cuti", label: "Cuti", color: "bg-purple-100 text-purple-800" },
    { value: "dinas", label: "Dinas", color: "bg-gray-100 text-gray-800" },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Silakan isi form untuk menambah data presensi baru
      </p>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">User *</label>
          <SelectWithSearch
            placeholder="Pilih User"
            value={formData.id_user}
            onSelect={(value) => handleInputChange("id_user", value)}
            fetchOptions={fetchUsers}
            displayField="full_name"
            searchField="role.name"
            valueField="id"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Kelas *</label>
          <SelectWithSearch
            placeholder="Pilih Kelas"
            value={formData.id_class}
            onSelect={(value) => handleInputChange("id_class", value)}
            fetchOptions={fetchClasses}
            displayField="class_display"
            searchField="academic_year.year"
            valueField="id"
          />
        </div>

        {/* <div>
          <label className="block text-sm font-medium mb-2">Tanggal *</label>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange("date", e.target.value)}
          />
        </div> */}

        <div>
          <label className="block text-sm font-medium mb-2">Waktu Mulai</label>
          <Input
            type="datetime-local"
            value={formData.date}
            onChange={(e) => handleInputChange("date", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Status Presensi *
          </label>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleStatusChange(option.value)}
                className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium border transition-colors ${
                  formData.status.includes(option.value)
                    ? `${option.color} border-current`
                    : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {option.label}
                {formData.status.includes(option.value) && (
                  <X className="h-3 w-3 ml-1" />
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Klik untuk memilih/menghapus status. Bisa memilih multiple status.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Keterangan</label>
          <Input
            placeholder="Keterangan tambahan (opsional)"
            value={formData.information}
            onChange={(e) => handleInputChange("information", e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Batal
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? (
            <Loader className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          Tambah Presensi
        </Button>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from "react";
import {
  Search,
  Edit,
  Plus,
  Download,
  Upload,
  X,
  Loader,
  ChevronLeft,
  ChevronRight,
  Eye,
  Calendar,
} from "lucide-react";
import api from "@/utils/axios";
import * as XLSX from "xlsx";

// UI Components (keeping the same components from original)
const Input = ({ className = "", ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${className}`}
    {...props}
  />
);

const Button = ({
  children,
  className = "",
  variant = "default",
  size = "default",
  disabled = false,
  onClick,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}
  >
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);

const Select = ({
  children,
  value,
  onValueChange,
  defaultValue,
  placeholder = "Select...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(
    defaultValue || value || ""
  );
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleSelect = (val, display) => {
    setSelectedValue(val);
    setDisplayValue(display);
    onValueChange && onValueChange(val);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <span>{displayValue || selectedValue || placeholder}</span>
        <svg
          className="h-4 w-4 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 10l5 5 5-5"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-auto">
          {React.Children.map(children, (child) =>
            React.cloneElement(child, { onSelect: handleSelect })
          )}
        </div>
      )}
    </div>
  );
};

const SelectItem = ({ children, value, onSelect }) => (
  <button
    onClick={() => onSelect(value, children)}
    className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:bg-accent"
  >
    {children}
  </button>
);

const Table = ({ children, className = "" }) => (
  <div className="relative overflow-hidden">
    <div className="overflow-x-auto">
      <table className={`w-full caption-bottom text-sm ${className}`}>
        {children}
      </table>
    </div>
  </div>
);

const TableHeader = ({ children }) => (
  <thead className="[&_tr]:border-b">{children}</thead>
);
const TableBody = ({ children }) => (
  <tbody className="[&_tr:last-child]:border-0">{children}</tbody>
);
const TableRow = ({ children, className = "" }) => (
  <tr
    className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${className}`}
  >
    {children}
  </tr>
);
const TableHead = ({ children, className = "" }) => (
  <th
    className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`}
  >
    {children}
  </th>
);
const TableCell = ({ children, className = "" }) => (
  <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}>
    {children}
  </td>
);

// Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-8">
    <Loader className="h-6 w-6 animate-spin text-gray-500" />
  </div>
);

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-6xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-auto max-h-[calc(90vh-120px)]">{children}</div>
      </div>
    </div>
  );
};

// Attendance Detail Modal
const AttendanceDetailModal = ({ onClose, classId, className }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("");

  const fetchAttendanceDetail = async () => {
    try {
      setLoading(true);
      const params = {
        include_relations: true,
        id_class: classId,
        limit: 100, // Get all records for this class
      };

      if (dateFilter) {
        params.start_date = dateFilter;
        params.end_date = dateFilter;
      }

      const response = await api.get("/api/attendance", { params });

      let data = [];
      if (Array.isArray(response.data)) {
        data = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        data = response.data.data;
      }

      setAttendanceData(data);
    } catch (error) {
      console.error("Error fetching attendance detail:", error);
      alert(
        "Gagal memuat detail presensi: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classId) {
      fetchAttendanceDetail();
    }
  }, [classId, dateFilter]);

  const getStatusBadge = (status) => {
    const statusArray = Array.isArray(status) ? status : [status];
    const statusMap = {
      hadir: "bg-green-100 text-green-800",
      sakit: "bg-yellow-100 text-yellow-800",
      izin: "bg-blue-100 text-blue-800",
      alpha: "bg-red-100 text-red-800",
      terlambat: "bg-orange-100 text-orange-800",
      cuti: "bg-purple-100 text-purple-800",
      dinas: "bg-gray-100 text-gray-800",
    };

    return (
      <div className="flex flex-wrap gap-1">
        {statusArray.map((stat, idx) => (
          <span
            key={idx}
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              statusMap[stat] || "bg-gray-100 text-gray-800"
            }`}
          >
            {stat.charAt(0).toUpperCase() + stat.slice(1)}
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const downloadDetailExcel = () => {
    try {
      if (!attendanceData || attendanceData.length === 0) {
        alert("Tidak ada data untuk didownload");
        return;
      }

      if (!window.XLSX) {
        throw new Error("Library XLSX tidak tersedia");
      }

      const wb = window.XLSX.utils.book_new();

      const excelData = attendanceData.map((item, index) => ({
        NO: index + 1,
        NAMA_SISWA: item.user?.full_name || "N/A",
        TANGGAL: formatDate(item.date),
        STATUS: Array.isArray(item.status)
          ? item.status.join(", ")
          : item.status,
        KETERANGAN: item.information || "-",
        JAM_PRESENSI: new Date(item.created_at).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        ROLE: item.role?.name || "Siswa",
      }));

      const ws = window.XLSX.utils.json_to_sheet([]);

      const colWidths = [
        { wch: 5 }, // NO
        { wch: 25 }, // NAMA_SISWA
        { wch: 15 }, // TANGGAL
        { wch: 15 }, // STATUS
        { wch: 30 }, // KETERANGAN
        { wch: 15 }, // JAM_PRESENSI
        { wch: 10 }, // ROLE
      ];
      ws["!cols"] = colWidths;

      // Add title
      window.XLSX.utils.sheet_add_aoa(
        ws,
        [[`DETAIL PRESENSI KELAS ${className}`]],
        { origin: "A1" }
      );
      window.XLSX.utils.sheet_add_aoa(ws, [[""]], { origin: "A2" });

      const headers = [
        "NO",
        "NAMA SISWA",
        "TANGGAL",
        "STATUS",
        "KETERANGAN",
        "JAM PRESENSI",
        "ROLE",
      ];
      window.XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A3" });

      const dataRows = excelData.map((row) => [
        row.NO,
        row.NAMA_SISWA,
        row.TANGGAL,
        row.STATUS,
        row.KETERANGAN,
        row.JAM_PRESENSI,
        row.ROLE,
      ]);

      window.XLSX.utils.sheet_add_aoa(ws, dataRows, { origin: "A4" });

      const range = window.XLSX.utils.encode_range({
        s: { c: 0, r: 0 },
        e: { c: 6, r: 2 + excelData.length },
      });
      ws["!ref"] = range;

      // Merge title cells
      ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }];

      // Style title
      const titleCell = "A1";
      if (!ws[titleCell])
        ws[titleCell] = { v: `DETAIL PRESENSI KELAS ${className}`, t: "s" };
      ws[titleCell].s = {
        font: { bold: true, sz: 16 },
        alignment: { horizontal: "center", vertical: "center" },
        fill: { fgColor: { rgb: "CCCCCC" } },
      };

      window.XLSX.utils.book_append_sheet(wb, ws, "Detail Presensi");

      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      const filename = `Detail_Presensi_${className.replace(
        /\s+/g,
        "_"
      )}_${dateStr}.xlsx`;

      window.XLSX.writeFile(wb, filename);
      alert(`File "${filename}" berhasil didownload!`);
    } catch (error) {
      console.error("Download detail error:", error);
      alert("Gagal mendownload detail: " + error.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Detail presensi untuk kelas <strong>{className}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={downloadDetailExcel}
            disabled={attendanceData.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Detail
          </Button>
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-40"
            placeholder="Filter tanggal"
          />
          {dateFilter && (
            <Button variant="ghost" size="sm" onClick={() => setDateFilter("")}>
              Reset
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NO</TableHead>
                <TableHead>NAMA SISWA</TableHead>
                <TableHead>TANGGAL</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>KETERANGAN</TableHead>
                <TableHead>JAM PRESENSI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData.length > 0 ? (
                attendanceData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {item.user?.full_name || "N/A"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.role?.name || "Siswa"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(item.date)}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      <span className="text-sm">{item.information || "-"}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.created_at).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan="6"
                    className="text-center py-8 text-muted-foreground"
                  >
                    {dateFilter
                      ? `Tidak ada data presensi untuk tanggal ${formatDate(
                          dateFilter
                        )}`
                      : "Tidak ada data presensi untuk kelas ini"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex justify-end pt-4">
        <Button onClick={onClose}>Tutup</Button>
      </div>
    </div>
  );
};

// Download Modal (updated for attendance class data)
const DownloadModal = ({ onClose }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllAttendanceData = async () => {
    try {
      const params = {
        limit: 100,
        page: 1,
      };

      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const response = await api.get(
        "/api/attendance/class?include_relations=true",
        { params }
      );

      let attendanceData = [];
      if (Array.isArray(response.data)) {
        attendanceData = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        attendanceData = response.data.data;
      }

      return attendanceData;
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      throw error;
    }
  };

  const generateExcelFile = (attendanceData) => {
    try {
      if (
        !attendanceData ||
        !Array.isArray(attendanceData) ||
        attendanceData.length === 0
      ) {
        throw new Error("Data presensi tidak valid atau kosong");
      }

      if (!window.XLSX) {
        throw new Error(
          "Library XLSX tidak tersedia. Pastikan SheetJS sudah dimuat."
        );
      }

      const wb = window.XLSX.utils.book_new();

      const excelData = attendanceData.map((item, index) => {
        if (!item || typeof item !== "object") {
          console.warn(`Data presensi pada index ${index} tidak valid:`, item);
          return {
            NO: index + 1,
            KELAS: "Data tidak valid",
            TAHUN_AJARAN: "N/A",
            TOTAL: 0,
            HADIR: 0,
            IZIN: 0,
            SAKIT: 0,
            ALPHA: 0,
            TERLAMBAT: 0,
            CUTI: 0,
            DINAS: 0,
          };
        }

        return {
          NO: index + 1,
          KELAS: item.class || "N/A",
          TAHUN_AJARAN: item.academic_years?.year || "N/A",
          TOTAL: item.statistics?.total || 0,
          HADIR: item.statistics?.hadir || 0,
          IZIN: item.statistics?.izin || 0,
          SAKIT: item.statistics?.sakit || 0,
          ALPHA: item.statistics?.alpha || 0,
          TERLAMBAT: item.statistics?.terlambat || 0,
          CUTI: item.statistics?.cuti || 0,
          DINAS: item.statistics?.dinas || 0,
        };
      });

      const ws = window.XLSX.utils.json_to_sheet([]);

      const colWidths = [
        { wch: 5 }, // NO
        { wch: 20 }, // KELAS
        { wch: 15 }, // TAHUN_AJARAN
        { wch: 8 }, // TOTAL
        { wch: 8 }, // HADIR
        { wch: 8 }, // IZIN
        { wch: 8 }, // SAKIT
        { wch: 8 }, // ALPHA
        { wch: 12 }, // TERLAMBAT
        { wch: 8 }, // CUTI
        { wch: 8 }, // DINAS
      ];
      ws["!cols"] = colWidths;

      // Add title
      window.XLSX.utils.sheet_add_aoa(ws, [["DATA PRESENSI KELAS"]], {
        origin: "A1",
      });
      window.XLSX.utils.sheet_add_aoa(ws, [[""]], { origin: "A2" });

      const headers = [
        "NO",
        "KELAS",
        "TAHUN AJARAN",
        "TOTAL",
        "HADIR",
        "IZIN",
        "SAKIT",
        "ALPHA",
        "TERLAMBAT",
        "CUTI",
        "DINAS",
      ];
      window.XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A3" });

      const dataRows = excelData.map((row) => [
        row.NO,
        row.KELAS,
        row.TAHUN_AJARAN,
        row.TOTAL,
        row.HADIR,
        row.IZIN,
        row.SAKIT,
        row.ALPHA,
        row.TERLAMBAT,
        row.CUTI,
        row.DINAS,
      ]);

      window.XLSX.utils.sheet_add_aoa(ws, dataRows, { origin: "A4" });

      const range = window.XLSX.utils.encode_range({
        s: { c: 0, r: 0 },
        e: { c: 10, r: 2 + excelData.length },
      });
      ws["!ref"] = range;

      // Merge title cells
      ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 10 } }];

      // Style title
      const titleCell = "A1";
      if (!ws[titleCell]) ws[titleCell] = { v: "DATA PRESENSI KELAS", t: "s" };
      ws[titleCell].s = {
        font: { bold: true, sz: 16 },
        alignment: { horizontal: "center", vertical: "center" },
        fill: { fgColor: { rgb: "CCCCCC" } },
      };

      window.XLSX.utils.book_append_sheet(wb, ws, "Data Presensi Kelas");

      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      const filename = `Data_Presensi_Kelas_${dateStr}.xlsx`;

      window.XLSX.writeFile(wb, filename);
      return filename;
    } catch (error) {
      console.error("Detailed error in generateExcelFile:", error);
      throw new Error("Gagal membuat file Excel: " + error.message);
    }
  };

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      const attendanceData = await fetchAllAttendanceData();

      if (attendanceData.length === 0) {
        alert("Tidak ada data presensi untuk didownload");
        return;
      }

      const filename = generateExcelFile(attendanceData);
      alert(
        `File "${filename}" berhasil didownload!\nTotal data: ${attendanceData.length} kelas`
      );
      onClose();
    } catch (error) {
      console.error("Download error:", error);
      alert("Gagal mendownload data: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Download data presensi kelas dalam format Excel (.xlsx)
      </p>

      <div className="p-4 border rounded-lg bg-blue-50">
        <h4 className="font-medium text-sm mb-2">Format File Excel:</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>
            • Kolom: NO, KELAS, TAHUN AJARAN, TOTAL, HADIR, IZIN, SAKIT, ALPHA,
            TERLAMBAT, CUTI, DINAS
          </li>
          <li>• Format: Microsoft Excel (.xlsx)</li>
          <li>
            • Dapat dibuka dengan Microsoft Excel, Google Sheets, atau aplikasi
            spreadsheet lainnya
          </li>
        </ul>
      </div>

      <div>
        <label className="text-sm font-medium">Filter Periode (Opsional)</label>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              Dari Tanggal
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              Sampai Tanggal
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Kosongkan untuk mendownload semua data
        </p>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Batal
        </Button>
        <Button onClick={handleDownload} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Download Excel
            </>
          )}
        </Button>
      </div>

      {isLoading && (
        <div className="text-center text-sm text-muted-foreground">
          <p>Sedang mengambil data dan membuat file Excel...</p>
          <p>Mohon tunggu sebentar...</p>
        </div>
      )}
    </div>
  );
};

// Main Component
export default function Presensi() {
  const [dataPresensi, setDataPresensi] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [currentClass, setCurrentClass] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pagination & Search
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState(null);

  // Load data from API
  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        ...(searchTerm && { search: searchTerm }),
      };

      const response = await api.get(
        "/api/attendance/class?include_relations=true",
        { params }
      );

      if (response.data) {
        let attendanceData = [];
        let paginationInfo = null;

        if (Array.isArray(response.data)) {
          attendanceData = response.data;
          paginationInfo = response.pagination || response.data.pagination;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          attendanceData = response.data.data;
          paginationInfo = response.data.pagination;
        } else {
          attendanceData = Array.isArray(response.data) ? response.data : [];
          paginationInfo = response.pagination;
        }

        setDataPresensi(attendanceData);
        setPagination(paginationInfo);

        if (!paginationInfo && attendanceData.length > 0) {
          const estimatedTotal =
            attendanceData.length === itemsPerPage
              ? currentPage * itemsPerPage + 1
              : (currentPage - 1) * itemsPerPage + attendanceData.length;

          const fallbackPagination = {
            current_page: currentPage,
            total_pages: Math.ceil(estimatedTotal / itemsPerPage),
            total_items: estimatedTotal,
            items_per_page: itemsPerPage,
            has_next_page: attendanceData.length === itemsPerPage,
            has_prev_page: currentPage > 1,
          };

          setPagination(fallbackPagination);
        }
      }
    } catch (error) {
      console.error("Fetch attendance data error:", error);
      alert(
        "Gagal memuat data presensi: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Modal handlers
  const openModal = (type, classData = null) => {
    setModalType(type);
    setCurrentClass(classData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType("");
    setCurrentClass(null);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const renderModal = () => {
    switch (modalType) {
      case "download":
        return <DownloadModal onClose={closeModal} />;
      case "upload":
        return (
          <UploadModal
            onClose={closeModal}
            onUploadSuccess={fetchAttendanceData}
          />
        );
      case "add":
        return (
          <AddAttendanceModal
            onClose={closeModal}
            onSave={fetchAttendanceData}
          />
        );
      case "detail":
        return (
          <AttendanceDetailModal
            onClose={closeModal}
            classId={currentClass?.id}
            className={currentClass?.class}
          />
        );
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (modalType) {
      case "download":
        return "Download Data Presensi";
      case "upload":
        return "Upload Data Presensi";
      case "add":
        return "Tambah Presensi Manual";
      case "detail":
        return `Detail Presensi - ${currentClass?.class || ""}`;
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Data Presensi Kelas
        </h1>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => openModal("upload")}>
            <Upload className="h-4 w-4" />
            Upload
          </Button>
          <Button variant="outline" onClick={() => openModal("download")}>
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button onClick={() => openModal("add")}>
            <Plus className="h-4 w-4" />
            Tambah Presensi
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Show</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={handleItemsPerPageChange}
              >
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </Select>
              <span className="text-sm font-medium">entries</span>
            </div>

            {/* <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placehDolder="Cari nama kelas..."
                className="pl-10 w-80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div> */}
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>NO</TableHead>
                    <TableHead>KELAS</TableHead>
                    <TableHead>TAHUN AJARAN</TableHead>
                    <TableHead>HADIR</TableHead>
                    <TableHead>IJIN</TableHead>
                    <TableHead>SAKIT</TableHead>
                    <TableHead>ALPHA</TableHead>
                    <TableHead>TERLAMBAT</TableHead>
                    <TableHead>AKSI</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataPresensi.length > 0 ? (
                    dataPresensi.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {item.class || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                            {item.academic_years?.year || "N/A"}
                          </span>
                        </TableCell>
                        <TableCell className="text-center font-semibold text-green-600">
                          {item.statistics?.hadir || 0}
                        </TableCell>
                        <TableCell className="text-center font-semibold text-blue-600">
                          {item.statistics?.izin || 0}
                        </TableCell>
                        <TableCell className="text-center font-semibold text-yellow-600">
                          {item.statistics?.sakit || 0}
                        </TableCell>
                        <TableCell className="text-center font-semibold text-red-600">
                          {item.statistics?.alpha || 0}
                        </TableCell>
                        <TableCell className="text-center font-semibold text-orange-600">
                          {item.statistics?.terlambat || 0}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openModal("detail", item)}
                            title="Lihat Detail Presensi"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan="9"
                        className="text-center py-8 text-muted-foreground"
                      >
                        {searchTerm
                          ? `Tidak ada data yang cocok dengan "${searchTerm}"`
                          : "Tidak ada data presensi kelas"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {dataPresensi.length > 0 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    {pagination ? (
                      <>
                        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                        {Math.min(
                          currentPage * itemsPerPage,
                          pagination.total_items
                        )}{" "}
                        of {pagination.total_items} entries
                      </>
                    ) : (
                      <>
                        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                        {Math.min(
                          currentPage * itemsPerPage,
                          dataPresensi.length
                        )}{" "}
                        of {dataPresensi.length} entries
                      </>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {(() => {
                      const totalItems =
                        pagination?.total_items || dataPresensi.length;
                      const totalPages =
                        pagination?.total_pages ||
                        Math.ceil(totalItems / itemsPerPage);
                      const hasPrev =
                        pagination?.has_prev_page ?? currentPage > 1;
                      const hasNext =
                        pagination?.has_next_page ?? currentPage < totalPages;

                      return (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={!hasPrev}
                            onClick={() => setCurrentPage(1)}
                          >
                            <ChevronLeft className="h-4 w-4" />
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={!hasPrev}
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>

                          {/* Page numbers */}
                          {Array.from(
                            { length: Math.min(5, totalPages) },
                            (_, i) => {
                              const page =
                                Math.max(
                                  1,
                                  Math.min(totalPages - 4, currentPage - 2)
                                ) + i;
                              if (page <= totalPages) {
                                return (
                                  <Button
                                    key={page}
                                    variant={
                                      currentPage === page
                                        ? "default"
                                        : "outline"
                                    }
                                    size="sm"
                                    onClick={() => setCurrentPage(page)}
                                  >
                                    {page}
                                  </Button>
                                );
                              }
                              return null;
                            }
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            disabled={!hasNext}
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={!hasNext}
                            onClick={() => setCurrentPage(totalPages)}
                          >
                            <ChevronRight className="h-4 w-4" />
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={getModalTitle()}>
        {renderModal()}
      </Modal>
    </div>
  );
}
