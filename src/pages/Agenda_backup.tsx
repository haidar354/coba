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
import { useState } from "react";

// Komponen untuk konten modal
const DaftarSurvei = ({ text, category, onClose }) => {
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
            <Input placeholder="" />
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
                    id="sekolah"
                    name="tipe"
                    value="sekolah"
                    className="h-4 w-4"
                  />
                  <label htmlFor="sekolah" className="text-sm">
                    Di Sekolah
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="dinas"
                    name="tipe"
                    value="dinas"
                    className="h-4 w-4"
                    defaultChecked
                  />
                  <label htmlFor="dinas" className="text-sm">
                    Dinas Keluar
                  </label>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Lokasi</label>
              <Input placeholder="" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Waktu Mulai
              </label>
              <Input type="datetime-local" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Waktu Selesai
              </label>
              <Input type="datetime-local" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Peserta</label>
            <Select>
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
            <Button>Simpan</Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Data agenda contoh
const agendaData = [
  {
    id: 1,
    judul: "Rapat Kepala Sekolah Se DIY",
    lokasi: "Hotel Gram Ambarukmo",
    mulai: "17-09-2025 12:00",
    selesai: "18-09-2025 12:00",
    dibuat: "17-09-2025 09:49",
    tipe: "dinas",
  },
];

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
      "Download Data Presensi",
      "Pilih format file dan periode data yang ingin diunduh",
      "Download"
    );
  };

  const handleTambahAgenda = () => {
    openModal("Tambah Agenda Kegiatan", "", "Tambah Agenda");
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

  const renderCalendarView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Sidebar */}
      <Card className="lg:col-span-1">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Button className="w-full gap-2" onClick={handleTambahAgenda}>
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
                      ? "bg-primary text-primary-foreground"
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
                      ? "bg-primary text-primary-foreground"
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
                      ? "bg-primary text-primary-foreground"
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
                      ? "bg-primary text-primary-foreground"
                      : "cursor-pointer"
                  }
                  onClick={() => setActiveView("agenda")}
                >
                  Agenda
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>{renderViewContent()}</CardContent>
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
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="font-medium text-red-700">
                  Rapat Kepala Sekolah Se DIY
                </div>
                <div className="text-sm text-red-600">17-18 September 2025</div>
              </div>
            </div>
          </div>
        );
      case "minggu":
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">15-21 Sep 2025</h3>
            <div className="grid grid-cols-7 gap-1 mb-4">
              <div className="p-2 text-center font-medium text-sm">
                Sen 15/9
              </div>
              <div className="p-2 text-center font-medium text-sm">
                Sel 16/9
              </div>
              <div className="p-2 text-center font-medium text-sm">
                Rab 17/9
              </div>
              <div className="p-2 text-center font-medium text-sm">
                Kam 18/9
              </div>
              <div className="p-2 text-center font-medium text-sm">
                Jum 19/9
              </div>
              <div className="p-2 text-center font-medium text-sm">
                Sab 20/9
              </div>
              <div className="p-2 text-center font-medium text-sm">
                Min 21/9
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1">
              <div className="min-h-20 p-1 border border-border"></div>
              <div className="min-h-20 p-1 border border-border"></div>
              <div className="min-h-20 p-1 border border-border">
                <div className="bg-red-500 text-white text-xs p-1 rounded">
                  Rapat Kepala Sekolah Se DIY
                </div>
              </div>
              <div className="min-h-20 p-1 border border-border"></div>
              <div className="min-h-20 p-1 border border-border"></div>
              <div className="min-h-20 p-1 border border-border"></div>
              <div className="min-h-20 p-1 border border-border"></div>
            </div>
          </div>
        );
      case "hari":
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">19 September 2025</h3>
            <div className="text-center text-4xl font-bold text-muted-foreground">
              Jumat
            </div>
            <div className="text-center text-muted-foreground">
              Tidak ada agenda untuk hari ini
            </div>
          </div>
        );
      case "agenda":
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="border-b pb-2">
                <div className="text-sm text-muted-foreground">
                  17 September 2025
                </div>
                <div className="font-medium">Rabu</div>
                <div className="mt-2 p-2 bg-red-50 rounded">
                  <div className="text-sm">12.00 - 0.00</div>
                  <div className="font-medium text-red-700">
                    • Rapat Kepala Sekolah Se DIY
                  </div>
                </div>
              </div>
              <div className="border-b pb-2">
                <div className="text-sm text-muted-foreground">
                  18 September 2025
                </div>
                <div className="font-medium">Kamis</div>
                <div className="mt-2 p-2 bg-red-50 rounded">
                  <div className="text-sm">0.00 - 12.00</div>
                  <div className="font-medium text-red-700">
                    • Rapat Kepala Sekolah Se DIY
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return renderCalendarGrid();
    }
  };

  const renderCalendarGrid = () => (
    <>
      <div className="grid grid-cols-7 gap-1 mb-4">
        <div className="p-2 text-center font-medium text-sm">Sen</div>
        <div className="p-2 text-center font-medium text-sm">Sel</div>
        <div className="p-2 text-center font-medium text-sm">Rab</div>
        <div className="p-2 text-center font-medium text-sm">Kam</div>
        <div className="p-2 text-center font-medium text-sm">Jum</div>
        <div className="p-2 text-center font-medium text-sm">Sab</div>
        <div className="p-2 text-center font-medium text-sm">Min</div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 42 }, (_, i) => {
          const day = i - 6;
          const isCurrentMonth = day > 0 && day <= 30;
          const hasEvent = day === 17;

          return (
            <div
              key={i}
              className={`min-h-20 p-1 border border-border ${
                isCurrentMonth ? "bg-background" : "bg-muted/50"
              }`}
            >
              <div className="text-sm">
                {isCurrentMonth ? day : day <= 0 ? "" : day - 30}
              </div>
              {hasEvent && (
                <div className="mt-1">
                  <div className="bg-red-500 text-white text-xs p-1 rounded">
                    12 Rapat Kepala Sekolah Se DIY
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );

  const renderTableView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Data Agenda</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleDownload}>
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2" onClick={handleTambahAgenda}>
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

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NO</TableHead>
                <TableHead>JUDUL</TableHead>
                <TableHead>LOKASI</TableHead>
                <TableHead>MULAI</TableHead>
                <TableHead>SELESAI</TableHead>
                <TableHead>DIBUAT PADA</TableHead>
                <TableHead>AKSI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agendaData.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.judul}</TableCell>
                  <TableCell>{item.lokasi}</TableCell>
                  <TableCell>{item.mulai}</TableCell>
                  <TableCell>{item.selesai}</TableCell>
                  <TableCell>{item.dibuat}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
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
              ))}
            </TableBody>
          </Table>
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
        />
      </Modal>
    </div>
  );
}