import React, { useState, useEffect } from "react";
import {
  Plus,
  Calendar as CalendarIcon,
  Filter,
  Download,
  Search,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Modal from "@/components/Modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { agendaAPI } from "@/utils/axios2";

// Komponen untuk konten modal
const DaftarSurvei = ({
  text,
  category,
  onClose,
  onSubmit,
  selectedAgenda,
}) => {
  const [formData, setFormData] = useState({
    event_name: "",
    description: "",
    event_date: "",
    event_type: "external",
    start_time: "",
    end_time: "",
  });
  // Download states (untuk sementara disembunyikan)
  // const [fileFormat, setFileFormat] = useState("excel")
  // const [startDate, setStartDate] = useState("")
  // const [endDate, setEndDate] = useState("")

  useEffect(() => {
    if (category === "Edit" && selectedAgenda) {
      setFormData({
        event_name: selectedAgenda.event_name || "",
        description: selectedAgenda.description || "",
        event_date: selectedAgenda.event_date
          ? new Date(selectedAgenda.event_date).toISOString().slice(0, 16)
          : "",
        event_type: selectedAgenda.event_type || "external",
        start_time: selectedAgenda.start_time || "",
        end_time: selectedAgenda.end_time || "",
      });
    } else if (category === "Tambah Agenda" && !selectedAgenda) {
      // ⛔ hanya reset kalau bukan edit
      setFormData({
        event_name: "",
        description: "",
        event_date: "",
        event_type: "external",
        start_time: "",
        end_time: "",
      });
    }
  }, [category, selectedAgenda]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("📝 Form Data sebelum submit:", formData);
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Download function (commented out for now)
  // const handleDownload = async () => {
  //   if (!startDate || !endDate) {
  //     alert("Pilih periode data dulu")
  //     return
  //   }

  //   try {
  //     const res = await fetch(
  //       `/api/export?format=${fileFormat}&start=${startDate}&end=${endDate}`
  //     )

  //     if (!res.ok) throw new Error("Gagal download")

  //     const blob = await res.blob()
  //     const url = window.URL.createObjectURL(blob)
  //     const a = document.createElement("a")
  //     a.href = url
  //     a.download = `data_${startDate}_${endDate}.${fileFormat}`
  //     document.body.appendChild(a)
  //     a.click()
  //     a.remove()
  //     window.URL.revokeObjectURL(url)
  //   } catch (err) {
  //     console.error(err)
  //     alert("Terjadi kesalahan saat download")
  //   }
  // }

  return (
    <div className="space-y-4">
      {/* {category === "Download" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{text}</p>
          <div>
            <label className="block text-sm font-medium mb-2">
              Format File
            </label>
            <Select defaultValue="excel">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                <SelectItem value="csv">CSV (.csv)</SelectItem>
                <SelectItem value="pdf">PDF (.pdf)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Periode Data
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input type="date"  value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Tanggal Mulai" />
              </div>
              <div>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="Tanggal Akhir" />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button className="gap-2" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      )} */}

      {(category === "Tambah Agenda" || category === "Edit") && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Judul</label>
            <Input
              placeholder=""
              value={formData.event_name}
              onChange={(e) => handleChange("event_name", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Deskripsi</label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Masukkan deskripsi agenda (opsional)"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Berikan deskripsi singkat tentang agenda ini
            </p>
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
                    id="internal"
                    name="tipe"
                    value="internal"
                    className="h-4 w-4"
                    checked={formData.event_type === "internal"}
                    onChange={(e) => handleChange("event_type", e.target.value)}
                  />
                  <label htmlFor="internal" className="text-sm">
                    Internal
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="external"
                    name="tipe"
                    value="external"
                    className="h-4 w-4"
                    checked={formData.event_type === "external"}
                    onChange={(e) => handleChange("event_type", e.target.value)}
                  />
                  <label htmlFor="external" className="text-sm">
                    External
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Waktu Mulai
              </label>
              <Input
                type="datetime-local"
                value={formData.event_date}
                onChange={(e) => handleChange("event_date", e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button className="gap-2" onClick={handleSubmit}>
              Simpan
            </Button>
          </div>
        </div>
      )}

      {category === "Detail" && formData && (
        <div className="space-y-4">
          <div>
            <p>
              <strong>Judul:</strong> {formData.event_name}
            </p>
            <p>
              <strong>Deskripsi:</strong> {formData.description || "-"}
            </p>
            <p>
              <strong>Tanggal:</strong>{" "}
              {formData.event_date ? formatDate(formData.event_date) : "-"}
            </p>
            <p>
              <strong>Tipe:</strong>{" "}
              {formData.event_type === "external" ? "External" : "Internal"}
            </p>
          </div>

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Tutup
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Agenda() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalText, setModalText] = useState("");
  const [category, setCategory] = useState("");
  const [activeTab, setActiveTab] = useState("calendar");
  const [activeView, setActiveView] = useState("bulan");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedDetailAgenda, setSelectedDetailAgenda] = useState(null);
  const [filters, setFilters] = useState({
    semua: true,
    Internal: true,
    External: true,
  });

  // State untuk data dari API
  const [agendaData, setAgendaData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Calendar navigation
  const [currentDate, setCurrentDate] = useState(new Date()); // September 2025

  // Load data agenda saat komponen dimount
  useEffect(() => {
    loadAgendaData();
  }, []);

  const loadAgendaData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await agendaAPI.getAll();
      console.log("📥 Response dari API:", response.data); // cek nilai type disini
      setAgendaData(response.data || []);
    } catch (err) {
      setError(err.response?.data?.error || "Gagal memuat data agenda");
      console.error("❌ Error loading agenda data:", err);
    } finally {
      setLoading(false);
    }
  };

  const [selectedAgenda, setSelectedAgenda] = useState(null);

  const openModal = (title, text = "", cat = "", agendaItem = null) => {
    setModalTitle(title);
    setModalText(text);
    setCategory(cat);
    setSelectedAgenda(agendaItem);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalTitle("");
    setModalText("");
    setCategory("");
  };

  const openDetailModal = (agenda) => {
    setSelectedDetailAgenda(agenda);
    setIsDetailOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailOpen(false);
    setSelectedDetailAgenda(null);
  };

  // Download function (commented out for now)
  // const handleDownload = () => {
  //   openModal(
  //     "Download Data Agenda",
  //     "Pilih format file dan periode data yang ingin diunduh",
  //     "Download"
  //   );
  // };

  const handleTambahAgenda = () => {
    openModal("Tambah Agenda Kegiatan", "", "Tambah Agenda");
  };

  const handleSubmitAgenda = async (formData) => {
    try {
      setLoading(true);

      // Format data untuk API
      const agendaPayload = {
        event_name: formData.event_name,
        description: formData.description ? formData.description : null,
        event_date: formData.event_date
          ? new Date(formData.event_date).toISOString()
          : null,
        event_type: formData.event_type,
      };

      console.log("🚀 Payload dikirim ke API:", agendaPayload);

      if (category === "Edit" && selectedAgenda) {
        await agendaAPI.update(selectedAgenda.id, agendaPayload);
        alert("Agenda berhasil diperbarui!");
      } else {
        await agendaAPI.create(agendaPayload);
        alert("Agenda berhasil ditambahkan!");
      }

      // Reload data setelah berhasil
      await loadAgendaData();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.error || "Gagal menyimpan agenda");
      console.error("❌ Error saving agenda:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAgenda = async (id) => {
    if (!confirm("Yakin ingin menghapus agenda ini?")) return;
    try {
      setLoading(true);
      await agendaAPI.delete(id); // pastikan endpoint delete ada
      await loadAgendaData(); // refresh tabel
      alert("Agenda berhasil dihapus!");
    } catch (err) {
      console.error("Error deleting agenda:", err);
      alert(err.response?.data?.error || "Gagal menghapus agenda");
    } finally {
      setLoading(false);
    }
  };

  // const handleFilterChange = (filterType) => {
  //   if (filterType === "semua") {
  //     setFilters({
  //       semua: true,
  //       External: true,
  //       Internal: true,
  //     });
  //   } else if (filterType === "external") {
  //     setFilters({
  //       semua: false,
  //       External: true,
  //       Internal: false,
  //     });
  //   } else if (filterType === "internal") {
  //     setFilters({
  //       semua: false,
  //       External: false,
  //       Internal: true,
  //     });
  //   }
  // };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter agenda berdasarkan tanggal untuk tampilan bulan
  const getAgendaForDate = (day, month, year) => {
    return agendaData.filter((agenda) => {
      if (!agenda.event_date) return false;
      const agendaDate = new Date(agenda.event_date);
      return (
        agendaDate.getDate() === day &&
        agendaDate.getMonth() === month - 1 &&
        agendaDate.getFullYear() === year
      );
    });
  };

  // Filter agenda untuk minggu tertentu
  const getAgendaForWeek = (weekStart, weekEnd) => {
    return agendaData.filter((agenda) => {
      if (!agenda.event_date) return false;
      const agendaDate = new Date(agenda.event_date);
      return agendaDate >= weekStart && agendaDate <= weekEnd;
    });
  };

  // Get filtered data based on filters and search
  const getFilteredAgenda = () => {
    let filtered = agendaData;

    // Apply type filters
    if (!filters.semua) {
      filtered = filtered.filter((agenda) => {
        if (filters.External && agenda.event_type === "external") return true;
        if (filters.Internal && agenda.event_type === "internal") return true;
        return false;
      });
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (agenda) =>
          agenda.event_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          agenda.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  // Pagination calculations
  const filteredData = getFilteredAgenda();
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Navigation functions
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction * 7);
    setCurrentDate(newDate);
  };

  const navigateDay = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction);
    setCurrentDate(newDate);
  };

  const renderCalendarView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Sidebar */}
      <Card className="lg:col-span-1">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Button
              className="w-full gap-2"
              onClick={handleTambahAgenda}
              disabled={loading}
            >
              <Plus className="h-4 w-4" />
              Tambah Agenda
            </Button>

            <div className="text-center text-muted-foreground">
              <h3 className="font-medium mb-2">
                {currentDate.toLocaleDateString("id-ID", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <div className="grid grid-cols-7 gap-1 text-xs">
                <div className="p-1">Sen</div>
                <div className="p-1">Sel</div>
                <div className="p-1">Rab</div>
                <div className="p-1">Kam</div>
                <div className="p-1">Jum</div>
                <div className="p-1">Sab</div>
                <div className="p-1">Min</div>

                {/* Calendar days - mini version */}
                {Array.from({ length: 42 }, (_, i) => {
                  const firstDay = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    1
                  );
                  const startOfWeek =
                    firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
                  const dayNumber = i - startOfWeek + 1;
                  const daysInMonth = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() + 1,
                    0
                  ).getDate();
                  const isCurrentMonth =
                    dayNumber > 0 && dayNumber <= daysInMonth;
                  const isToday =
                    isCurrentMonth &&
                    dayNumber === new Date().getDate() &&
                    currentDate.getMonth() === new Date().getMonth() &&
                    currentDate.getFullYear() === new Date().getFullYear();

                  return (
                    <div
                      key={i}
                      className={`p-1 text-center ${
                        isCurrentMonth
                          ? isToday
                            ? "bg-primary text-primary-foreground rounded"
                            : "hover:bg-muted rounded"
                          : "text-muted-foreground/50"
                      }`}
                    >
                      {isCurrentMonth ? dayNumber : ""}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t pt-4">
              {/* <h4 className="font-medium mb-3">Filter Agenda</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="semua"
                    checked={filters.semua}
                    onCheckedChange={() => handleFilterChange("semua")}
                  />
                  <label
                    htmlFor="semua"
                    className="text-sm flex items-center gap-2"
                  >
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    Semua
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="external"
                    checked={filters.External}
                    onCheckedChange={() => handleFilterChange("external")}
                  />
                  <label
                    htmlFor="external"
                    className="text-sm flex items-center gap-2"
                  >
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    External
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="internal"
                    checked={filters.Internal}
                    onCheckedChange={() => handleFilterChange("internal")}
                  />
                  <label
                    htmlFor="internal"
                    className="text-sm flex items-center gap-2"
                  >
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Internal
                  </label>
                </div>
              </div> */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Calendar */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CardTitle>
                  {activeView === "bulan" &&
                    currentDate.toLocaleDateString("id-ID", {
                      month: "long",
                      year: "numeric",
                    })}
                  {activeView === "minggu" && `${getWeekRange()}`}
                  {activeView === "hari" &&
                    currentDate.toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  {activeView === "agenda" &&
                    `Agenda ${currentDate.getFullYear()}`}
                </CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (activeView === "bulan") navigateMonth(-1);
                      else if (activeView === "minggu") navigateWeek(-1);
                      else if (activeView === "hari") navigateDay(-1);
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (activeView === "bulan") navigateMonth(1);
                      else if (activeView === "minggu") navigateWeek(1);
                      else if (activeView === "hari") navigateDay(1);
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-2 text-sm">
                <Badge
                  variant={activeView === "bulan" ? "default" : "outline"}
                  className={
                    activeView === "bulan"
                      ? "bg-primary text-primary-foreground cursor-pointer"
                      : "cursor-pointer"
                  }
                  onClick={() => setActiveView("bulan")}
                >
                  Bulan
                </Badge>
                <Badge
                  variant={activeView === "minggu" ? "default" : "outline"}
                  className={
                    activeView === "minggu"
                      ? "bg-primary text-primary-foreground cursor-pointer"
                      : "cursor-pointer"
                  }
                  onClick={() => setActiveView("minggu")}
                >
                  Minggu
                </Badge>
                <Badge
                  variant={activeView === "hari" ? "default" : "outline"}
                  className={
                    activeView === "hari"
                      ? "bg-primary text-primary-foreground cursor-pointer"
                      : "cursor-pointer"
                  }
                  onClick={() => setActiveView("hari")}
                >
                  Hari
                </Badge>
                <Badge
                  variant={activeView === "agenda" ? "default" : "outline"}
                  className={
                    activeView === "agenda"
                      ? "bg-primary text-primary-foreground cursor-pointer"
                      : "cursor-pointer"
                  }
                  onClick={() => setActiveView("agenda")}
                >
                  Agenda
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground">Memuat data...</div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="text-red-500 mb-2">Error: {error}</div>
                <Button onClick={loadAgendaData} variant="outline" size="sm">
                  Coba Lagi
                </Button>
              </div>
            ) : (
              renderViewContent()
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const getWeekRange = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return `${startOfWeek.getDate()}-${endOfWeek.getDate()} ${startOfWeek.toLocaleDateString(
      "id-ID",
      { month: "short", year: "numeric" }
    )}`;
  };

  const renderViewContent = () => {
    switch (activeView) {
      case "bulan":
        return (
          <div className="bg-white text-gray-800 rounded-lg overflow-hidden shadow">
            {/* Calendar header */}
            <div className="grid grid-cols-7 gap-0 border-b border-gray-200">
              {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((day) => (
                <div
                  key={day}
                  className="p-3 text-center text-sm font-medium text-gray-600"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-0">
              {Array.from({ length: 42 }, (_, i) => {
                const firstDay = new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  1
                );
                const startOfWeek =
                  firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
                const dayNumber = i - startOfWeek + 1;
                const daysInMonth = new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth() + 1,
                  0
                ).getDate();
                const isCurrentMonth =
                  dayNumber > 0 && dayNumber <= daysInMonth;
                const displayDay = isCurrentMonth ? dayNumber : "";

                // Agenda untuk tanggal ini
                const dayAgendas = isCurrentMonth
                  ? getAgendaForDate(
                      dayNumber,
                      currentDate.getMonth() + 1,
                      currentDate.getFullYear()
                    )
                  : [];

                return (
                  <div
                    key={i}
                    className={`min-h-[120px] border-r border-b border-gray-200 p-2 ${
                      !isCurrentMonth ? "bg-gray-50 text-gray-400" : "bg-white"
                    }`}
                  >
                    <div className="text-right text-sm mb-1 text-gray-600">
                      {displayDay}
                    </div>
                    {console.log("📅 Agendas for", displayDay, dayAgendas)}
                    {dayAgendas.map((agenda, idx) => (
                      <div
                        key={agenda.id || idx}
                        className={`text-xs p-1 rounded mb-1 leading-tight text-white ${
                          agenda.event_type === "external"
                            ? "bg-red-600"
                            : "bg-green-600"
                        }`}
                      >
                        {formatTime(agenda.event_date)} {agenda.event_name}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "minggu": {
        const startOfWeek = new Date(currentDate);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
        startOfWeek.setDate(diff);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const weekAgendas = getAgendaForWeek(startOfWeek, endOfWeek);

        return (
          <div className="bg-white text-gray-800 rounded-lg overflow-hidden shadow">
            {/* Week header */}
            <div className="grid grid-cols-8 gap-0 border-b border-gray-200 bg-gray-100">
              <div className="p-3 text-center text-sm font-medium text-gray-600"></div>
              {Array.from({ length: 7 }, (_, i) => {
                const weekDay = new Date(startOfWeek);
                weekDay.setDate(startOfWeek.getDate() + i);
                const dayNames = [
                  "Sen",
                  "Sel",
                  "Rab",
                  "Kam",
                  "Jum",
                  "Sab",
                  "Min",
                ];
                return (
                  <div
                    key={i}
                    className="p-3 text-center text-sm font-medium text-gray-700"
                  >
                    {dayNames[i]} {weekDay.getDate()}/{weekDay.getMonth() + 1}
                  </div>
                );
              })}
            </div>

            {/* Time slots */}
            <div className="grid grid-cols-8 gap-0">
              {/* Time column */}
              <div className="border-r border-gray-200 bg-gray-50">
                <div className="p-2 text-center text-sm text-gray-500 border-b border-gray-200 h-12">
                  Sehari Penuh
                </div>
                {Array.from({ length: 18 }, (_, i) => (
                  <div
                    key={i}
                    className="p-2 text-xs text-gray-500 border-b border-gray-200 h-12 flex items-center"
                  >
                    {String(i + 6).padStart(2, "0")}:00
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {Array.from({ length: 7 }, (_, dayIndex) => {
                const currentDate = new Date(startOfWeek);
                currentDate.setDate(startOfWeek.getDate() + dayIndex);
                const dayAgendas = agendaData.filter((agenda) => {
                  if (!agenda.event_date) return false;
                  const agendaDate = new Date(agenda.event_date);
                  return (
                    agendaDate.toDateString() === currentDate.toDateString()
                  );
                });

                return (
                  <div key={dayIndex} className="border-r border-gray-200">
                    {/* Full day events row */}
                    <div className="p-2 h-12 border-b border-gray-200 flex items-center">
                      {dayAgendas.length > 0 && (
                        <div
                          className={`text-xs text-white p-1 rounded w-full truncate ${
                            dayAgendas[0].event_type === "external"
                              ? "bg-red-600"
                              : "bg-green-600"
                          }`}
                        >
                          {dayAgendas[0].event_name}
                        </div>
                      )}
                    </div>

                    {/* Hourly time slots */}
                    {Array.from({ length: 18 }, (_, timeIndex) => {
                      const hour = timeIndex + 6;
                      const timeAgendas = dayAgendas.filter((agenda) => {
                        if (!agenda.event_date) return false;
                        const agendaDate = new Date(agenda.event_date);
                        return agendaDate.getHours() === hour;
                      });

                      return (
                        <div
                          key={timeIndex}
                          className="border-b border-gray-200 h-12 p-1 flex items-center"
                        >
                          {timeAgendas.map((agenda, idx) => (
                            <div
                              key={agenda.id || idx}
                              className={`text-xs text-white p-1 rounded w-full truncate ${
                                agenda.event_type === "external"
                                  ? "bg-red-600"
                                  : "bg-green-600"
                              }`}
                            >
                              {formatTime(agenda.event_date)}{" "}
                              {agenda.event_name}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      case "hari": {
        const dayAgendas = getAgendaForDate(
          currentDate.getDate(),
          currentDate.getMonth() + 1,
          currentDate.getFullYear()
        );

        return (
          <div className="bg-white text-gray-800 rounded-lg overflow-hidden shadow">
            {/* Day header */}
            <div className="text-center p-4 border-b border-gray-200 bg-gray-100">
              <h3 className="text-lg font-semibold text-gray-700">
                {currentDate.toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              {dayAgendas.length > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  {dayAgendas.length} agenda hari ini
                </p>
              )}
            </div>

            {/* Time slots for single day */}
            <div className="divide-y divide-gray-200">
              {Array.from({ length: 18 }, (_, i) => {
                const hour = i + 6;
                const timeAgendas = dayAgendas.filter((agenda) => {
                  if (!agenda.event_date) return false;
                  const agendaDate = new Date(agenda.event_date);
                  return agendaDate.getHours() === hour;
                });

                return (
                  <div key={i} className="flex">
                    <div className="w-20 p-3 text-sm text-gray-500 border-r border-gray-200 flex items-center justify-center bg-gray-50">
                      {String(hour).padStart(2, "0")}:00
                    </div>
                    <div className="flex-1 p-3 min-h-[60px] bg-white">
                      {timeAgendas.map((agenda, idx) => (
                        <div
                          key={agenda.id || idx}
                          className={`text-white p-2 rounded mb-1 text-sm ${
                            agenda.event_type === "external"
                              ? "bg-red-600"
                              : "bg-green-600"
                          }`}
                        >
                          <div className="font-medium">{agenda.event_name}</div>
                          {agenda.description && (
                            <div className="text-xs opacity-90 mt-1">
                              {agenda.description}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      case "agenda": {
        const filteredAgendaData = getFilteredAgenda();
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              {filteredAgendaData.length > 0 ? (
                filteredAgendaData.map((agenda) => (
                  <div key={agenda.id} className="border-b pb-3">
                    <div className="text-sm text-gray-500 mb-2">
                      {formatDateOnly(agenda.event_date)}
                    </div>
                    <div
                      className={`p-3 rounded-lg ${
                        agenda.event_type === "external"
                          ? "bg-red-50"
                          : "bg-green-50"
                      }`}
                    >
                      <div
                        className={`font-medium ${
                          agenda.event_type === "external"
                            ? "text-red-700"
                            : "text-green-700"
                        }`}
                      >
                        • {agenda.event_name}
                      </div>
                      {agenda.description && (
                        <div
                          className={`text-sm mt-1 ${
                            agenda.event_type === "external"
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {agenda.description}
                        </div>
                      )}
                      <div
                        className={`text-xs mt-2 ${
                          agenda.event_type === "external"
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {formatDate(agenda.event_date)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center py-8">
                  Tidak ada agenda tersedia
                </div>
              )}
            </div>
          </div>
        );
      }

      default:
        return (
          <div className="text-center text-gray-500 py-8">
            View ini sedang dalam pengembangan
          </div>
        );
    }
  };

  // Enhanced Pagination Implementation
  const renderTableView = () => {
    // Use the external filters/search state (do not redefine getFilteredAgenda here)
    const filteredData = getFilteredAgenda(); // gunakan fungsi yang sudah ada di atas
    // pastikan minimal 1 halaman agar UI tidak menunjukkan "dari 0"
    const totalPages = Math.max(
      1,
      Math.ceil(filteredData.length / itemsPerPage)
    );

    // clamp current page for rendering (tidak langsung setState agar tidak memicu hook di render)
    const effectivePage = Math.max(1, Math.min(currentPage, totalPages));

    const startIndex = (effectivePage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);
    const paginatedData = filteredData.slice(startIndex, endIndex);

    const handlePageChangeLocal = (page) => {
      if (page < 1 || page > totalPages) return;
      setCurrentPage(page);
    };

    const handleSearchChangeLocal = (value) => {
      // saat search berubah, set searchTerm (state global) dan reset ke halaman 1
      setSearchTerm(value);
      setCurrentPage(1);
    };

    // create page numbers, keep effectivePage in center with 2 left/right
    const generatePageNumbers = () => {
      const pages = [];
      const maxVisible = 5;
      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
        return pages;
      }

      let startPage = Math.max(1, effectivePage - 2);
      let endPage = Math.min(totalPages, effectivePage + 2);

      if (effectivePage <= 2) {
        startPage = 1;
        endPage = Math.min(5, totalPages);
      } else if (effectivePage >= totalPages - 1) {
        startPage = Math.max(1, totalPages - 4);
        endPage = totalPages;
      }

      for (let i = startPage; i <= endPage; i++) pages.push(i);
      return pages;
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Data Agenda</h2>
          <div className="flex gap-2">
            {/* <Button variant="outline" className="gap-2" onClick={handleDownload}>
            <Download className="h-4 w-4" />
            Export
          </Button> */}
            <Button
              className="gap-2"
              onClick={handleTambahAgenda}
              disabled={loading}
            >
              <Plus className="h-4 w-4" />
              Tambah Data
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-muted-foreground">
                Menampilkan {itemsPerPage} data per halaman
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari Judul"
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => handleSearchChangeLocal(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground">Memuat data...</div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="text-red-500 mb-2">Error: {error}</div>
                <Button onClick={loadAgendaData} variant="outline" size="sm">
                  Coba Lagi
                </Button>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NO</TableHead>
                      <TableHead>JUDUL</TableHead>
                      <TableHead>DESKRIPSI</TableHead>
                      <TableHead>TIPE</TableHead>
                      <TableHead>TANGGAL & WAKTU</TableHead>
                      <TableHead>DIBUAT PADA</TableHead>
                      <TableHead>AKSI</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((item, index) => (
                        <TableRow key={item.id ?? index}>
                          <TableCell>{startIndex + index + 1}</TableCell>
                          <TableCell>{item.event_name}</TableCell>
                          <TableCell>{item.description || "-"}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                item.event_type === "external"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {item.event_type === "external"
                                ? "External"
                                : "Internal"}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(item.event_date)}</TableCell>
                          <TableCell>{formatDate(item.created_at)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {/* Detail */}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => openDetailModal(item)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {/* Edit */}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  openModal("Edit Agenda", "", "Edit", item)
                                }
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              {/* Hapus */}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => handleDeleteAgenda(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center py-8 text-muted-foreground"
                        >
                          {searchTerm
                            ? `Tidak ada data ditemukan untuk "${searchTerm}"`
                            : "Tidak ada data agenda"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                {/* Enhanced Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-muted-foreground">
                      Menampilkan{" "}
                      {filteredData.length === 0 ? 0 : startIndex + 1}-
                      {filteredData.length === 0 ? 0 : endIndex} dari{" "}
                      {filteredData.length} data
                      {searchTerm && ` (hasil pencarian untuk "${searchTerm}")`}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* First page button */}
                      {effectivePage > 3 && totalPages > 5 && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-10"
                            onClick={() => handlePageChangeLocal(1)}
                          >
                            1
                          </Button>
                          {effectivePage > 4 && (
                            <span className="text-muted-foreground px-2">
                              ...
                            </span>
                          )}
                        </>
                      )}

                      {/* Previous button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChangeLocal(effectivePage - 1)}
                        disabled={effectivePage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      {/* Page numbers (current page in center) */}
                      <div className="flex gap-1">
                        {generatePageNumbers().map((pageNum) => (
                          <Button
                            key={pageNum}
                            variant={
                              effectivePage === pageNum ? "default" : "outline"
                            }
                            size="sm"
                            className={`w-10 ${
                              effectivePage === pageNum
                                ? "bg-primary text-primary-foreground"
                                : ""
                            }`}
                            onClick={() => handlePageChangeLocal(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        ))}
                      </div>

                      {/* Next button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChangeLocal(effectivePage + 1)}
                        disabled={effectivePage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>

                      {/* Last page button */}
                      {effectivePage < totalPages - 2 && totalPages > 5 && (
                        <>
                          {effectivePage < totalPages - 3 && (
                            <span className="text-muted-foreground px-2">
                              ...
                            </span>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-10"
                            onClick={() => handlePageChangeLocal(totalPages)}
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Page info */}
                <div className="text-center text-sm text-muted-foreground mt-4">
                  Halaman {effectivePage} dari {totalPages}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
          <Button
            variant={activeTab === "calendar" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("calendar")}
            className="gap-2"
          >
            <CalendarIcon className="h-4 w-4" />
            Kalender Agenda
          </Button>
          <Button
            variant={activeTab === "table" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("table")}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Data Agenda
          </Button>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
        <DaftarSurvei
          text={modalText}
          category={category}
          onClose={closeModal}
          onSubmit={handleSubmitAgenda}
          selectedAgenda={selectedAgenda}
        />
      </Modal>

      {/* Modal Detail */}
      <Modal
        isOpen={isDetailOpen}
        onClose={closeDetailModal}
        title="Detail Agenda"
      >
        {selectedDetailAgenda && (
          <div className="space-y-3">
            <p>
              <strong>Judul:</strong> {selectedDetailAgenda.event_name}
            </p>
            <p>
              <strong>Deskripsi:</strong>{" "}
              {selectedDetailAgenda.description || "-"}
            </p>
            <p>
              <strong>Tanggal:</strong>{" "}
              {formatDate(selectedDetailAgenda.event_date)}
            </p>
            <p>
              <strong>Tipe:</strong>{" "}
              {selectedDetailAgenda.event_type === "external"
                ? "External"
                : "Internal"}
            </p>
          </div>
        )}
      </Modal>

      {/* Content */}
      {activeTab === "calendar" ? renderCalendarView() : renderTableView()}
    </div>
  );
}
