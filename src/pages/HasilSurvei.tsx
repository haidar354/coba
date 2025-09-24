import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
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
import { useParams } from "react-router-dom";

interface Survey {
  id: number;
  title: string;
  description: string;
  id_academic_year: number;
  created_at: string;
  updated_at: string;
  academic_year?: {
    id: number;
    year: string;
    is_active: boolean;
  };
}

interface SurveyResponse {
  id: number;
  id_survey: number;
  id_survey_question: number;
  id_survey_surveyor: number;
  score: number;
  created_at: string;
  updated_at: string;
  survey: {
    id: number;
    title: string;
    description: string;
  };
  survey_question: {
    id: number;
    question: string;
    description: string;
  };
  survey_surveyor: {
    id: number;
    name: string;
    organization: string;
    feedback: string;
  };
}

interface SurveyQuestion {
  id: number;
  question: string;
  id_survey: number;
}

interface SurveySurveyor {
  id: number;
  name: string;
  organization: string;
  id_survey: number;
}

const HasilSurvey = () => {
  const { id } = useParams<{ id?: string }>();
  const [idSurvey, setIdSurvey] = useState<string | undefined>(undefined);
  const [surveyResponses, setSurveyResponses] = useState<SurveyResponse[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [surveyQuestions, setSurveyQuestions] = useState<SurveyQuestion[]>([]);
  const [surveySurveyors, setSurveySurveyors] = useState<SurveySurveyor[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedResponse, setSelectedResponse] =
    useState<SurveyResponse | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      setIdSurvey(id);
      console.log(`Detail Survey ID: ${id}`);
    }
  }, [id]);

  // Form states
  const [formData, setFormData] = useState({
    id_survey: "",
    id_survey_question: "",
    id_survey_surveyor: "",
    score: "",
  });

  // Fetch survey responses
  const fetchSurveyResponses = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (idSurvey) {
        params.id_survey = idSurvey;
      }

      if (searchTerm.trim()) {
        // Since API doesn't have search for responses, we'll filter by surveyor name
        params.title = searchTerm;
      }

      const response = await api.get("/api/academic/responses", { params });

      setSurveyResponses(response.data || []);
      setTotalPages(
        JSON.parse(response.headers["x-pagination"]).total_pages || 1
      );
    } catch (error: any) {
      console.error("Error fetching survey responses:", error);
      if (searchTerm.trim().length > 2) {
        toast({
          title: "Error",
          description: "Gagal memuat data jawaban survey",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm, idSurvey, toast]);

  // Fetch surveys for dropdown
  const fetchSurveys = useCallback(async () => {
    try {
      const response = await api.get("/api/academic/surveys", {
        params: { limit: 100 },
      });
      setSurveys(response.data || []);
    } catch (error) {
      console.error("Error fetching surveys:", error);
    }
  }, []);

  // Fetch survey questions for dropdown
  const fetchSurveyQuestions = useCallback(async (surveyId?: string) => {
    try {
      const params: any = { limit: 100 };
      if (surveyId) {
        params.id_survey = surveyId;
      }
      const response = await api.get("/api/academic/questions", { params });
      setSurveyQuestions(response.data || []);
    } catch (error) {
      console.error("Error fetching survey questions:", error);
    }
  }, []);

  // Fetch survey surveyors for dropdown
  const fetchSurveySurveyors = useCallback(async (surveyId?: string) => {
    try {
      const params: any = { limit: 100 };
      if (surveyId) {
        params.id_survey = surveyId;
      }
      const response = await api.get("/api/academic/surveyors", { params });
      setSurveySurveyors(response.data || []);
    } catch (error) {
      console.error("Error fetching survey surveyors:", error);
    }
  }, []);

  useEffect(() => {
    fetchSurveyResponses();
  }, [fetchSurveyResponses]);

  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  useEffect(() => {
    if (formData.id_survey || idSurvey) {
      fetchSurveyQuestions(formData.id_survey || idSurvey);
      fetchSurveySurveyors(formData.id_survey || idSurvey);
    }
  }, [
    formData.id_survey,
    idSurvey,
    fetchSurveyQuestions,
    fetchSurveySurveyors,
  ]);

  // Handle search with debounce
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (searchTerm.length > 0 && searchTerm.trim().length < 3) {
      timeoutId = setTimeout(() => {
        setCurrentPage(1);
        fetchSurveyResponses();
      }, 500);
    }

    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchSurveyResponses]);

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

  // Reset form
  const resetForm = () => {
    setFormData({
      id_survey: idSurvey || "",
      id_survey_question: "",
      id_survey_surveyor: "",
      score: "",
    });
  };

  // Handle create survey response
  const handleCreateResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.id_survey ||
      !formData.id_survey_question ||
      !formData.id_survey_surveyor ||
      !formData.score
    ) {
      toast({
        title: "Error",
        description: "Semua field harus diisi",
        variant: "destructive",
      });
      return;
    }

    try {
      const responseData = {
        id_survey: parseInt(formData.id_survey),
        id_survey_question: parseInt(formData.id_survey_question),
        id_survey_surveyor: parseInt(formData.id_survey_surveyor),
        score: parseInt(formData.score),
      };

      await api.post("/api/academic/responses", responseData);
      toast({
        title: "Berhasil",
        description: "Jawaban survey berhasil dibuat",
      });
      setIsCreateModalOpen(false);
      resetForm();
      fetchSurveyResponses();
    } catch (error: any) {
      console.error("Error creating survey response:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Gagal membuat jawaban survey",
        variant: "destructive",
      });
    }
  };

  // Handle edit survey response
  const handleEditResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResponse || !formData.score) {
      toast({
        title: "Error",
        description: "Skor harus diisi",
        variant: "destructive",
      });
      return;
    }

    try {
      const responseData = {
        score: parseInt(formData.score),
      };

      await api.put(
        `/api/academic/responses/${selectedResponse.id}`,
        responseData
      );
      toast({
        title: "Berhasil",
        description: "Jawaban survey berhasil diupdate",
      });
      setIsEditModalOpen(false);
      resetForm();
      setSelectedResponse(null);
      fetchSurveyResponses();
    } catch (error: any) {
      console.error("Error updating survey response:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Gagal mengupdate jawaban survey",
        variant: "destructive",
      });
    }
  };

  // Handle delete survey response
  const handleDeleteResponse = async (response: SurveyResponse) => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus jawaban untuk pertanyaan "${response.survey_question.question}"?`
      )
    ) {
      try {
        await api.delete(`/api/academic/responses/${response.id}`);
        toast({
          title: "Berhasil",
          description: "Jawaban survey berhasil dihapus",
        });
        fetchSurveyResponses();
      } catch (error: any) {
        console.error("Error deleting survey response:", error);
        toast({
          title: "Error",
          description:
            error.response?.data?.message || "Gagal menghapus jawaban survey",
          variant: "destructive",
        });
      }
    }
  };

  // Handle upload responses from XLSX
  const handleUploadResponses = async () => {
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
      formData.append("folder_name", "data/hasil_survey");

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
          "/api/academic/excel/survey_questions",
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
      setUploading(false);
    }
  };

  // Handle download responses
  const handleDownloadResponses = async () => {
    const fetchAllAcademicResponsesData = async () => {
      try {
        const params = {
          limit: 100,
          page: 1,
        };

        const response = await api.get("/api/academic/responses", { params });

        let responsesData = [];
        if (Array.isArray(response.data)) {
          responsesData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          responsesData = response.data.data;
        }

        return responsesData;
      } catch (error) {
        console.error("Error fetching academic responses data:", error);
        throw error;
      }
    };

    const generateExcelFile = (responsesData) => {
      try {
        if (
          !responsesData ||
          !Array.isArray(responsesData) ||
          responsesData.length === 0
        ) {
          throw new Error("Data respon akademik tidak valid atau kosong");
        }

        if (!window.XLSX) {
          throw new Error(
            "Library XLSX tidak tersedia. Pastikan SheetJS sudah dimuat."
          );
        }

        const wb = window.XLSX.utils.book_new();

        const excelData = responsesData.map((item, index) => {
          if (!item || typeof item !== "object") {
            console.warn(`Data respon pada index ${index} tidak valid:`, item);
            return {
              NO: index + 1,
              ID: "Data tidak valid",
              ID_SURVEY: "N/A",
              JUDUL_SURVEY: "N/A",
              DESKRIPSI_SURVEY: "N/A",
              ID_PERTANYAAN: "N/A",
              PERTANYAAN: "N/A",
              DESKRIPSI_PERTANYAAN: "N/A",
              ID_SURVEYOR: "N/A",
              NAMA_SURVEYOR: "N/A",
              ORGANISASI: "N/A",
              FEEDBACK: "N/A",
              SKOR: "N/A",
              TANGGAL_DIBUAT: "N/A",
              TANGGAL_DIUPDATE: "N/A",
            };
          }

          return {
            NO: index + 1,
            ID: item.id || "N/A",
            ID_SURVEY: item.id_survey || "N/A",
            JUDUL_SURVEY: item.survey?.title || "N/A",
            DESKRIPSI_SURVEY: item.survey?.description || "N/A",
            ID_PERTANYAAN: item.id_survey_question || "N/A",
            PERTANYAAN: item.survey_question?.question || "N/A",
            DESKRIPSI_PERTANYAAN: item.survey_question?.description || "N/A",
            ID_SURVEYOR: item.id_survey_surveyor || "N/A",
            NAMA_SURVEYOR: item.survey_surveyor?.name || "N/A",
            ORGANISASI: item.survey_surveyor?.organization || "N/A",
            FEEDBACK: item.survey_surveyor?.feedback || "N/A",
            SKOR: item.score || "N/A",
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
          { wch: 12 }, // ID_SURVEY
          { wch: 25 }, // JUDUL_SURVEY
          { wch: 40 }, // DESKRIPSI_SURVEY
          { wch: 12 }, // ID_PERTANYAAN
          { wch: 35 }, // PERTANYAAN
          { wch: 25 }, // DESKRIPSI_PERTANYAAN
          { wch: 12 }, // ID_SURVEYOR
          { wch: 20 }, // NAMA_SURVEYOR
          { wch: 20 }, // ORGANISASI
          { wch: 25 }, // FEEDBACK
          { wch: 8 }, // SKOR
          { wch: 20 }, // TANGGAL_DIBUAT
          { wch: 20 }, // TANGGAL_DIUPDATE
        ];
        ws["!cols"] = colWidths;

        // Add title
        window.XLSX.utils.sheet_add_aoa(ws, [["DATA RESPON AKADEMIK"]], {
          origin: "A1",
        });
        window.XLSX.utils.sheet_add_aoa(ws, [[""]], { origin: "A2" });

        const headers = [
          "NO",
          "ID",
          "ID SURVEY",
          "JUDUL SURVEY",
          "DESKRIPSI SURVEY",
          "ID PERTANYAAN",
          "PERTANYAAN",
          "DESKRIPSI PERTANYAAN",
          "ID SURVEYOR",
          "NAMA SURVEYOR",
          "ORGANISASI",
          "FEEDBACK",
          "SKOR",
          "TANGGAL DIBUAT",
          "TANGGAL DIUPDATE",
        ];
        window.XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A3" });

        const dataRows = excelData.map((row) => [
          row.NO,
          row.ID,
          row.ID_SURVEY,
          row.JUDUL_SURVEY,
          row.DESKRIPSI_SURVEY,
          row.ID_PERTANYAAN,
          row.PERTANYAAN,
          row.DESKRIPSI_PERTANYAAN,
          row.ID_SURVEYOR,
          row.NAMA_SURVEYOR,
          row.ORGANISASI,
          row.FEEDBACK,
          row.SKOR,
          row.TANGGAL_DIBUAT,
          row.TANGGAL_DIUPDATE,
        ]);

        window.XLSX.utils.sheet_add_aoa(ws, dataRows, { origin: "A4" });

        const range = window.XLSX.utils.encode_range({
          s: { c: 0, r: 0 },
          e: { c: 14, r: 2 + excelData.length },
        });
        ws["!ref"] = range;

        // Merge title cells
        ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 14 } }];

        // Style title
        const titleCell = "A1";
        if (!ws[titleCell])
          ws[titleCell] = { v: "DATA RESPON AKADEMIK", t: "s" };
        ws[titleCell].s = {
          font: { bold: true, sz: 16 },
          alignment: { horizontal: "center", vertical: "center" },
          fill: { fgColor: { rgb: "CCCCCC" } },
        };

        window.XLSX.utils.book_append_sheet(wb, ws, "Data Respon Akademik");

        const now = new Date();
        const dateStr = `${now.getFullYear()}-${String(
          now.getMonth() + 1
        ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
        const filename = `Data_Respon_Akademik_${dateStr}.xlsx`;

        window.XLSX.writeFile(wb, filename);
        return filename;
      } catch (error) {
        console.error("Detailed error in generateExcelFile:", error);
        throw new Error("Gagal membuat file Excel: " + error.message);
      }
    };

    try {
      const responsesData = await fetchAllAcademicResponsesData();

      if (responsesData.length === 0) {
        alert("Tidak ada data respon akademik untuk didownload");
        return;
      }

      const filename = generateExcelFile(responsesData);
      alert(
        `File "${filename}" berhasil didownload!\nTotal data: ${responsesData.length} respon`
      );
    } catch (error) {
      console.error("Download error:", error);
      alert("Gagal mendownload data: " + error.message);
    }
  };

  // Open edit modal
  const openEditModal = (response: SurveyResponse) => {
    setSelectedResponse(response);
    setFormData({
      id_survey: response.id_survey.toString(),
      id_survey_question: response.id_survey_question.toString(),
      id_survey_surveyor: response.id_survey_surveyor.toString(),
      score: response.score.toString(),
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Daftar Jawaban Survey</h1>
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
            onClick={handleDownloadResponses}
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
                Tambah Jawaban
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Search and Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* <div className="flex items-center gap-2 flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-500" />
              <Input
                placeholder="Cari nama responden..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div> */}

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

      {/* Survey Responses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Data Jawaban Survey</CardTitle>
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
                    <TableHead className="text-center">No</TableHead>
                    <TableHead className="text-center">Judul Survey</TableHead>
                    <TableHead className="text-center">Pertanyaan</TableHead>
                    <TableHead className="text-center">Responden</TableHead>
                    <TableHead className="text-center">Organisasi</TableHead>
                    <TableHead className="text-center">Skor</TableHead>
                    <TableHead className="text-center">Dibuat</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {surveyResponses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        Tidak ada data jawaban survey
                      </TableCell>
                    </TableRow>
                  ) : (
                    surveyResponses.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-center">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.survey?.title || "-"}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {item.survey_question?.question || "-"}
                        </TableCell>
                        <TableCell>
                          {item.survey_surveyor?.name || "-"}
                        </TableCell>
                        <TableCell>
                          {item.survey_surveyor?.organization || "-"}
                        </TableCell>
                        <TableCell className="text-center font-semibold">
                          {item.score}
                        </TableCell>
                        <TableCell className="text-center">
                          {new Date(item.created_at).toLocaleDateString(
                            "id-ID"
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 items-center justify-center">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditModal(item)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteResponse(item)}
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

      {/* Create Response Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tambah Jawaban Survey Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateResponse} className="space-y-4">
            <div>
              <Label htmlFor="survey">Survey *</Label>
              <Select
                value={formData.id_survey}
                onValueChange={(value) =>
                  setFormData({ ...formData, id_survey: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Survey" />
                </SelectTrigger>
                <SelectContent>
                  {surveys.map((survey) => (
                    <SelectItem key={survey.id} value={survey.id.toString()}>
                      {survey.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="question">Pertanyaan *</Label>
              <Select
                value={formData.id_survey_question}
                onValueChange={(value) =>
                  setFormData({ ...formData, id_survey_question: value })
                }
                required
                disabled={!formData.id_survey}
              >
                <SelectTrigger>   
                  <SelectValue placeholder="Pilih Pertanyaan" />
                </SelectTrigger>
                <SelectContent>
                  {surveyQuestions.map((question) => (
                    <SelectItem
                      key={question.id}
                      value={question.id.toString()}
                    >
                      {question.question}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="surveyor">Responden *</Label>
              <Select
                value={formData.id_survey_surveyor}
                onValueChange={(value) =>
                  setFormData({ ...formData, id_survey_surveyor: value })
                }
                required
                disabled={!formData.id_survey}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Responden" />
                </SelectTrigger>
                <SelectContent>
                  {surveySurveyors.map((surveyor) => (
                    <SelectItem
                      key={surveyor.id}
                      value={surveyor.id.toString()}
                    >
                      {surveyor.name} - {surveyor.organization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="score">Skor *</Label>
              <Input
                id="score"
                type="number"
                min="1"
                max="5"
                value={formData.score}
                onChange={(e) =>
                  setFormData({ ...formData, score: e.target.value })
                }
                placeholder="Masukkan skor (1-5)"
                required
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

      {/* Edit Response Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Jawaban Survey</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditResponse} className="space-y-4">
            <div>
              <Label htmlFor="edit-score">Skor *</Label>
              <Input
                id="edit-score"
                type="number"
                min="1"
                max="5"
                value={formData.score}
                onChange={(e) =>
                  setFormData({ ...formData, score: e.target.value })
                }
                placeholder="Masukkan skor (1-5)"
                required
              />
            </div>
            <div className="text-sm text-gray-600">
              <p>
                <strong>Survey:</strong> {selectedResponse?.survey?.title}
              </p>
              <p>
                <strong>Pertanyaan:</strong>{" "}
                {selectedResponse?.survey_question?.question}
              </p>
              <p>
                <strong>Responden:</strong>{" "}
                {selectedResponse?.survey_surveyor?.name}
              </p>
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
            <DialogTitle>Upload Jawaban Survey dari Excel</DialogTitle>
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
                  Kolom A: <strong>id_survey</strong> (ID Survey)
                </li>
                <li>
                  Kolom B: <strong>id_survey_question</strong> (ID Pertanyaan)
                </li>
                <li>
                  Kolom C: <strong>id_survey_surveyor</strong> (ID Responden)
                </li>
                <li>
                  Kolom D: <strong>score</strong> (Skor jawaban 1-5)
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
                onClick={handleUploadResponses}
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

export default HasilSurvey;
