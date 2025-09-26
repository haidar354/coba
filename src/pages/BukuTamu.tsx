import React, { useState, useEffect } from "react";
import {
  Plus,
  Download,
  Search,
  Eye,
  Edit,
  Trash2,
  Filter,
  BarChart3,
  Loader2,
  X,
  Upload,
} from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import api from "@/utils/axios";

const BukuTamu = () => {
  const [guestData, setGuestData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
  });

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    full_name: "",
    address: "",
    purpose: "",
    signature: null,
  });

  // Fetch guests data
  const fetchGuests = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = {
        page: currentPage,
        limit: pageSize,
        search: searchTerm || undefined,
        ...params,
      };

      // Remove undefined values
      Object.keys(queryParams).forEach(
        (key) => queryParams[key] === undefined && delete queryParams[key]
      );

      const response = await api.get("/api/attendance/guests?count=false", {
        params: queryParams,
      });

      if (response && response.data) {
        setGuestData(response.data || []);
        setPagination(
          JSON.parse(response.headers["x-pagination"]) || {
            page: currentPage,
            limit: pageSize,
            total: 0,
            total_pages: 0,
          }
        );
      }
    } catch (err) {
      console.error("Error fetching guests:", err);
      setError("Gagal memuat data buku tamu");
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and when dependencies change
  useEffect(() => {
    fetchGuests();
  }, [currentPage, pageSize]);

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    fetchGuests();
  };

  // Handle search on Enter key
  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Handle page size change
  const handlePageSizeChange = (newSize) => {
    setPageSize(parseInt(newSize));
    setCurrentPage(1);
  };

  // Reset form data
  const resetFormData = () => {
    setFormData({
      full_name: "",
      address: "",
      purpose: "",
      signature: null,
    });
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      signature: file,
    }));
  };

  // Create new guest
  const handleCreateGuest = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("full_name", formData.full_name);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("purpose", formData.purpose);

      if (formData.signature) {
        formDataToSend.append("signature", formData.signature);
      }

      await api.post("/api/attendance/guests", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setIsAddModalOpen(false);
      resetFormData();
      fetchGuests();
    } catch (err) {
      console.error("Error creating guest:", err);
      alert("Gagal menambah data tamu");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update guest
  const handleUpdateGuest = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("full_name", formData.full_name);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("purpose", formData.purpose);

      if (formData.signature) {
        formDataToSend.append("signature", formData.signature);
      }

      await api.put(`/api/attendance/guests/${selectedGuest.id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setIsEditModalOpen(false);
      resetFormData();
      setSelectedGuest(null);
      fetchGuests();
    } catch (err) {
      console.error("Error updating guest:", err);
      alert("Gagal mengupdate data tamu");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete guest
  const handleDeleteGuest = async (id) => {
    try {
      if (window.confirm("Apakah Anda yakin ingin menghapus data tamu ini?")) {
        await api.delete(`/api/attendance/guests/${id}`);
        fetchGuests(); // Refresh data
      }
    } catch (err) {
      console.error("Error deleting guest:", err);
      alert("Gagal menghapus data tamu");
    }
  };

  // Handle view guest
  const handleViewGuest = async (guest) => {
    setSelectedGuest(guest);
    setIsViewModalOpen(true);
  };

  // Handle edit guest
  const handleEditGuest = (guest) => {
    setSelectedGuest(guest);
    setFormData({
      full_name: guest.full_name,
      address: guest.address || "",
      purpose: guest.purpose,
      signature: null, // Don't pre-fill file input
    });
    setIsEditModalOpen(true);
  };

  // Handle export
  const handleExport = async () => {
    try {
      // Get all data for export
      const response = await api.get("/api/attendance/guests", {
        params: {
          limit: 1000, // Get a large number of records
          search: searchTerm || undefined,
        },
      });

      const dataToExport = response.data || [];

      // Convert to CSV
      const headers = [
        "No",
        "Nama Tamu",
        "Alamat",
        "Tujuan",
        "Waktu Kunjungan",
      ];
      const csvContent = [
        headers.join(","),
        ...dataToExport.map((guest, index) =>
          [
            index + 1,
            `"${guest.full_name}"`,
            `"${guest.address || "-"}"`,
            `"${guest.purpose}"`,
            `"${formatDateTime(guest.visit_date).date} ${
              formatDateTime(guest.visit_date).time
            }"`,
          ].join(",")
        ),
      ].join("\n");

      // Download CSV
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          `buku_tamu_${new Date().toISOString().split("T")[0]}.csv`
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error("Error exporting data:", err);
      alert("Gagal mengekspor data");
    }
  };

  // Format date and time
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const time = date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const dateStr = date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return { time, date: dateStr };
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const totalPages = pagination.total_pages;
    const current = pagination.page;

    // Always show first page
    if (totalPages > 0) pages.push(1);

    // Show pages around current page
    for (
      let i = Math.max(2, current - 1);
      i <= Math.min(totalPages - 1, current + 1);
      i++
    ) {
      if (!pages.includes(i)) pages.push(i);
    }

    // Always show last page
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Buku Tamu</h1>
        <p className="text-muted-foreground">
          Data buku tamu berisi informasi tentang pengunjung yang datang ke
          sekolah.
        </p>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  
                  Total {pagination.total || 0} Kunjungan
                </h3>
                <h4 className="text-base font-medium text-primary mb-2">
                  Statistik Buku Tamu
                </h4>
                <Button variant="link" className="p-0 h-auto text-primary">
                  Lihat grafik dan ringkasan statistik tamu →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Tampilkan antarmuka buku tamu untuk tamu undangan.
                </h3>
                <a
                  href="/tu/guest-visits/landing"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="secondary" className="gap-2">
                    Tampilkan Buku Tamu →
                  </Button>
                </a>
              </div>
              <div className="w-16 h-16 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Data Buku Tamu</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleExport}
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2" onClick={() => resetFormData()}>
                    <Plus className="h-4 w-4" />
                    Tambah Data
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Tambah Data Tamu</DialogTitle>
                    <DialogDescription>
                      Tambahkan data tamu baru ke dalam buku tamu.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateGuest} className="space-y-4">
                    <div>
                      <Label htmlFor="full_name">Nama Lengkap *</Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        required
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Alamat</Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Masukkan alamat"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="purpose">Tujuan Kunjungan *</Label>
                      <Input
                        id="purpose"
                        name="purpose"
                        value={formData.purpose}
                        onChange={handleInputChange}
                        required
                        placeholder="Masukkan tujuan kunjungan"
                      />
                    </div>
                    <div>
                      <Label htmlFor="signature">Tanda Tangan</Label>
                      <Input
                        id="signature"
                        name="signature"
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsAddModalOpen(false);
                          resetFormData();
                        }}
                      >
                        Batal
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Simpan
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <Select
              value={pageSize.toString()}
              onValueChange={handlePageSizeChange}
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

            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama tamu..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                />
              </div>
              <Button onClick={handleSearch} variant="default">
                Cari
              </Button>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p>Memuat data buku tamu...</p>
            </div>
          )}

          {/* Data Table */}
          {!loading && !error && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>NO</TableHead>
                    <TableHead>NAMA TAMU</TableHead>
                    <TableHead>ALAMAT</TableHead>
                    <TableHead>TUJUAN</TableHead>
                    <TableHead>WAKTU</TableHead>
                    <TableHead>TTD</TableHead>
                    <TableHead>AKSI</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guestData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Tidak ada data buku tamu
                      </TableCell>
                    </TableRow>
                  ) : (
                    guestData.map((guest, index) => {
                      const { time, date } = formatDateTime(guest.visit_date);
                      const rowNumber =
                        (currentPage - 1) * pageSize + index + 1;

                      return (
                        <TableRow key={guest.id}>
                          <TableCell>{rowNumber}</TableCell>
                          <TableCell className="font-medium">
                            {guest.full_name}
                          </TableCell>
                          <TableCell>{guest.address || "-"}</TableCell>
                          <TableCell>{guest.purpose}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-sm">
                                <span className="text-blue-500">🕐</span>
                                <span>{time}</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <span className="text-blue-500">📅</span>
                                <span>{date}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {guest.signature ? (
                              <img
                                src={`http://147.139.209.177/api/public/${guest.signature}`}
                                alt="Signature"
                                className="object-contain max-w-40 max-h-50"
                                crossOrigin="anonymous"
                              />
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleViewGuest(guest)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleEditGuest(guest)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => handleDeleteGuest(guest.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  Showing{" "}
                  {Math.min((currentPage - 1) * pageSize + 1, pagination.total)}{" "}
                  to {Math.min(currentPage * pageSize, pagination.total)} of{" "}
                  {pagination.total} entries
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage(1)}
                  >
                    ‹‹
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    ‹
                  </Button>
                  {getPageNumbers().map((pageNum) => (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= pagination.total_pages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    ›
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= pagination.total_pages}
                    onClick={() => setCurrentPage(pagination.total_pages)}
                  >
                    ››
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detail Data Tamu</DialogTitle>
          </DialogHeader>
          {selectedGuest && (
            <div className="space-y-4">
              <div>
                <Label>Nama Lengkap</Label>
                <p className="mt-1 text-sm">{selectedGuest.full_name}</p>
              </div>
              <div>
                <Label>Alamat</Label>
                <p className="mt-1 text-sm">{selectedGuest.address || "-"}</p>
              </div>
              <div>
                <Label>Tujuan Kunjungan</Label>
                <p className="mt-1 text-sm">{selectedGuest.purpose}</p>
              </div>
              <div>
                <Label>Waktu Kunjungan</Label>
                <p className="mt-1 text-sm">
                  {formatDateTime(selectedGuest.visit_date).date} pukul{" "}
                  {formatDateTime(selectedGuest.visit_date).time}
                </p>
              </div>
              {selectedGuest.signature && (
                <div>
                  <Label>Tanda Tangan</Label>
                  <div className="mt-2">
                    <img
                      src={`http://147.139.209.177/api/public/${selectedGuest.signature}`}
                      alt="Signature"
                      className="object-contain max-w-full max-h-48 border rounded"
                      crossOrigin="anonymous"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewModalOpen(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Data Tamu</DialogTitle>
            <DialogDescription>
              Ubah data tamu yang sudah ada.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateGuest} className="space-y-4">
            <div>
              <Label htmlFor="edit_full_name">Nama Lengkap *</Label>
              <Input
                id="edit_full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                required
                placeholder="Masukkan nama lengkap"
              />
            </div>
            <div>
              <Label htmlFor="edit_address">Alamat</Label>
              <Textarea
                id="edit_address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Masukkan alamat"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit_purpose">Tujuan Kunjungan *</Label>
              <Input
                id="edit_purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                required
                placeholder="Masukkan tujuan kunjungan"
              />
            </div>
            <div>
              <Label htmlFor="edit_signature">Tanda Tangan Baru</Label>
              <Input
                id="edit_signature"
                name="signature"
                type="file"
                onChange={handleFileChange}
                accept="image/*"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Kosongkan jika tidak ingin mengubah tanda tangan
              </p>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditModalOpen(false);
                  resetFormData();
                  setSelectedGuest(null);
                }}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BukuTamu;
