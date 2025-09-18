import { Mail, Users, Calendar, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const statsCards = [
  { title: "Surat Masuk", count: 0, icon: Mail, color: "bg-blue-500" },
  { title: "Surat Keluar", count: 0, icon: Mail, color: "bg-blue-600" },
  { title: "Total Agenda", count: 1, icon: Calendar, color: "bg-orange" },
  { title: "Total Tamu", count: 0, icon: Users, color: "bg-green-500" }
];

const statusCards = [
  { label: "Baru", count: 0, color: "bg-orange/10 text-orange" },
  { label: "Diproses", count: 0, color: "bg-blue-500/10 text-blue-500" },
  { label: "Selesai", count: 0, color: "bg-green-500/10 text-green-500" },
  { label: "Draft", count: 0, color: "bg-gray-500/10 text-gray-500" },
  { label: "Menunggu", count: 0, color: "bg-blue-500/10 text-blue-500" },
  { label: "Disetujui", count: 0, color: "bg-green-500/10 text-green-500" },
  { label: "Ditolak", count: 0, color: "bg-red-500/10 text-red-500" }
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground overflow-hidden">
            <CardContent className="p-6 flex items-center">
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">Selamat Datang, Super A...</h2>
                <p className="text-primary-foreground/90">Sistem Tata Usaha</p>
              </div>
              <div className="w-32 h-32 bg-primary-foreground/10 rounded-full flex items-center justify-center">
                <div className="w-24 h-24 bg-primary-foreground rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-primary rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="bg-gradient-to-r from-orange to-orange/80 text-orange-foreground">
          <CardContent className="p-6">
            <div className="flex items-start gap-2 mb-2">
              <Badge className="bg-orange-foreground/20 text-orange-foreground hover:bg-orange-foreground/20">
                🔔
              </Badge>
              <h3 className="font-semibold">Informasi Kepala Sekolah</h3>
            </div>
            <p className="text-sm text-orange-foreground/90 mb-2">
              Aktivitas Kepala Sekolah saat ini
            </p>
            <p className="text-xs text-orange-foreground/80">
              Dinas Keluar - Rapat Kepala Sekolah Se DIY
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{stat.count}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Statistik Agenda</CardTitle>
            <CardDescription>Menampilkan riwayat agenda kegiatan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex flex-col items-center justify-center">
              <div className="w-full max-w-md">
                <div className="flex justify-between text-xs text-muted-foreground mb-4">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'].map(month => (
                    <span key={month}>{month}</span>
                  ))}
                </div>
                <div className="flex items-end justify-between h-32 border-b border-l border-muted">
                  {Array.from({ length: 12 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-6 ${i === 8 ? 'bg-primary h-20' : 'bg-muted h-2'} ${i === 8 ? '' : 'opacity-50'}`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  {Array.from({ length: 13 }, (_, i) => (
                    <span key={i}>{i}</span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Statistik Kunjungan Tamu</CardTitle>
            <CardDescription>Menampilkan riwayat statistik tamu yang datang</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-muted-foreground mb-2">∞</div>
                <p className="text-muted-foreground">Infinity</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Statistik Surat Masuk</CardTitle>
            <CardDescription>Menampilkan statistik surat masuk</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-muted-foreground mb-2">0</div>
                <p className="text-muted-foreground">Total Surat Masuk</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Statistik Surat Keluar</CardTitle>
            <CardDescription>Menampilkan statistik surat keluar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-muted-foreground mb-2">0</div>
                <p className="text-muted-foreground">Total Surat Keluar</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {statusCards.map((status, index) => (
          <Card key={index}>
            <CardContent className="p-4 text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${status.color} mb-2`}>
                <span className="font-semibold">{status.count}</span>
              </div>
              <p className="text-sm font-medium">{status.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}