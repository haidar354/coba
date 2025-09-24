import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import api from "@/utils/axios";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  Upload,
  Download,
  Plus,
  Edit,
  Trash2,
  Search,
} from "lucide-react";

interface AcademicYear {
  id: number;
  year: string;
  is_active: boolean;
}

interface Survey {
  id: number;
  title: string;
  description: string | null;
  id_academic_year: number;
  created_at: string;
  updated_at: string;
  academic_year: AcademicYear;
}

interface FormData {
  title: string;
  description: string;
  id_academic_year: string;
}

interface Pagination {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
  has_next_page: boolean;
  has_prev_page: boolean;
}

const DaftarSurvei = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const { toast } = useToast();

  // Form states
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    id_academic_year: "",
  });

  // Fetch academic years
  const fetchAcademicYears = useCallback(async () => {
    try {
      const response = await api.get("/api/academic/years", {
        params: { limit: 100 },
      });
      setAcademicYears(response.data || []);
    } catch (error) {
      console.error("Error fetching academic years:", error);
    }
  }, []);

  // Fetch surveys
  const fetchSurveys = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      const response = await api.get("/api/academic/surveys", { params });

      setSurveys(response.data || []);

      if (response.headers["x-pagination"]) {
        setTotalPages(
          JSON.parse(response.headers["x-pagination"]).total_pages || 1
        );
      }
    } catch (error: any) {
      console.error("Error fetching surveys:", error);
      if (error.response?.status !== 404) {
        toast({
          title: "Error",
          description: "Gagal memuat data survey",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm, toast]);

  useEffect(() => {
    fetchAcademicYears();
  }, [fetchAcademicYears]);

  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  // Handle search with debounce
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (searchTerm !== "") {
      timeoutId = setTimeout(() => {
        setCurrentPage(1);
        fetchSurveys();
        setItemsPerPage(100);
      }, 500);
    }

    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchSurveys]);

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      id_academic_year: "",
    });
  };

  // Handle create survey
  const handleCreateSurvey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Judul survey harus diisi",
        variant: "destructive",
      });
      return;
    }

    if (!formData.id_academic_year) {
      toast({
        title: "Error",
        description: "Tahun akademik harus dipilih",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        title: formData.title,
        description: formData.description || null,
        id_academic_year: parseInt(formData.id_academic_year),
      };

      await api.post("/api/academic/surveys", payload);

      toast({
        title: "Berhasil",
        description: "Survey berhasil dibuat",
      });

      setIsCreateModalOpen(false);
      resetForm();
      fetchSurveys();
    } catch (error: any) {
      console.error("Error creating survey:", error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Gagal membuat survey",
        variant: "destructive",
      });
    }
  };

  // Handle edit survey
  const handleEditSurvey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSurvey) return;

    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Judul survey harus diisi",
        variant: "destructive",
      });
      return;
    }

    if (!formData.id_academic_year) {
      toast({
        title: "Error",
        description: "Tahun akademik harus dipilih",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        title: formData.title,
        description: formData.description || null,
        id_academic_year: parseInt(formData.id_academic_year),
      };

      await api.put(`/api/academic/surveys/${selectedSurvey.id}`, payload);

      toast({
        title: "Berhasil",
        description: "Survey berhasil diupdate",
      });

      setIsEditModalOpen(false);
      resetForm();
      setSelectedSurvey(null);
      fetchSurveys();
    } catch (error: any) {
      console.error("Error updating survey:", error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Gagal mengupdate survey",
        variant: "destructive",
      });
    }
  };

  // Handle delete survey
  const handleDeleteSurvey = async (survey: Survey) => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus survey "${survey.title}"?`
      )
    ) {
      try {
        await api.delete(`/api/academic/surveys/${survey.id}`);

        toast({
          title: "Berhasil",
          description: "Survey berhasil dihapus",
        });

        fetchSurveys();
      } catch (error: any) {
        console.error("Error deleting survey:", error);
        toast({
          title: "Error",
          description: error.response?.data?.detail || "Gagal menghapus survey",
          variant: "destructive",
        });
      }
    }
  };

  // Handle file upload
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: false,
  });

  // Handle upload surveys from XLSX
  const handleUploadSurveys = async () => {
    if (!uploadFile) {
      toast({
        title: "Error",
        description: "Pilih file Excel terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      // Note: Based on the API structure, you might need to implement XLSX upload endpoint
      // For now, this is a placeholder - you may need to parse XLSX client-side or create a new endpoint
      const handleUpload = async () => {
        setLoading(true);

        try {
          const formData = new FormData();
          formData.append("file", uploadFile);
          formData.append("folder_name", "data/survey");

          const response = await api.post("/api/upload/excel", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Accept: "application/json",
              "X-Requested-With": "XMLHttpRequest",
            },
          });

          if (response.status === 200) {
            console.log("Response data:", response);
            const responseada = await api.post(
              "/api/academic/excel/surveys",
              response.data
            );
            if (responseada.status === 201) {
              alert(`Upload berhasil!`);
              toast({
                title: "Berhasil",
                description: "Survey berhasil diupload",
              });
            }
          }
        } catch (error) {
          if (error.response) {
            alert("Upload gagal: " + error.response.data.message);
            toast({
              title: "Gagal",
              description: "Survey gagal diupload",
            });
          } else {
            alert("Error: " + error.message);
          }
        } finally {
          setLoading(false);
        }
      };
      toast({
        title: "Berhasil",
        description: "Survey berhasil diupload",
      });
      
      handleUpload();
      setIsUploadModalOpen(false);
      setUploadFile(null);
    } catch (error: any) {
      console.error("Error uploading surveys:", error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Gagal mengupload file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };
const handleDownload = () => {
  // Create a temporary link element to trigger download
  const link = document.createElement("a");
  link.href = "/tu/file_template/Template%20Survey.xlsx";
  link.download = "template_survey.xlsx";
  link.target = "_blank";

  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  // Handle download surveys
  const handleDownloadSurveys = async () => {
    setDownloading(true);
    const fetchAllAcademicSurveysData = async () => {
      try {
        const params = {
          limit: 100,
          page: 1,
        };

        const response = await api.get("/api/academic/surveys", { params });

        let surveysData = [];
        if (Array.isArray(response.data)) {
          surveysData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          surveysData = response.data.data;
        }

        return surveysData;
      } catch (error) {
        console.error("Error fetching academic surveys data:", error);
        throw error;
      }
    };

    const generateExcelFile = (surveysData) => {
      try {
        if (
          !surveysData ||
          !Array.isArray(surveysData) ||
          surveysData.length === 0
        ) {
          throw new Error("Data survey akademik tidak valid atau kosong");
        }

        if (!window.XLSX) {
          throw new Error(
            "Library XLSX tidak tersedia. Pastikan SheetJS sudah dimuat."
          );
        }

        const wb = window.XLSX.utils.book_new();

        const excelData = surveysData.map((item, index) => {
          if (!item || typeof item !== "object") {
            console.warn(`Data survey pada index ${index} tidak valid:`, item);
            return {
              NO: index + 1,
              ID: "Data tidak valid",
              JUDUL: "N/A",
              DESKRIPSI: "N/A",
              ID_TAHUN_AJARAN: "N/A",
              TAHUN_AJARAN: "N/A",
              STATUS_AKTIF: "N/A",
              TANGGAL_DIBUAT: "N/A",
              TANGGAL_DIUPDATE: "N/A",
            };
          }

          return {
            NO: index + 1,
            ID: item.id || "N/A",
            JUDUL: item.title || "N/A",
            DESKRIPSI: item.description || "N/A",
            ID_TAHUN_AJARAN: item.id_academic_year || "N/A",
            TAHUN_AJARAN: item.academic_year?.year || "N/A",
            STATUS_AKTIF: item.academic_year?.is_active ? "Ya" : "Tidak",
            TANGGAL_DIBUAT: item.created_at
              ? new Date(item.created_at).toLocaleString("id-ID")
              : "N/A",
            TANGGAL_DIUPDATE: item.updated_at
              ? new Date(item.updated_at).toLocaleString("id-ID")
              : "N/A",
          };
        });

        const ws = window.XLSX.utils.json_to_sheet([]);

        const colWidths = [
          { wch: 5 }, // NO
          { wch: 8 }, // ID
          { wch: 30 }, // JUDUL
          { wch: 40 }, // DESKRIPSI
          { wch: 15 }, // ID_TAHUN_AJARAN
          { wch: 15 }, // TAHUN_AJARAN
          { wch: 12 }, // STATUS_AKTIF
          { wch: 20 }, // TANGGAL_DIBUAT
          { wch: 20 }, // TANGGAL_DIUPDATE
        ];
        ws["!cols"] = colWidths;

        // Add title
        window.XLSX.utils.sheet_add_aoa(ws, [["DATA SURVEY AKADEMIK"]], {
          origin: "A1",
        });
        window.XLSX.utils.sheet_add_aoa(ws, [[""]], { origin: "A2" });

        const headers = [
          "NO",
          "ID",
          "JUDUL",
          "DESKRIPSI",
          "ID TAHUN AJARAN",
          "TAHUN AJARAN",
          "STATUS AKTIF",
          "TANGGAL DIBUAT",
          "TANGGAL DIUPDATE",
        ];
        window.XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A3" });

        const dataRows = excelData.map((row) => [
          row.NO,
          row.ID,
          row.JUDUL,
          row.DESKRIPSI,
          row.ID_TAHUN_AJARAN,
          row.TAHUN_AJARAN,
          row.STATUS_AKTIF,
          row.TANGGAL_DIBUAT,
          row.TANGGAL_DIUPDATE,
        ]);

        window.XLSX.utils.sheet_add_aoa(ws, dataRows, { origin: "A4" });

        const range = window.XLSX.utils.encode_range({
          s: { c: 0, r: 0 },
          e: { c: 8, r: 2 + excelData.length },
        });
        ws["!ref"] = range;

        // Merge title cells
        ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }];

        // Style title
        const titleCell = "A1";
        if (!ws[titleCell])
          ws[titleCell] = { v: "DATA SURVEY AKADEMIK", t: "s" };
        ws[titleCell].s = {
          font: { bold: true, sz: 16 },
          alignment: { horizontal: "center", vertical: "center" },
          fill: { fgColor: { rgb: "CCCCCC" } },
        };

        window.XLSX.utils.book_append_sheet(wb, ws, "Data Survey Akademik");

        const now = new Date();
        const dateStr = `${now.getFullYear()}-${String(
          now.getMonth() + 1
        ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
        const filename = `Data_Survey_Akademik_${dateStr}.xlsx`;

        window.XLSX.writeFile(wb, filename);
        return filename;
      } catch (error) {
        console.error("Detailed error in generateExcelFile:", error);
        throw new Error("Gagal membuat file Excel: " + error.message);
      }
    };

    try {
      setDownloading(true);
      const surveysData = await fetchAllAcademicSurveysData();

      if (surveysData.length === 0) {
        alert("Tidak ada data survey akademik untuk didownload");
        return;
      }

      const filename = generateExcelFile(surveysData);
      alert(
        `File "${filename}" berhasil didownload!\nTotal data: ${surveysData.length} survey`
      );
      setDownloading(false);
    } catch (error) {
      console.error("Download error:", error);
      alert("Gagal mendownload data: " + error.message);
    } finally {
      setDownloading(false);
    }
  };

  // Open edit modal
  const openEditModal = (survey: Survey) => {
    setSelectedSurvey(survey);
    setFormData({
      title: survey.title,
      description: survey.description || "",
      id_academic_year: survey.id_academic_year.toString(),
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Daftar Survey</h1>
        <div className="flex flex-wrap gap-2">
          <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload
              </Button>
            </DialogTrigger>
          </Dialog>

          <Button
            onClick={handleDownloadSurveys}
            disabled={downloading}
            variant="outline"
            className="flex items-center gap-2"
          >
            {downloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Download
          </Button>

          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Tambah Survey
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Search and Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-500" />
              <Input
                placeholder="Cari survey..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="itemsPerPage">Items per page:</Label>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(parseInt(value));
                  setCurrentPage(1);
                }}
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Surveys Table */}
      <Card>
        <CardHeader>
          <CardTitle>Data Survey</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Judul</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Tahun Akademik</TableHead>
                    <TableHead>Dibuat</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {surveys.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Tidak ada data survey
                      </TableCell>
                    </TableRow>
                  ) : (
                    surveys.map((survey, index) => (
                      <TableRow key={survey.id}>
                        <TableCell>
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </TableCell>
                        <TableCell className="font-medium">
                          {survey.title}
                        </TableCell>
                        <TableCell>{survey.description || "-"}</TableCell>
                        <TableCell>
                          {survey.academic_year?.year || "-"}
                        </TableCell>
                        <TableCell>
                          {new Date(survey.created_at).toLocaleDateString(
                            "id-ID"
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditModal(survey)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteSurvey(survey)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Create Survey Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Survey Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSurvey} className="space-y-4">
            <div>
              <Label htmlFor="title">Judul Survey *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Masukkan judul survey"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Masukkan deskripsi survey"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="academic_year">Tahun Akademik *</Label>
              <Select
                value={formData.id_academic_year}
                onValueChange={(value) =>
                  setFormData({ ...formData, id_academic_year: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tahun akademik" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year) => (
                    <SelectItem key={year.id} value={year.id.toString()}>
                      {year.year} {year.is_active ? "(Aktif)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetForm();
                }}
              >
                Batal
              </Button>
              <Button type="submit">Simpan</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Survey Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Survey</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSurvey} className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Judul Survey *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Masukkan judul survey"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Deskripsi</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Masukkan deskripsi survey"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-academic_year">Tahun Akademik *</Label>
              <Select
                value={formData.id_academic_year}
                onValueChange={(value) =>
                  setFormData({ ...formData, id_academic_year: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tahun akademik" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year) => (
                    <SelectItem key={year.id} value={year.id.toString()}>
                      {year.year} {year.is_active ? "(Aktif)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditModalOpen(false);
                  resetForm();
                  setSelectedSurvey(null);
                }}
              >
                Batal
              </Button>
              <Button type="submit">Update</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Upload XLSX Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Survey dari Excel</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              {uploadFile ? (
                <p className="text-sm text-green-600">
                  File dipilih: {uploadFile.name}
                </p>
              ) : isDragActive ? (
                <p className="text-sm text-blue-600">
                  Drop file Excel di sini...
                </p>
              ) : (
                <div>
                  <p className="text-sm text-gray-600">
                    Drag & drop file Excel di sini, atau klik untuk memilih
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Mendukung format .xlsx dan .xls
                  </p>
                </div>
              )}
            </div>

            <div className="text-sm text-gray-600">
              <p>
                <strong>Template Excel :</strong>
              </p>
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
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setUploadFile(null);
                }}
              >
                Batal
              </Button>
              <Button
                onClick={handleUploadSurveys}
                disabled={!uploadFile || uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DaftarSurvei;
