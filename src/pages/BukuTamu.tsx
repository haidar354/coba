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
import GuestService from "../services/guestService";

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

  // Fetch guests data
  const fetchGuests = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await GuestService.getGuests({
        page: currentPage,
        limit: pageSize,
        search: searchTerm || undefined,
        ...params,
      });

      if (response && response.data) {
        console.log(response)
        setGuestData(response.data);
        setPagination( response?.headers["x-pagination"] === undefined ? {} : JSON.parse(
            response?.headers["x-pagination"] === undefined
              ? {}
              : response?.headers["x-pagination"]
          )
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

  // Handle delete guest
  const handleDeleteGuest = async (id) => {
    try {
      if (window.confirm("Apakah Anda yakin ingin menghapus data tamu ini?")) {
        await GuestService.deleteGuest(id);
        fetchGuests(); // Refresh data
      }
    } catch (err) {
      console.error("Error deleting guest:", err);
      alert("Gagal menghapus data tamu");
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
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Tambah Data
              </Button>
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
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
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
            <div className="text-center py-8 text-red-500">
              <p>{error}</p>
              <Button onClick={() => fetchGuests()} className="mt-2">
                Coba Lagi
              </Button>
            </div>
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
                            <img
                              src={`https://api-v1-production-1b72.up.railway.app/${guest.signature}`}
                              alt=""
                              className="object-contain max-w-40 max-h-50"
                              crossOrigin="anonymous"
                            />
                          </TableCell>
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
    </div>
  );
};

export default BukuTamu;
