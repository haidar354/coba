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

// Komponen untuk konten modal
const DaftarSurvei = ({
  text,
  category,
  onClose,
  onSubmit,
  editData = null,
}) => {
  const [formData, setFormData] = useState({
    title: editData?.title || "",
    description: editData?.description || "",
    letter_number: editData?.letter_number || "",
    format: "excel",
    startDate: "",
    endDate: "",
    file: null,
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
              Format File
            </label>
            <Select
              value={formData.format}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, format: value }))
              }
            >
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
              placeholder="Masukkan nama klasifikasi"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Nomor Surat</label>
            <Input
              placeholder="Masukkan nama klasifikasi"
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
          <div>
            <label className="block text-sm font-medium mb-2">Deskripsi</label>
            <textarea
              className="w-full min-h-[120px] p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan deskripsi"
              value={formData.description   }
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description   : e.target.value }))
              }
            />
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
      setPagination(JSON.parse(response.headers["x-pagination"] )|| {});
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

  const handleUpload = () => {
    openModal(
      "Upload Data Klasifikasi Surat",
      "Upload file data klasifikasi surat dalam format Excel atau CSV",
      "Upload"
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
        await api.post("/api/academic/letters", {
          nama: formData.nama,
          deskripsi: formData.deskripsi,
        });
        alert("Data berhasil ditambahkan");
      } else if (category === "Edit Data") {
        await api.put(`/api/academic/letters/${editData.id}`, {
          nama: formData.nama,
          deskripsi: formData.deskripsi,
        });
        alert("Data berhasil diupdate");
      } else if (category === "Upload") {
        const uploadFormData = new FormData();
        uploadFormData.append("file", formData.file);

        await api.post("/api/academic/letters/upload", uploadFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("File berhasil diupload");
      } else if (category === "Download") {
        const params = {
          format: formData.format,
        };

        if (formData.startDate && formData.endDate) {
          params.start_date = formData.startDate;
          params.end_date = formData.endDate;
        }

        const response = await api.get("/api/academic/letters/download", {
          params,
          responseType: "blob",
        });

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `klasifikasi_surat.${formData.format === "excel" ? "xlsx" : "csv"}`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        alert("File berhasil didownload");
      }

      closeModal();
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

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Data Klasifikasi Surat</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleUpload}>
            <Upload className="h-4 w-4" />
            Upload
          </Button>
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
                placeholder="Cari..."
                className="pl-10 w-64"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NO</TableHead>
                <TableHead>NO SURAT</TableHead>
                <TableHead>JUDUL</TableHead>
                <TableHead>DESKRIPSI</TableHead>
                <TableHead>DIBUAT PADA</TableHead>
                <TableHead>AKSI</TableHead>
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
                    <TableCell>
                      {item.date_sent?.toLocaleString().split("T")[0]}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
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
              <Button
                variant="outline"
                size="sm"
                className="bg-primary text-primary-foreground"
              >
                {currentPage}
              </Button>
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
