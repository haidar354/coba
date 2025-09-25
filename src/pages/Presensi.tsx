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

// Simplified UI Components
const Input = ({ className = "", ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
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
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
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

const Select = ({
  children,
  value,
  onValueChange,
  placeholder = "Select...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || "");
  const [displayValue, setDisplayValue] = useState("");

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
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
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
    className="w-full px-3 py-2 text-left text-sm hover:bg-accent focus:outline-none"
  >
    {children}
  </button>
);

const Table = ({ children }) => (
  <div className="overflow-x-auto">
    <table className="w-full caption-bottom text-sm">{children}</table>
  </div>
);

const TableHeader = ({ children }) => (
  <thead className="[&_tr]:border-b">{children}</thead>
);
const TableBody = ({ children }) => (
  <tbody className="[&_tr:last-child]:border-0">{children}</tbody>
);
const TableRow = ({ children, className = "" }) => (
  <tr className={`border-b transition-colors hover:bg-muted/50 ${className}`}>
    {children}
  </tr>
);
const TableHead = ({ children }) => (
  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
    {children}
  </th>
);
const TableCell = ({ children, className = "" }) => (
  <td className={`p-4 align-middle ${className}`}>{children}</td>
);

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
            className="rounded-sm opacity-70 hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-auto max-h-[calc(90vh-120px)]">{children}</div>
      </div>
    </div>
  );
};

// SelectWithSearch Component (modified to use local filtering)
const SelectWithSearch = ({
  placeholder,
  value,
  onSelect,
  displayField,
  valueField = "id",
  searchField,
  disabled = false,
  allOptions = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (value && allOptions.length > 0) {
      const found = allOptions.find(
        (opt) => String(opt[valueField]) === String(value)
      );
      setSelectedOption(found || null);
    } else {
      setSelectedOption(null);
    }
  }, [value, allOptions, valueField]);

  const filteredOptions = allOptions.filter((option) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      option[displayField].toLowerCase().includes(lowerSearch) ||
      (searchField && option[searchField]?.toLowerCase().includes(lowerSearch))
    );
  });

  const handleSelect = (option) => {
    setSelectedOption(option);
    onSelect(option[valueField], option);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleOpen = () => {
    if (disabled) return;
    setIsOpen(true);
  };

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        disabled={disabled}
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
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
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option[valueField]}
                  onClick={() => handleSelect(option)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-accent"
                >
                  <div className="font-medium">{option[displayField]}</div>
                  {searchField && option[searchField] && (
                    <div className="text-xs text-muted-foreground">
                      {option[searchField]}
                    </div>
                  )}
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

// Upload Modal
const UploadModal = ({ onClose, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        const bulkResponse = await api.post("/api/attendance/bulk", {
          type: "excel",
          data: response.data,
        });
        if (bulkResponse.status === 201) {
          alert("Upload berhasil!");
          onUploadSuccess && onUploadSuccess();
          onClose();
        }
      }
    } catch (error) {
      alert(
        "Upload gagal: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href =
      "/tu/file_template/Template%20Presensi%20Siswa%20-%20Harian.xlsx";
    link.download = "template_presensi_siswa.xlsx";
    link.target = "_blank";
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
          onChange={(e) => setSelectedFile(e.target.files[0])}
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
        <Button
          onClick={handleDownload}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Template Excel
        </Button>
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

// Add/Edit Attendance Modal (modified to fetch options outside)
const AddEditAttendanceModal = ({ onClose, onSave, editData = null }) => {
  const [formData, setFormData] = useState({
    id_user: editData?.id_user || "",
    id_class: editData?.id_class || "",
    id_role: editData?.id_role || 4,
    time: editData?.time || "",
    date: editData?.date
      ? new Date(editData.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    status: editData?.status
      ? Array.isArray(editData.status)
        ? editData.status
        : [editData.status]
      : ["hadir"],
    information: editData?.information || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [usersOptions, setUsersOptions] = useState([]);
  const [classesOptions, setClassesOptions] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const loadOptions = async () => {
      setFetching(true);
      try {
        // Fetch users
        const usersResponse = await api.get("/api/users", {
          params: { limit: "no_limit", include_role: true },
        });
        setUsersOptions(usersResponse.data || []);

        // Fetch classes
        const classesResponse = await api.get("/api/classes", {
          params: {
            limit: "no_limit",
            include_relations: true,
          },
        });
        const classes = classesResponse.data || [];
        setClassesOptions(
          classes.map((cls) => ({
            ...cls,
            class_display: `${cls.grade} ${cls.department?.name || ""} ${
              cls.subgrade || ""
            }`.trim(),
            academic_year: cls.academic_year || { year: "" }, // Ensure academic_year exists
          }))
        );
      } catch (error) {
        console.error("Error loading options:", error);
        alert("Gagal memuat data users atau classes.");
      } finally {
        setFetching(false);
      }
    };

    loadOptions();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStatusChange = (status) => {
    const statusArray = Array.isArray(formData.status) ? formData.status : [];
    if (statusArray.includes(status)) {
      setFormData((prev) => ({
        ...prev,
        status: statusArray.filter((s) => s !== status),
      }));
    } else {
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

    const submitData = {
      ...formData,
      time: (() => {
        // Ambil nilai time dari berbagai sumber
        let timeValue =
          formData.time ||
          editData?.time ||
          (formData.date ? formData.date.toString().split("T")[1] : null) ||
          "00:00:00"; // fallback sementara

        // Jika berformat "HH:mm:ss", ambil hanya "HH:mm"
        if (timeValue && timeValue.length >= 5) {
          // Handle "00:00:00" → "00:00"
          if (timeValue === "00:00:00") {
            return "00:00";
          }
          // Atau secara umum, ambil 5 karakter pertama jika format HH:mm:ss
          if (
            timeValue.length === 8 &&
            timeValue[2] === ":" &&
            timeValue[5] === ":"
          ) {
            return timeValue.substring(0, 5);
          }
        }

        // Jika sudah dalam format HH:mm, biarkan
        if (timeValue && timeValue.length === 5 && timeValue[2] === ":") {
          return timeValue;
        }

        // Fallback aman
        return "00:00";
      })(),
      date: formData.date
        ? formData.date.toString().split("T")[0]
        : formData.date,
    };

    try {
      setIsLoading(true);
      const url = editData
        ? `/api/attendance/${editData.id}`
        : "/api/attendance";
      const method = editData ? "put" : "post";

      const response = await api[method](url, submitData);

      if (response.status === 200 || response.status === 201) {
        alert(
          editData
            ? "Data presensi berhasil diperbarui!"
            : "Data presensi berhasil ditambahkan!"
        );
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

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {editData
          ? "Edit data presensi"
          : "Silakan isi form untuk menambah data presensi baru"}
      </p>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">User *</label>
          <SelectWithSearch
            placeholder="Pilih User"
            value={formData.id_user}
            onSelect={(value) => handleInputChange("id_user", value)}
            displayField="full_name"
            searchField="role.name"
            valueField="id"
            allOptions={usersOptions}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Kelas *</label>
          <SelectWithSearch
            placeholder="Pilih Kelas"
            value={formData.id_class}
            onSelect={(value) => handleInputChange("id_class", value)}
            displayField="class_display"
            searchField="academic_year.year"
            valueField="id"
            allOptions={classesOptions}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Waktu Mulai</label>
          <Input
            type="datetime-local"
            value={
              formData?.time === ""
                ? `${formData?.date}`
                : `${formData.date}T${(formData?.time || "00:00").substring(0, 5)}`
            }
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
          ) : editData ? (
            <Edit className="h-4 w-4 mr-2" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          {editData ? "Update Presensi" : "Tambah Presensi"}
        </Button>
      </div>
    </div>
  );
};

// Attendance Detail Modal
const AttendanceDetailModal = ({ onClose, classId, className, onEdit }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("");

  const fetchAttendanceDetail = async () => {
    try {
      setLoading(true);
      const params = {
        include_relations: true,
        id_class: classId,
        limit: 100,
        id_role: 4, // Filter for students only
        ...(dateFilter && { start_date: dateFilter, end_date: dateFilter }),
      };

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
    if (classId) fetchAttendanceDetail();
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

      const wb = XLSX.utils.book_new();
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

      const ws = XLSX.utils.json_to_sheet(excelData);
      XLSX.utils.book_append_sheet(wb, ws, "Detail Presensi");

      const filename = `Detail_Presensi_${className.replace(/\s+/g, "_")}_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      XLSX.writeFile(wb, filename);
      alert(`File "${filename}" berhasil didownload!`);
    } catch (error) {
      console.error("Download detail error:", error);
      alert("Gagal mendownload detail: " + error.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Detail presensi untuk kelas <strong>{className}</strong>
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={downloadDetailExcel}
            disabled={!attendanceData.length}
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
        <div className="flex items-center justify-center py-8">
          <Loader className="h-6 w-6 animate-spin text-gray-500" />
        </div>
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
                <TableHead>JAM</TableHead>
                <TableHead>AKSI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData.length > 0 ? (
                attendanceData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {item.user?.full_name || "N/A"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.role?.name || "Siswa"}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(item.date)}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>{item.information || "-"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(item.created_at).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(item)}
                        title="Edit Presensi"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan="7"
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

// Download Modal
const DownloadModal = ({ onClose }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      const params = { limit: 100, page: 1 };
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const response = await api.get(
        "/api/attendance/class?include_relations=true",
        { params }
      );

      let attendanceData = [];
      if (Array.isArray(response.data)) {
        attendanceData = response.data;
      } else if (response.data.data) {
        attendanceData = response.data.data;
      }

      if (attendanceData.length === 0) {
        alert("Tidak ada data presensi untuk didownload");
        return;
      }

      const wb = XLSX.utils.book_new();
      const excelData = attendanceData.map((item, index) => ({
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
      }));

      const ws = XLSX.utils.json_to_sheet(excelData);
      XLSX.utils.book_append_sheet(wb, ws, "Data Presensi Kelas");

      const filename = `Data_Presensi_Kelas_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      XLSX.writeFile(wb, filename);
      alert(`File "${filename}" berhasil didownload!`);
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
    </div>
  );
};

// Main Component
export default function Presensi() {
  const [dataPresensi, setDataPresensi] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [currentClass, setCurrentClass] = useState(null);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState(null);

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

      let attendanceData = [];
      let paginationInfo = null;

      if (Array.isArray(response.data)) {
        attendanceData = response.data;
        paginationInfo = response.pagination;
      } else if (response.data.data) {
        attendanceData = response.data.data;
        paginationInfo = response.data.pagination;
      }

      setDataPresensi(attendanceData);
      setPagination(paginationInfo);

      if (!paginationInfo && attendanceData.length > 0) {
        const estimatedTotal =
          attendanceData.length === itemsPerPage
            ? currentPage * itemsPerPage + 1
            : (currentPage - 1) * itemsPerPage + attendanceData.length;

        setPagination({
          current_page: currentPage,
          total_pages: Math.ceil(estimatedTotal / itemsPerPage),
          total_items: estimatedTotal,
          items_per_page: itemsPerPage,
          has_next_page: attendanceData.length === itemsPerPage,
          has_prev_page: currentPage > 1,
        });
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
    const timeoutId = setTimeout(() => setCurrentPage(1), 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const openModal = (type, classData = null, editItem = null) => {
    setModalType(type);
    setCurrentClass(classData);
    setEditData(editItem);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType("");
    setCurrentClass(null);
    setEditData(null);
  };

  const handleEdit = (attendanceItem) => {
    closeModal(); // Close detail modal first
    setTimeout(() => {
      openModal("add", null, attendanceItem); // Open edit modal with data
    }, 100);
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
          <AddEditAttendanceModal
            onClose={closeModal}
            onSave={fetchAttendanceData}
            editData={editData}
          />
        );
      case "detail":
        return (
          <AttendanceDetailModal
            onClose={closeModal}
            classId={currentClass?.id}
            className={currentClass?.class}
            onEdit={handleEdit}
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
        return editData ? "Edit Presensi" : "Tambah Presensi Manual";
      case "detail":
        return `Detail Presensi - ${currentClass?.class || ""}`;
      default:
        return "";
    }
  };

  const renderPagination = () => {
    const totalItems = pagination?.total_items || dataPresensi.length;
    const totalPages =
      pagination?.total_pages || Math.ceil(totalItems / itemsPerPage);
    const hasPrev = pagination?.has_prev_page ?? currentPage > 1;
    const hasNext = pagination?.has_next_page ?? currentPage < totalPages;

    return (
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
          entries
        </div>
        <div className="flex gap-2">
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
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page =
              Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
            if (page <= totalPages) {
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              );
            }
            return null;
          })}
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
        </div>
      </div>
    );
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
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Show</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(parseInt(value));
                  setCurrentPage(1);
                }}
              >
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </Select>
              <span className="text-sm font-medium">entries</span>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="h-6 w-6 animate-spin text-gray-500" />
            </div>
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

              {dataPresensi.length > 0 && renderPagination()}
            </>
          )}
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={getModalTitle()}>
        {renderModal()}
      </Modal>
    </div>
  );
}
