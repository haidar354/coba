import api from "@/utils/axios";

export const surveyService = {
  // Get all surveys with pagination and search
  getAllSurveys: async (params = {}) => {
    const { page = 1, limit = 10, search = "", id_academic_year = "" } = params;

    // Siapkan parameter untuk dikirim ke API
    const queryParams = { page, limit, id_academic_year };

    // Tambahkan 'search' hanya jika panjangnya > 1
    let response;
    if (search.trim().length > 2) {
      queryParams.search = search.trim();
      response = await api.get("/api/academic/surveys", {
        params: queryParams,
      });
    } else if (search.trim().length === 0) {
      response = await api.get("/api/academic/surveys", {
        params: queryParams,
      });
    }

    // Selalu panggil API, baik ada search atau tidak

    return response;
  },

  // Get survey by ID
  getSurveyById: async (id) => {
    const response = await api.get(`/api/academic/surveys/${id}`);
    return response;
  },

  // Create new survey
  createSurvey: async (surveyData) => {
    const response = await api.post("/api/academic/surveys", surveyData);
    return response;
  },

  // Update survey
  updateSurvey: async (id, surveyData) => {
    const response = await api.put(`/api/academic/surveys/${id}`, surveyData);
    return response;
  },

  // Delete survey
  deleteSurvey: async (id) => {
    const response = await api.delete(`/api/academic/surveys/${id}`);
    return response;
  },

  // Upload XLSX file
  uploadSurveysXLSX: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/api/academic/surveys/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  },

  // Download surveys as XLSX
  downloadSurveysXLSX: async (params = {}) => {
    const { search = "", id_academic_year = "" } = params;
    const response = await api.get("/api/academic/surveys/download/xlsx", {
      params: { search, id_academic_year },
      responseType: "blob",
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "surveys_export.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return response;
  },
};

export default surveyService;
