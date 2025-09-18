import {
  Plus,
  Download,
  Search,
  Eye,
  Edit,
  Trash2,
  Filter,
  BarChart3,
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

const guestData = [
  {
    no: 0,
    namaTamu: "Dinas Lembaga",
    tujuan: "Survey",
    waktu: "15:19",
    tanggal: "17-09-2025",
    ttd: "",
  },
];

export default function BukuTamu() {
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
                  Total 0 Kunjungan
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
                  href="/guest-visits/landing"
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
            <Select defaultValue="3">
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Cari..." className="pl-10 w-64" />
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NO</TableHead>
                <TableHead>NAMA TAMU</TableHead>
                <TableHead>TUJUAN</TableHead>
                <TableHead>WAKTU</TableHead>
                <TableHead>TTD</TableHead>
                <TableHead>AKSI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guestData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.no}</TableCell>
                  <TableCell>{item.namaTamu}</TableCell>
                  <TableCell>{item.tujuan}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-blue-500">🕐</span>
                        <span>{item.waktu}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span className="text-blue-500">📅</span>
                        <span>{item.tanggal}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{item.ttd}</TableCell>
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

          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Showing 1 to 1 of 1 entries
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                ‹‹
              </Button>
              <Button variant="outline" size="sm" disabled>
                ‹
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-primary text-primary-foreground"
              >
                1
              </Button>
              <Button variant="outline" size="sm" disabled>
                ›
              </Button>
              <Button variant="outline" size="sm" disabled>
                ››
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
