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
} from "lucide-react";
import api from "@/utils/axios";
import * as XLSX from "xlsx";
// UI Components
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
        className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg max-h-[90vh] overflow-hidden"
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

// Modal Content Components
// Modal Content Components
const DownloadModal = ({ onClose }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [includeDeleted, setIncludeDeleted] = useState(false);

  const fetchAllStudentsData = async () => {
    try {
      // Fetch all students data with large limit to get everything
      const params = {
        limit: 10000, // Adjust based on your data size
        page: 1,
      };

      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const response = await api.get("/api/students", { params });

      // Handle different response structures
      let studentsData = [];
      if (Array.isArray(response.data)) {
        studentsData = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        studentsData = response.data.data;
      }

      return studentsData;
    } catch (error) {
      console.error("Error fetching students data:", error);
      throw error;
    }
  };

  const generateExcelFile = (studentsData) => {
    try {
      // Validasi input data
      if (
        !studentsData ||
        !Array.isArray(studentsData) ||
        studentsData.length === 0
      ) {
        throw new Error("Data siswa tidak valid atau kosong");
      }

      // Cek apakah XLSX tersedia
      if (!window.XLSX) {
        throw new Error(
          "Library XLSX tidak tersedia. Pastikan SheetJS sudah dimuat."
        );
      }

      // Create a new workbook
      const wb = window.XLSX.utils.book_new();

      // Prepare data for Excel dengan validasi yang lebih baik
      const excelData = studentsData.map((student, index) => {
        // Validasi student object
        if (!student || typeof student !== "object") {
          console.warn(`Data siswa pada index ${index} tidak valid:`, student);
          return {
            NO: index + 1,
            NAMA: "Data tidak valid",
            NIS: "N/A",
            NISN: "N/A",
            KELAS: "N/A",
            TAHUN_AJARAN: "N/A",
            EMAIL: "N/A",
            TANGGAL_DIBUAT: "N/A",
          };
        }

        return {
          NO: index + 1,
          NAMA: student.user?.full_name || "N/A",
          NIS: student.nis || "N/A",
          NISN: student.user?.data?.nisn || "N/A",
          KELAS:
            [
              student.class?.grade || "",
              student.departments?.short_name || "",
              student.class?.subgrade || "",
            ]
              .filter(Boolean)
              .join(" ")
              .trim() || "N/A",
          TAHUN_AJARAN: student.academicYears?.year || "N/A",
          EMAIL: student.user?.data?.email || "N/A",
          TANGGAL_DIBUAT: student.created_at
            ? (() => {
                try {
                  return new Date(student.created_at).toLocaleDateString(
                    "id-ID"
                  );
                } catch (dateError) {
                  console.warn(
                    `Error parsing date for student ${index}:`,
                    dateError
                  );
                  return "N/A";
                }
              })()
            : "N/A",
        };
      });

      // Create worksheet from data
      const ws = window.XLSX.utils.json_to_sheet([]);

      // Set column widths
      const colWidths = [
        { wch: 5 }, // NO
        { wch: 25 }, // NAMA
        { wch: 12 }, // NIS
        { wch: 12 }, // NISN
        { wch: 15 }, // KELAS
        { wch: 15 }, // TAHUN_AJARAN
        { wch: 25 }, // EMAIL
        { wch: 15 }, // TANGGAL_DIBUAT
      ];
      ws["!cols"] = colWidths;

      // Add title row
      window.XLSX.utils.sheet_add_aoa(ws, [["DATA SISWA"]], { origin: "A1" });

      // Add empty row
      window.XLSX.utils.sheet_add_aoa(ws, [[""]], { origin: "A2" });

      // Add headers starting from row 3
      const headers = [
        "NO",
        "NAMA",
        "NIS",
        "NISN",
        "KELAS",
        "TAHUN AJARAN",
        "EMAIL",
        "TANGGAL DIBUAT",
      ];
      window.XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A3" });

      // Add data starting from row 4
      const dataRows = excelData.map((row) => [
        row.NO,
        row.NAMA,
        row.NIS,
        row.NISN,
        row.KELAS,
        row.TAHUN_AJARAN,
        row.EMAIL,
        row.TANGGAL_DIBUAT,
      ]);

      window.XLSX.utils.sheet_add_aoa(ws, dataRows, { origin: "A4" });

      // Set range untuk worksheet
      const range = window.XLSX.utils.encode_range({
        s: { c: 0, r: 0 },
        e: { c: 7, r: 2 + excelData.length },
      });
      ws["!ref"] = range;

      // Merge title cells (A1:H1)
      ws["!merges"] = [
        {
          s: { r: 0, c: 0 },
          e: { r: 0, c: 7 },
        },
      ];

      // Style the title
      const titleCell = "A1";
      if (!ws[titleCell]) ws[titleCell] = { v: "DATA SISWA", t: "s" };
      ws[titleCell].s = {
        font: { bold: true, sz: 16 },
        alignment: { horizontal: "center", vertical: "center" },
        fill: { fgColor: { rgb: "CCCCCC" } },
      };

      // Style headers
      headers.forEach((header, colIndex) => {
        const cellAddress = window.XLSX.utils.encode_cell({
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

      // Style data cells dengan border
      dataRows.forEach((row, rowIndex) => {
        row.forEach((cellValue, colIndex) => {
          const cellAddress = window.XLSX.utils.encode_cell({
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

      // Add worksheet to workbook
      window.XLSX.utils.book_append_sheet(wb, ws, "Data Siswa");

      // Generate filename with date
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;
      const filename = `Data_Siswa_${dateStr}.xlsx`;

      // Write file
      window.XLSX.writeFile(wb, filename);

      console.log(`File Excel berhasil dibuat: ${filename}`);
      return filename;
    } catch (error) {
      console.error("Detailed error in generateExcelFile:", error);

      // Berikan pesan error yang lebih spesifik
      let errorMessage = "Gagal membuat file Excel";

      if (error.message.includes("XLSX")) {
        errorMessage =
          "Library XLSX tidak tersedia. Pastikan SheetJS sudah dimuat.";
      } else if (error.message.includes("Data siswa")) {
        errorMessage = "Data siswa tidak valid atau kosong";
      } else if (error.message.includes("writeFile")) {
        errorMessage =
          "Gagal menyimpan file. Coba tutup file Excel yang sedang terbuka.";
      } else if (error.stack) {
        console.error("Stack trace:", error.stack);
      }

      throw new Error(errorMessage);
    }
  };

  const handleDownload = async () => {
    try {
      setIsLoading(true);

      // Fetch all students data
      const studentsData = await fetchAllStudentsData();

      if (studentsData.length === 0) {
        alert("Tidak ada data siswa untuk didownload");
        return;
      }

      // Generate and download Excel file
      const filename = generateExcelFile(studentsData);

      alert(
        `File "${filename}" berhasil didownload!\nTotal data: ${studentsData.length} siswa`
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
        Download data siswa dalam format Excel (.xlsx)
      </p>

      <div className="p-4 border rounded-lg bg-blue-50">
        <h4 className="font-medium text-sm mb-2">Format File Excel:</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>
            • Kolom: NO, NAMA, NIS, NISN, KELAS, TAHUN AJARAN, EMAIL, TANGGAL
            DIBUAT
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

const UploadModal = ({ onClose, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const processExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });

          // Ambil sheet pertama
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          // Konversi sheet ke JSON
          const excelData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

          resolve(excelData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error("Error reading file"));
      reader.readAsArrayBuffer(file);
    });
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Pilih file terlebih dahulu!");
      return;
    }

    try {
      setIsLoading(true);

      let uploadData;

      if (
        selectedFile.name.endsWith(".xlsx") ||
        selectedFile.name.endsWith(".xls")
      ) {
        // Process Excel file
        const excelData = await processExcelFile(selectedFile);
        uploadData = {
          type: "excel",
          data: excelData,
        };
      } else {
        // For CSV or other formats, you'd process differently
        uploadData = {
          type: "csv",
          students: [], // Process CSV data here
        };
      }

      const response = await api.post("/api/students/bulk", uploadData);

      if (response.data.success) {
        alert(
          `Upload berhasil! ${response.data.data.summary.successful} siswa berhasil ditambahkan, ${response.data.data.summary.failed} gagal.`
        );
        onUploadSuccess && onUploadSuccess();
        onClose();
      } else {
        alert("Upload gagal: " + response.data.message);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(
        "Gagal upload file: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Upload file data siswa dalam format Excel atau CSV
      </p>

      <div>
        <label className="text-sm font-medium">Pilih File Data Siswa</label>
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
        <p className="text-xs text-muted-foreground">
          Kolom yang diperlukan: Nama Lengkap, Kelas, Jurusan, Subkelas
          (opsional), NIS, Tahun Ajaran
        </p>
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

// SelectWithSearch Component
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

  // Find selected option when value changes
  useEffect(() => {
    if (value && options.length > 0) {
      const found = options.find((opt) => opt[valueField] == value);
      setSelectedOption(found);
    } else {
      setSelectedOption(null);
    }
  }, [value, options, valueField]);

  // Fetch options when component mounts or search term changes
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

    const timeoutId = setTimeout(fetchData, 300); // Debounce
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

const AddEditStudentModal = ({ onClose, student = null, onSave }) => {
  const [formData, setFormData] = useState({
    id_user: student?.id_user || "",
    id_class: student?.id_class || "",
    nis: student?.nis || "",
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

      // Add display field for classes
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

  const handleSave = async () => {
    if (!formData.id_user || !formData.id_class || !formData.nis) {
      alert("Mohon lengkapi semua field yang wajib diisi!");
      return;
    }

    try {
      setIsLoading(true);

      let response;
      if (student) {
        // Update existing student
        response = await api.put(`/api/students/${student.id}`, formData);
      } else {
        // Create new student
        response = await api.post("/api/students", formData);
      }

      if (response.status === 200 || response.status === 201) {
        alert(
          student
            ? "Data siswa berhasil diperbarui!"
            : "Data siswa berhasil ditambahkan!"
        );
        onSave && onSave(response.data);
        onClose();
      }
    } catch (error) {
      console.error("Save error:", error);
      alert(
        "Gagal menyimpan data: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {student
          ? "Edit data siswa"
          : "Silakan isi form untuk menambah data siswa baru"}
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
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">NIS *</label>
        <Input
          placeholder="Masukkan NIS"
          value={formData.nis}
          onChange={(e) => handleInputChange("nis", e.target.value)}
        />
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
          {student ? "Update Data" : "Tambah Data"}
        </Button>
      </div>
    </div>
  );
};

// Main Component
export default function Siswa() {
  const [dataSiswa, setDataSiswa] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [currentStudent, setCurrentStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pagination & Search
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState(null);

  // Load data from API
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        ...(searchTerm && { search: searchTerm }),
      };

      const response = await api.get("/api/students", { params });

      console.log("Full API Response:", response); // Debug log
      console.log("Response Data:", response.data); // Debug log
      console.log("Response Pagination:", response.pagination); // Debug log

      if (response.data) {
        let students = [];
        let paginationInfo = null;

        // Handle different response structures
        if (Array.isArray(response.data)) {
          // If response.data is directly an array
          students = response.data;
          // Check for pagination in response or headers
          paginationInfo = response.pagination || response.data.pagination;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // If data is nested: { data: [], pagination: {} }
          students = response.data.data;
          paginationInfo = response.data.pagination;
        } else if (Array.isArray(response.data.students)) {
          // Alternative structure: { students: [], pagination: {} }
          students = response.data.students;
          paginationInfo = response.data.pagination;
        } else {
          // Fallback: treat entire response.data as students array
          students = Array.isArray(response.data) ? response.data : [];
          paginationInfo = response.pagination;
        }

        console.log("Processed Students:", students); // Debug log
        console.log("Processed Pagination:", paginationInfo); // Debug log

        setDataSiswa(students);
        setPagination(paginationInfo);

        // If no pagination info but we have data, create minimal pagination
        if (!paginationInfo && students.length > 0) {
          // Estimate total based on current page and items received
          const estimatedTotal =
            students.length === itemsPerPage
              ? currentPage * itemsPerPage + 1 // More pages likely exist
              : (currentPage - 1) * itemsPerPage + students.length; // This is the last page

          const fallbackPagination = {
            current_page: currentPage,
            total_pages: Math.ceil(estimatedTotal / itemsPerPage),
            total_items: estimatedTotal,
            items_per_page: itemsPerPage,
            has_next_page: students.length === itemsPerPage,
            has_prev_page: currentPage > 1,
          };

          console.log("Created Fallback Pagination:", fallbackPagination); // Debug log
          setPagination(fallbackPagination);
        }
      }
    } catch (error) {
      console.error("Fetch students error:", error);
      alert(
        "Gagal memuat data siswa: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Load initial data and when dependencies change
  useEffect(() => {
    fetchStudents();
  }, [currentPage, itemsPerPage, searchTerm]);

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Modal handlers
  const openModal = (type, student = null) => {
    setModalType(type);
    setCurrentStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType("");
    setCurrentStudent(null);
  };

  const handleSaveStudent = () => {
    fetchStudents(); // Refresh data after save
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
          <UploadModal onClose={closeModal} onUploadSuccess={fetchStudents} />
        );
      case "add":
        return (
          <AddEditStudentModal
            onClose={closeModal}
            onSave={handleSaveStudent}
          />
        );
      case "edit":
        return (
          <AddEditStudentModal
            onClose={closeModal}
            student={currentStudent}
            onSave={handleSaveStudent}
          />
        );
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (modalType) {
      case "download":
        return "Download Data Siswa";
      case "upload":
        return "Upload Data Siswa";
      case "add":
        return "Tambah Data Siswa";
      case "edit":
        return "Edit Data Siswa";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Data Siswa</h1>

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
            Tambah Data
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

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama, NIS, NISN..."
                className="pl-10 w-80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>NO</TableHead>
                    <TableHead>NAMA</TableHead>
                    <TableHead>NIS</TableHead>
                    <TableHead>NISN</TableHead>
                    <TableHead>KELAS</TableHead>
                    <TableHead>TAHUN AJARAN</TableHead>
                    <TableHead>AKSI</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataSiswa.length > 0 ? (
                    dataSiswa.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                              {item.user?.full_name?.charAt(0) || "S"}
                            </div>
                            <div className="font-medium">
                              {item.user?.full_name || "N/A"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {item.nis}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {item.user?.data?.nisn || "N/A"}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                            {item.class?.grade} {item.departments?.short_name}{" "}
                            {item.class?.subgrade}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.academicYears?.year}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openModal("edit", item)}
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
                        {searchTerm
                          ? `Tidak ada data yang cocok dengan "${searchTerm}"`
                          : "Tidak ada data siswa"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Always show pagination if there's data */}
              {dataSiswa.length > 0 && (
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
                        {Math.min(currentPage * itemsPerPage, dataSiswa.length)}{" "}
                        of {dataSiswa.length} entries
                      </>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {/* Calculate pagination values */}
                    {(() => {
                      const totalItems =
                        pagination?.total_items || dataSiswa.length;
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
