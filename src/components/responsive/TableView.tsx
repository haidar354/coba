import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  FileText,
  Clock,
  XCircle,
  X,
  Search,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Star,
  Users,
  User,
} from "lucide-react";
import api from "@/utils/axios";

const DaftarSurvei = ({ text, category, type, typeGet, info }) => {
  const [status, setStatus] = useState(type || "hadir");
  const [classSelect, setClassSelect] = useState(info.classInfo?.id || "");
  const [search, setSearch] = useState("");
  const [dataSiswa, setDataSiswa] = useState([]);
  const [dataClass, setDataClass] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const d = new Date();
        d.setDate(d.getDate() - 1);
        const dateNow = d.toISOString().split("T")[0];
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await api.get(
          `/api/classes/with-departments?limit=60&start_date=${dateNow}&end_date=${dateNow}`,
          config
        );
        setDataClass(response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        const dateNow = d.toISOString().split("T")[0];
        let queryParams = `status=${status.toLowerCase()}&id_role=${
          typeGet === "siswa" ? "4" : "3"
        }&limit=60&start_date=${dateNow}&end_date=${dateNow}`;

        if (classSelect && classSelect !== "none") {
          queryParams += `&id_class=${classSelect}`;
        }

        if (search && search.trim() !== "") {
          queryParams += `&search=${encodeURIComponent(search.trim())}`;
        }

        const response = await api.get(`/api/attendance?${queryParams}`);
        setDataSiswa(response.data);
        setIsLoading(false);
        return response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
        throw error;
      }
    };

    const timeoutId = setTimeout(
      () => {
        fetchData();
      },
      search ? 500 : 0
    );

    return () => clearTimeout(timeoutId);
  }, [status, typeGet, classSelect, search]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "hadir":
        return "text-green-600 bg-green-50";
      case "izin":
        return "text-blue-600 bg-blue-50";
      case "sakit":
        return "text-orange-600 bg-orange-50";
      case "alpha":
        return "text-red-600 bg-red-50";
      case "terlambat":
        return "text-yellow-600 bg-yellow-50";
      case "cuti":
        return "text-purple-600 bg-purple-50";
      case "dinas":
        return "text-indigo-600 bg-indigo-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const formatIndonesianDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8 max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
            {text}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            {formatIndonesianDate(new Date())}
          </p>
        </div>
        <Button variant="outline" size="sm" className="text-xs sm:text-sm">
          <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div>
          <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1 sm:mb-2">
            Status
          </label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full text-xs sm:text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {category.map((item) => (
                <SelectItem
                  key={item}
                  value={item.toLowerCase()}
                  className="text-xs sm:text-sm"
                >
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1 sm:mb-2">
            Kelas
          </label>
          <Select value={classSelect} onValueChange={setClassSelect}>
            <SelectTrigger className="w-full text-xs sm:text-sm">
              <SelectValue placeholder="Pilih kelas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none" className="text-xs sm:text-sm">
                Semua Kelas
              </SelectItem>
              {dataClass.map((item) => (
                <SelectItem
                  key={item.id}
                  value={item.id}
                  className="text-xs sm:text-sm"
                >
                  {item.class}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1 sm:mb-2">
            Cari
          </label>
          <div className="relative">
            <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
            <Input
              placeholder="Cari nama siswa..."
              className="pl-7 sm:pl-10 text-xs sm:text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-[800px] w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NO
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NAMA
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                KELAS
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                STATUS
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                KETERANGAN
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PRESENSI TANGGAL
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-3 sm:px-4 md:px-6 py-6 sm:py-8 text-center"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin h-4 w-4 sm:h-5 sm:w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    <span className="text-xs sm:text-sm text-gray-500">
                      Memuat data...
                    </span>
                  </div>
                </td>
              </tr>
            ) : dataSiswa.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-3 sm:px-4 md:px-6 py-6 sm:py-8 text-center text-xs sm:text-sm text-gray-500"
                >
                  {search
                    ? `Tidak ada data yang sesuai dengan pencarian "${search}"`
                    : "Tidak ada data"}
                </td>
              </tr>
            ) : (
              dataSiswa.map((siswa, index) => (
                <tr key={siswa.id || index} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                    {siswa.user.full_name || "Siswa"}
                  </td>
                  <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                    <span className="px-1 sm:px-2 py-0.5 sm:py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {dataClass.find(
                        (element) => element.id === siswa.id_class
                      )?.class || "Tidak ada kelas"}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                    {siswa.status.map((nama, index) => (
                      <span
                        key={index}
                        className={`px-1 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${getStatusColor(
                          nama
                        )}`}
                      >
                        {nama}
                      </span>
                    ))}
                  </td>
                  <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                    {siswa.information === "" ? "-" : siswa.information || "-"}
                  </td>
                  <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                    {formatIndonesianDate(siswa.date)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <div className="text-xs sm:text-sm text-gray-600">
          Showing 1 to 1 of 1 entries
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button
            size="sm"
            className="bg-blue-600 text-white text-xs sm:text-sm"
          >
            1
          </Button>
          <Button variant="outline" size="sm" disabled>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DaftarSurvei;
