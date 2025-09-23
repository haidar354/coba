import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import surveyService from "@/services/surveyService";
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

const DaftarSurvei = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { toast } = useToast();

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    id_academic_year: "",
  });

  // Fetch surveys
  const fetchSurveys = useCallback(async () => {
    setLoading(true);
    try {
      const response = await surveyService.getAllSurveys({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
      });

      setSurveys(response.data || []);
      setTotalPages(JSON.parse(response.headers["x-pagination"]).total_pages || 1);
    } catch (error) {
      if (searchTerm.trim().length > 2) {
        console.error("Error fetching surveys:", error);
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
    fetchSurveys();
  }, [fetchSurveys]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchSurveys();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      id_academic_year: "",
    });
  };

  // Handle create survey
  const handleCreateSurvey = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Judul survey harus diisi",
        variant: "destructive",
      });
      return;
    }

    try {
      await surveyService.createSurvey(formData);
      toast({
        title: "Berhasil",
        description: "Survey berhasil dibuat",
      });
      setIsCreateModalOpen(false);
      resetForm();
      fetchSurveys();
    } catch (error) {
      console.error("Error creating survey:", error);
      toast({
        title: "Error",
        description: "Gagal membuat survey",
        variant: "destructive",
      });
    }
  };

  // Handle edit survey
  const handleEditSurvey = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Judul survey harus diisi",
        variant: "destructive",
      });
      return;
    }

    try {
      await surveyService.updateSurvey(selectedSurvey.id, formData);
      toast({
        title: "Berhasil",
        description: "Survey berhasil diupdate",
      });
      setIsEditModalOpen(false);
      resetForm();
      setSelectedSurvey(null);
      fetchSurveys();
    } catch (error) {
      console.error("Error updating survey:", error);
      toast({
        title: "Error",
        description: "Gagal mengupdate survey",
        variant: "destructive",
      });
    }
  };

  // Handle delete survey
  const handleDeleteSurvey = async (survey) => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus survey "${survey.title}"?`
      )
    ) {
      try {
        await surveyService.deleteSurvey(survey.id);
        toast({
          title: "Berhasil",
          description: "Survey berhasil dihapus",
        });
        fetchSurveys();
      } catch (error) {
        console.error("Error deleting survey:", error);
        toast({
          title: "Error",
          description: "Gagal menghapus survey",
          variant: "destructive",
        });
      }
    }
  };

  // Handle file upload
  const onDrop = useCallback((acceptedFiles) => {
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
      const response = await surveyService.uploadSurveysXLSX(uploadFile);
      toast({
        title: "Berhasil",
        description: response.data.message,
      });
      setIsUploadModalOpen(false);
      setUploadFile(null);
      fetchSurveys();
    } catch (error) {
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

  // Handle download surveys
  const handleDownloadSurveys = async () => {
    try {
      await surveyService.downloadSurveysXLSX({ search: searchTerm });
      toast({
        title: "Berhasil",
        description: "File Excel berhasil didownload",
      });
    } catch (error) {
      console.error("Error downloading surveys:", error);
      toast({
        title: "Error",
        description: "Gagal mendownload file",
        variant: "destructive",
      });
    }
  };

  // Open edit modal
  const openEditModal = (survey) => {
    setSelectedSurvey(survey);
    setFormData({
      title: survey.title,
      description: survey.description || "",
      id_academic_year: survey.id_academic_year || "",
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
                Upload XLSX
              </Button>
            </DialogTrigger>
          </Dialog>

          <Button
            onClick={handleDownloadSurveys}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download XLSX
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
                          {survey.academic_year.year || "-"}
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
              <Label htmlFor="academic_year">ID Tahun Akademik</Label>
              <Input
                id="academic_year"
                value={formData.id_academic_year}
                onChange={(e) =>
                  setFormData({ ...formData, id_academic_year: e.target.value })
                }
                placeholder="Masukkan ID tahun akademik"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
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
              <Label htmlFor="edit-academic_year">ID Tahun Akademik</Label>
              <Input
                id="edit-academic_year"
                value={formData.id_academic_year}
                onChange={(e) =>
                  setFormData({ ...formData, id_academic_year: e.target.value })
                }
                placeholder="Masukkan ID tahun akademik"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
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
                <strong>Format Excel yang diperlukan:</strong>
              </p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>
                  Kolom <strong>title</strong> (wajib): Judul survey
                </li>
                <li>
                  Kolom <strong>description</strong> (opsional): Deskripsi
                  survey
                </li>
                <li>
                  Kolom <strong>id_academic_year</strong> (opsional): ID tahun
                  akademik
                </li>
              </ul>
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
