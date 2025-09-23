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
const DaftarSurvei = ({ text, category, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    event_name: "",
    description: "",
    event_date: "",
    location: "",
    type: "dinas",
    participants: "",
    start_time: "",
    end_time: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-4">
      {category === "Download" && (
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
                <Input type="date" placeholder="Tanggal Mulai" />
              </div>
              <div>
                <Input type="date" placeholder="Tanggal Akhir" />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      )}

       {category === "Tambah Agenda" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Judul</label>
            <Input placeholder="" value={formData.event_name}
              onChange={(e) => handleChange("event_name", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Deskripsi
            </label>
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
              <label className="block text-sm font-medium mb-2">Tipe Agenda</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="radio" id="sekolah" name="tipe" value="sekolah" className="h-4 w-4" 
                    checked={formData.type === "sekolah"}
                    onChange={(e) => handleChange("type", e.target.value)} />
                  <label htmlFor="sekolah" className="text-sm">Di Sekolah</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="dinas" name="tipe" value="dinas" className="h-4 w-4" defaultChecked 
                    checked={formData.type === "dinas"}
                    onChange={(e) => handleChange("type", e.target.value)} />
                  <label htmlFor="dinas" className="text-sm">Dinas Keluar</label>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Lokasi</label>
              <Input placeholder="" value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Waktu Mulai</label>
              <Input type="datetime-local" value={formData.event_date}
                onChange={(e) => handleChange("event_date", e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Peserta</label>
            <Select value={formData.participants}
              onValueChange={(value) => handleChange("participants", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih peserta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kepala">Kepala Sekolah</SelectItem>
                <SelectItem value="guru">Semua Guru</SelectItem>
                <SelectItem value="staff">Staff Sekolah</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button 
            className="gap-2"
            onClick={handleSubmit}
            >
              Simpan
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
  const [filters, setFilters] = useState({
    semua: true,
    dinas: true,
    sekolah: true,
  });

  // State untuk data dari API
  const [agendaData, setAgendaData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load data agenda saat komponen dimount
  useEffect(() => {
    loadAgendaData();
  }, []);

  const loadAgendaData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await agendaAPI.getAll();
      setAgendaData(response.data || []);
    } catch (err) {
      setError(err.response?.data?.error || "Gagal memuat data agenda");
      console.error("Error loading agenda data:", err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (title, text = "", cat = "") => {
    setModalTitle(title);
    setModalText(text);
    setCategory(cat);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalTitle("");
    setModalText("");
    setCategory("");
  };

  const handleDownload = () => {
    openModal(
      "Download Data Agenda",
      "Pilih format file dan periode data yang ingin diunduh",
      "Download"
    );
  };

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
        event_date: formData.event_date ? new Date(formData.event_date).toISOString() : null,
        participants: formData.participants || null,
        // Tambahkan field lain sesuai kebutuhan
      };

      await agendaAPI.create(agendaPayload);

      // Reload data setelah berhasil
      await loadAgendaData();

      closeModal();

      // Bisa tambahkan toast notification di sini
      alert("Agenda berhasil ditambahkan!");
    } catch (err) {
      setError(err.response?.data?.error || "Gagal menambahkan agenda");
      console.error("Error creating agenda:", err);
      alert(
        "Gagal menambahkan agenda: " +
          (err.response?.data?.error || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType) => {
    if (filterType === "semua") {
      setFilters({
        semua: true,
        dinas: true,
        sekolah: true,
      });
    } else if (filterType === "dinas") {
      setFilters({
        semua: false,
        dinas: true,
        sekolah: false,
      });
    } else if (filterType === "sekolah") {
      setFilters({
        semua: false,
        dinas: false,
        sekolah: true,
      });
    }
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
              <h3 className="font-medium mb-2">September 2025</h3>
              <div className="grid grid-cols-7 gap-1 text-xs">
                <div className="p-1">Sen</div>
                <div className="p-1">Sel</div>
                <div className="p-1">Rab</div>
                <div className="p-1">Kam</div>
                <div className="p-1">Jum</div>
                <div className="p-1">Sab</div>
                <div className="p-1">Min</div>

                {/* Calendar days */}
                {Array.from({ length: 42 }, (_, i) => {
                  const day = i - 6;
                  const isCurrentMonth = day > 0 && day <= 30;
                  const isToday = day === 17;

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
                      {isCurrentMonth ? day : day <= 0 ? "" : day - 30}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Filter Agenda</h4>
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
                    id="dinas"
                    checked={filters.dinas}
                    onCheckedChange={() => handleFilterChange("dinas")}
                  />
                  <label
                    htmlFor="dinas"
                    className="text-sm flex items-center gap-2"
                  >
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    Dinas Keluar
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sekolah"
                    checked={filters.sekolah}
                    onCheckedChange={() => handleFilterChange("sekolah")}
                  />
                  <label
                    htmlFor="sekolah"
                    className="text-sm flex items-center gap-2"
                  >
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Di Sekolah
                  </label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Calendar */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Tahun 2025</CardTitle>
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

  const renderViewContent = () => {
    switch (activeView) {
      case "bulan":
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Agenda Bulan September 2025</h3>
            <div className="space-y-2">
              {agendaData.length > 0 ? (
                agendaData.map((agenda) => (
                  <div key={agenda.id} className="p-3 bg-red-50 rounded-lg">
                    <div className="font-medium text-red-700">
                      {agenda.event_name}
                    </div>
                    <div className="text-sm text-red-600">
                      {formatDate(agenda.event_date)}
                    </div>
                    {agenda.description && (
                      <div className="text-sm text-red-600 mt-1">
                        {agenda.description}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground text-center py-4">
                  Tidak ada agenda untuk bulan ini
                </div>
              )}
            </div>
          </div>
        );
      case "minggu":
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Agenda Minggu Ini</h3>
            <div className="space-y-2">
              {agendaData.length > 0 ? (
                agendaData.map((agenda) => (
                  <div key={agenda.id} className="p-3 bg-red-50 rounded-lg">
                    <div className="font-medium text-red-700">
                      {agenda.event_name}
                    </div>
                    <div className="text-sm text-red-600">
                      {formatDate(agenda.event_date)}
                    </div>
                    {agenda.description && (
                      <div className="text-sm text-red-600 mt-1">
                        {agenda.description}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground text-center py-4">
                  Tidak ada agenda untuk minggu ini
                </div>
              )}
            </div>
          </div>
        );
      case "hari":
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Agenda Hari Ini</h3>
            <div className="space-y-2">
              {agendaData.length > 0 ? (
                agendaData.map((agenda) => (
                  <div key={agenda.id} className="p-3 bg-red-50 rounded-lg">
                    <div className="font-medium text-red-700">
                      {agenda.event_name}
                    </div>
                    <div className="text-sm text-red-600">
                      {formatDate(agenda.event_date)}
                    </div>
                    {agenda.description && (
                      <div className="text-sm text-red-600 mt-1">
                        {agenda.description}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground text-center py-4">
                  Tidak ada agenda untuk hari ini
                </div>
              )}
            </div>
          </div>
        );
      case "agenda":
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              {agendaData.length > 0 ? (
                agendaData.map((agenda) => (
                  <div key={agenda.id} className="border-b pb-2">
                    <div className="text-sm text-muted-foreground">
                      {formatDate(agenda.event_date)}
                    </div>
                    <div className="mt-2 p-2 bg-red-50 rounded">
                      <div className="font-medium text-red-700">
                        • {agenda.event_name}
                      </div>
                      {agenda.description && (
                        <div className="text-sm text-red-600 mt-1">
                          {agenda.description}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground text-center py-4">
                  Tidak ada agenda
                </div>
              )}
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center text-muted-foreground">
            View ini sedang dalam pengembangan
          </div>
        );
    }
  };

  const renderTableView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Data Agenda</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleDownload}>
            <Download className="h-4 w-4" />
            Export
          </Button>
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
            <Select defaultValue="10">
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
              <Input placeholder="Cari..." className="pl-10 w-64" />
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NO</TableHead>
                  <TableHead>JUDUL</TableHead>
                  <TableHead>DESKRIPSI</TableHead>
                  <TableHead>TANGGAL & WAKTU</TableHead>
                  <TableHead>DIBUAT PADA</TableHead>
                  <TableHead>AKSI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agendaData.length > 0 ? (
                  agendaData.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.event_name}</TableCell>
                      <TableCell>{item.description || "-"}</TableCell>
                      <TableCell>{formatDate(item.event_date)}</TableCell>
                      <TableCell>{formatDate(item.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
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
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Tidak ada data agenda
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={activeTab === "calendar" ? "default" : "outline"}
            className="gap-2"
            onClick={() => setActiveTab("calendar")}
          >
            <CalendarIcon className="h-4 w-4" />
            Kalender Agenda
          </Button>
          <Button
            variant={activeTab === "table" ? "default" : "outline"}
            className="gap-2"
            onClick={() => setActiveTab("table")}
          >
            Data Agenda
          </Button>
        </div>
        <Select defaultValue="2025">
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2025">2025</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {activeTab === "calendar" ? renderCalendarView() : renderTableView()}

      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
        <DaftarSurvei
          text={modalText}
          category={category}
          onClose={closeModal}
          onSubmit={handleSubmitAgenda}
        />
      </Modal>
    </div>
  );
}
