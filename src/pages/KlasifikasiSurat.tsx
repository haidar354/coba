import {
  Plus,
  Download,
  Upload,
  Search,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Modal from "@/components/Modal";
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
import { useState, useEffect, useRef } from "react";
import api from "@/utils/axios";
import * as XLSX from "xlsx";
// Komponen untuk konten modal
const DaftarSurvei = ({
  text,
  category,
  onClose,
  onSubmit,
  editData = null,
}) => {
  const [formData, setFormData] = useState({
    id_user: parseInt(localStorage.getItem("id_users")) || "",
    letter_number: editData !== null ? editData.letter_number : "",
    letter_type: editData !== null ? editData.letter_type : "incoming",
    title: editData !== null ? editData.title : "",
    description: editData !== null ? editData.description : "",
    sender: editData !== null ? editData.sender : "",
    recipient: editData !== null ? editData.recipient : "",
    date_received: editData !== null ? editData.date_received : "",
    date_sent: editData !== null ? editData.date_sent : "",
    file_path: editData !== null ? editData.file_path : "",
  });
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, file }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {category === "Download" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{text}</p>
          <div>
            <label className="block text-sm font-medium mb-2">
              Periode Data
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  type="date"
                  placeholder="Tanggal Mulai"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Input
                  type="date"
                  placeholder="Tanggal Akhir"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      )}

      {category === "Upload" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{text}</p>
          <div>
            <label className="block text-sm font-medium mb-2">
              Upload File
            </label>
            <Input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            <p className="text-xs text-muted-foreground mt-1">
              File harus berisi kolom: nama, deskripsi (opsional)
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={!formData.file}>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>
      )}

      {(category === "Tambah Data" || category === "Edit Data") && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Judul</label>
            <Input
              placeholder="Masukkan nomor surat"
              value={formData.title === "" ? "" : formData.title}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Nomor Surat
            </label>
            <Input
              placeholder="Masukkan nomor surat"
              value={formData.letter_number}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  letter_number: e.target.value,
                }))
              }
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Tipe Agenda
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="incoming"
                    name="tipe"
                    value="incoming"
                    className="h-4 w-4"
                    checked={formData.letter_type === "incoming"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        letter_type: e.target.value,
                      }))
                    }
                  />
                  <label htmlFor="incoming" className="text-sm">
                    Surat Masuk
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="outgoing"
                    name="tipe"
                    value="outgoing"
                    className="h-4 w-4"
                    checked={formData.letter_type === "outgoing"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        letter_type: e.target.value,
                      }))
                    }
                  />
                  <label htmlFor="outgoing" className="text-sm">
                    Surat Keluar
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Pengirim</label>
            <Input
              placeholder="Masukkan nama klasifikasi"
              value={formData.sender}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  sender: e.target.value,
                }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Penerima</label>
            <Input
              placeholder="Masukkan nama klasifikasi"
              value={formData.recipient}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  recipient: e.target.value,
                }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Tanggal Dikirim
            </label>
            <Input
              type="date"
              placeholder="Pilih tanggal"
              value={
                formData.date_sent !== ""
                  ? new Date(formData.date_sent).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  date_sent: e.target.value,
                }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Tanggal Diterima
            </label>
            <Input
              type="date"
              placeholder="Pilih tanggal"
              value={
                formData.date_received !== ""
                  ? new Date(formData.date_received).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  date_received: e.target.value,
                }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Deskripsi</label>
            <textarea
              className="w-full min-h-[120px] p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan deskripsi"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium">
              Upload File Surat{" "}
              {category === "Edit Data" &&
                "(jika tidak ingin diganti biarkan kosong)"}
            </label>
            <Input
              type="file"
              accept=".word,.pdf,.jpg,.png"
              onChange={handleFileChange}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Format yang didukung: word, pdf, jpg, png
            </p>
            {formData.file && (
              <p className="text-sm text-green-600 mt-2">
                File dipilih: {formData.file.name}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={!formData.title.trim()}>
              {category === "Edit Data" ? "Update" : "Simpan"}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};

export default function KlasifikasiSurat() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalText, setModalText] = useState("");
  const [category, setCategory] = useState("");
  const [editData, setEditData] = useState(null);

  // Data state
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});

  // Filter state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch data from API
  const fetchLetters = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
      };

      if (searchTerm.trim()) {
        params.search = searchTerm;
      }

      const response = await api.get("/api/academic/letters", { params });
      setLetters(response.data || []);
      setPagination(JSON.parse(response.headers["x-pagination"]) || {});
    } catch (error) {
      console.error("Error fetching letters:", error);
      setLetters([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLetters();
  }, [currentPage, pageSize, searchTerm]);

  const openModal = (title, text = "", cat = "", data = null) => {
    setModalTitle(title);
    setModalText(text);
    setCategory(cat);
    setEditData(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalTitle("");
    setModalText("");
    setCategory("");
    setEditData(null);
  };

  const handleDownload = () => {
    openModal(
      "Export Data Klasifikasi Surat",
      "Pilih format file dan periode data yang ingin diunduh",
      "Download"
    );
  };

  const handleTambahData = () => {
    openModal("Tambah Klasifikasi Surat", "", "Tambah Data");
  };

  const handleEdit = (item) => {
    openModal("Edit Klasifikasi Surat", "", "Edit Data", item);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        await api.delete(`/api/academic/letters/${id}`);
        fetchLetters(); // Refresh data
      } catch (error) {
        console.error("Error deleting letter:", error);
        alert("Gagal menghapus data");
      }
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (category === "Tambah Data") {
        const formData1 = new FormData();
        formData1.append("file", formData.file);
        formData1.append("folder_name", "data/letters");

        const response = await api.post("/api/upload", formData1, {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
        });
        await api.post("/api/academic/letters", {
          id_user: formData.id_user,
          letter_number: formData.letter_number,
          letter_type: formData.letter_type,
          title: formData.title,
          description: formData.description,
          sender: formData.sender,
          recipient: formData.recipient,
          date_received: formData.date_received,
          date_sent: formData.date_sent,
          file_path: response.data,
        });
        alert("Data berhasil ditambahkan");
      } else if (category === "Edit Data") {
        if (!editData) {
          return;
        }

        // Pastikan tanggal dalam format YYYY-MM-DD
        const formatDate = (date) => {
          if (!date) return "";
          // Jika sudah string YYYY-MM-DD, return apa adanya
          if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
          // Jika ISO string, ambil bagian tanggal saja
          if (typeof date === "string" && date.includes("T")) {
            return date.split("T")[0];
          }
          // Jika Date object
          const d = new Date(date);
          return d.toISOString().split("T")[0];
        };

        const payload = {
          id_user: formData.id_user || editData.id_user,
          letter_number: formData.letter_number || editData.letter_number,
          letter_type: formData.letter_type || editData.letter_type,
          title: formData.title || editData.title,
          description: formData.description || editData.description,
          sender: formData.sender || editData.sender,
          recipient: formData.recipient || editData.recipient,
          date_received: formatDate(
            formData.date_received || editData.date_received
          ),
          date_sent: formatDate(formData.date_sent || editData.date_sent),
          file_path: editData.file_path,
        };

        if (formData.file === undefined || formData.file === null) {
          await api.put(`/api/academic/letters/${editData.id}`, payload);
        } else {
          const formData1 = new FormData();
          formData1.append("file", formData.file);
          formData1.append("folder_name", "data/letters");

          const response = await api.post("/api/upload", formData1, {
            headers: {
              "Content-Type": "multipart/form-data",
              Accept: "application/json",
              "X-Requested-With": "XMLHttpRequest",
            },
          });
          payload.file_path = response.data || editData.file_path;
          await api.put(`/api/academic/letters/${editData.id}`, payload);
        }
        alert("Data berhasil diupdate");
      } else if (category === "Download") {
        const fetchAllAttendanceData = async () => {
          try {
            const params = {
              limit: 100,
              page: 1,
            };

            if (formData.startDate) params.start_date = formData.startDate;
            if (formData.end_date) params.end_date = formData.end_date;

            const response = await api.get(
              "/api/academic/letters?include_relations=true",
              { params }
            );

            let attendanceData = [];
            if (Array.isArray(response.data)) {
              attendanceData = response.data;
            } else if (
              response.data.data &&
              Array.isArray(response.data.data)
            ) {
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
                console.warn(
                  `Data presensi pada index ${index} tidak valid:`,
                  item
                );
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
            if (!ws[titleCell])
              ws[titleCell] = { v: "DATA PRESENSI KELAS", t: "s" };
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

        try {
          const attendanceData = await fetchAllAttendanceData();

          if (attendanceData.length === 0) {
            alert("Tidak ada data presensi untuk didownload");
            return;
          }

          const filename = generateExcelFile(attendanceData);
          alert(
            `File "${filename}" berhasil didownload!\nTotal data: ${attendanceData.length} kelas`
          );
          closeModal();
        } catch (error) {
          console.error("Download error:", error);
          alert("Gagal mendownload data: " + error.message);
        } finally {
          closeModal();
        }
      }
      // closeModal();
      if (category !== "Download") {
        fetchLetters(); // Refresh data
      }
    } catch (error) {
      console.error("Error in modal submit:", error);
      alert(
        "Terjadi kesalahan: " + (error.response?.data?.detail || error.message)
      );
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(parseInt(size));
    setCurrentPage(1);
  };

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
  const handleDownloadFile = (item) => {
    // Create a temporary link element to trigger download
    const link = document.createElement("a");
    link.href = `https://website-sekolahku-be.up.railway.app/public/${item.file_path}`;
    link.download = "template_data_siswa.xlsx";
    link.target = "_blank";

    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Data Klasifikasi Surat</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleDownload}>
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button className="gap-2" onClick={handleTambahData}>
            <Plus className="h-4 w-4" />
            Tambah Data
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Select
              value={pageSize.toString()}
              onValueChange={handlePageSizeChange}
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

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari Nomor Surat..."
                className="pl-10 w-64"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">NO</TableHead>
                <TableHead className="font-bold">NO SURAT</TableHead>
                <TableHead className="font-bold">JUDUL</TableHead>
                <TableHead className="font-bold">DESKRIPSI</TableHead>
                <TableHead className="font-bold">PENGIRIM</TableHead>
                <TableHead className="font-bold">PENERIMA</TableHead>
                <TableHead className="font-bold">JENIS SURAT</TableHead>
                <TableHead className="font-bold">DIBUAT PADA</TableHead>
                <TableHead className="font-bold">AKSI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : letters.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Tidak ada data
                  </TableCell>
                </TableRow>
              ) : (
                letters.map((item, index) => (
                  <TableRow key={item.id || item._id}>
                    <TableCell>
                      {(currentPage - 1) * pageSize + index + 1}
                    </TableCell>
                    <TableCell>{item.letter_number}</TableCell>
                    <TableCell>{item.title || "-"}</TableCell>
                    <TableCell>{item.description || "-"}</TableCell>
                    <TableCell>{item.sender || "-"}</TableCell>
                    <TableCell>{item.recipient || "-"}</TableCell>
                    <TableCell>
                      {item.letter_type == "incoming"
                        ? "Surat Masuk"
                        : "Surat Keluar"}
                    </TableCell>
                    <TableCell>
                      {item.date_sent?.toLocaleString().split("T")[0]}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDownloadFile(item)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDelete(item.id)}
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
            <div className="text-sm text-muted-foreground">
              {pagination.total_items > 0
                ? `Showing ${(currentPage - 1) * pageSize + 1} to ${Math.min(
                    currentPage * pageSize,
                    pagination.total_items
                  )} of ${pagination.total_items} entries`
                : "No entries found"}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.has_prev_page}
                onClick={() => handlePageChange(1)}
              >
                ‹‹
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.has_prev_page}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                ‹
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
                disabled={!pagination.has_next_page}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                ›
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.has_next_page}
                onClick={() => handlePageChange(pagination.total_pages)}
              >
                ››
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
        <DaftarSurvei
          text={modalText}
          category={category}
          onClose={closeModal}
          onSubmit={handleModalSubmit}
          editData={editData}
        />
      </Modal>
    </div>
  );
}
