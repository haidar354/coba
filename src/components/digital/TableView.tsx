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
  // State untuk loading dan error handling
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil token dari localStorage
        const token = localStorage.getItem("token");
        // const dateNow = new Date().toISOString().split("T")[0];

        const d = new Date();
        d.setDate(d.getDate() - 1); // mundur 1 hari
        const dateNow = d.toISOString().split("T")[0];
        // Buat config untuk header authorization
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
      try {
        // Build query parameters
        // const dateNow = new Date().toISOString().split("T")[0];

        const d = new Date();
        d.setDate(d.getDate() - 1); // mundur 1 hari
        const dateNow = d.toISOString().split("T")[0];
        let queryParams = `status=${status.toLowerCase()}&id_role=${
          typeGet === "siswa" ? "4" : "3"
        }&limit=60&start_date=${dateNow}&end_date=${dateNow}`;

        // Add class filter if selected
        if (classSelect && classSelect !== "none") {
          queryParams += `&id_class=${classSelect}`;
        }

        // Add search filter if exists
        if (search && search.trim() !== "") {
          queryParams += `&search=${encodeURIComponent(search.trim())}`;
        }

        const response = await api.get(`/api/attendance?${queryParams}`);
        setDataSiswa(response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    };

    // Add debounce for search to avoid too many API calls
    const timeoutId = setTimeout(
      () => {
        fetchData();
      },
      search ? 500 : 0
    ); // 500ms delay for search, immediate for other changes

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
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day} ${month} ${year} Pukul ${hours}.${minutes}`;
  };

  // Fixed event handlers - menggunakan onValueChange dari Select component
  const handleChangeStatus = (value) => {
    setStatus(value);
  };

  const handleChangeClass = (value) => {
    if (value === "none") {
      setClassSelect("");
    } else {
      setClassSelect(value);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">{text}</h1>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {/* Fixed Status Select */}
          <Select
            value={status.toLowerCase()}
            onValueChange={handleChangeStatus}
          >
            <SelectTrigger className="w-35">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {category.map((cat, index) => (
                <SelectItem key={index} value={cat.toLowerCase()}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Fixed Class Select */}
          {typeGet !== "guru" && (
            <Select
              value={classSelect || "none"}
              onValueChange={handleChangeClass}
            >
              <SelectTrigger className="w-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {dataClass?.map((cat, index) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.class}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Cari berdasarkan nama..."
            className="pl-10 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={isLoading}
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-16">
                NO
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                NAMA
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                KELAS
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                STATUS
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                KETERANGAN
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                PRESENSI TANGGAL
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    <span className="text-gray-500">Memuat data...</span>
                  </div>
                </td>
              </tr>
            ) : dataSiswa.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  {search
                    ? `Tidak ada data yang sesuai dengan pencarian "${search}"`
                    : "Tidak ada data"}
                </td>
              </tr>
            ) : (
              dataSiswa.map((siswa, index) => (
                <tr key={siswa.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {siswa.user.full_name || "Siswa"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {dataClass.find(
                        (element) => element.id === siswa.id_class
                      )?.class || "Tidak ada kelas"}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {siswa.status.map((nama, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          nama
                        )}`}
                      >
                        {nama}
                      </span>
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {siswa.information === "" ? "-" : siswa.information || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatIndonesianDate(siswa.date)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">Showing 1 to 1 of 1 entries</div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button size="sm" className="bg-blue-600 text-white">
            1
          </Button>
          <Button variant="outline" size="sm" disabled>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DaftarSurvei;
