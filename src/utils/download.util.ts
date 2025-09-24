// download.util.ts
import api from "@/utils/axios";

/**
 * Download Excel file from backend
 * @param apiName string - the endpoint name for generating the Excel file
 * @param query object - key/value pairs to send as query parameters
 */
export const downloadExcel = async (
  apiName: string,
  query?: Record<string, any>
) => {
  try {
    // Build query string from object
    const queryString = query
      ? "?" +
        Object.entries(query)
          .map(
            ([key, value]) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
          )
          .join("&")
      : "";

    // Call backend API
    const response = await api.get(
      `/api/generate-excel/${apiName}${queryString}`
    );

    const fileName = response.data.file;
    if (!fileName) throw new Error("File not found in response");

    const downloadUrl = `https://website-sekolahku-be.up.railway.app/${fileName}`;

    // Trigger browser download
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName.split("/").pop(); // only file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Download error:", error);
    throw new Error("Gagal mengunduh data");
  }
};
