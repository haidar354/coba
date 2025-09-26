import { Mail, Users, Calendar, BookOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import api from "@/utils/axios";

// Monthly Chart Component
const MonthlyChart = ({ data }: { data: any }) => {
  // Default empty data if no data provided
  const chartData = data || {
    "01": 0,
    "02": 0,
    "03": 0,
    "04": 0,
    "05": 0,
    "06": 0,
    "07": 0,
    "08": 0,
    "09": 0,
    "10": 0,
    "11": 0,
    "12": 0,
  };

  // Convert to array in correct month order (Jan to Dec)
  const monthOrder = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  const dataArray = monthOrder.map((month) => chartData[month] || 0);

  // Find max value for scaling
  const maxValue = Math.max(...dataArray, 1); // Minimum 1 to avoid division by zero
  const maxHeight = 20; // maximum height in Tailwind units (h-20)

  // Calculate height for each bar
  const getBarHeight = (value: number) => {
    if (value === 0) return "h-0.5"; // minimum height for visibility
    const heightRatio = (value / maxValue) * maxHeight;
    // Convert to Tailwind height classes
    if (heightRatio >= 20) return "h-20";
    if (heightRatio >= 16) return "h-16";
    if (heightRatio >= 12) return "h-12";
    if (heightRatio >= 10) return "h-10";
    if (heightRatio >= 8) return "h-8";
    if (heightRatio >= 6) return "h-6";
    if (heightRatio >= 4) return "h-4";
    if (heightRatio >= 2) return "h-2";
    return "h-1";
  };

  return (
    <div className="h-64 flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <div className="flex justify-between text-xs text-muted-foreground mb-4">
          {monthNames.map((month) => (
            <span key={month}>{month}</span>
          ))}
        </div>
        <div className="flex items-end justify-between h-32 border-b border-l border-muted">
          {dataArray.map((value, i) => (
            <div
              key={i}
              className={`w-6 ${
                value > 0 ? "bg-primary" : "bg-muted"
              } ${getBarHeight(
                value
              )} transition-all duration-300 hover:opacity-80`}
              title={`${monthNames[i]}: ${value}`}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          {Array.from({ length: Math.min(maxValue + 1, 13) }, (_, i) => (
            <span key={i}></span>
          ))}
        </div>
      </div>
    </div>
  );
};


export default function Dashboard() {
  const [totalAgenda, setTotalAgenda] = useState(0);
  const [totalAgendaYear, setTotalAgendaYear] = useState({});
  const [totalTamu, setTotalTamu] = useState(0);
  const [totalGuestYear, setTotalGuestYear] = useState({});
  
  const [totalSuratMasuk, setTotalSuratMasuk] = useState(0);
  const [totalSuratKeluar, setTotalSuratKeluar] = useState(0);
  const [totalSuratMasukYear, setTotalSuratMasukYear] = useState({});
  const [totalSuratKeluarYear, setTotalSuratKeluarYear] = useState({});
  
  const [data, setData] = useState({});

  const statsCards = [
    {
      title: "Surat Masuk",
      count: totalSuratMasuk,
      icon: Mail,
      color: "bg-blue-500",
    },
    {
      title: "Surat Keluar",
      count: totalSuratKeluar,
      icon: Mail,
      color: "bg-blue-600",
    },
    {
      title: "Total Agenda",
      count: totalAgenda,
      icon: Calendar,
      color: "bg-orange",
    },
    {
      title: "Total Tamu",
      count: totalTamu,
      icon: Users,
      color: "bg-green-500",
    },
  ];


  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Format tanggal hari ini dan kemarin
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const todayFormatted =
          today.getFullYear() +
          "-" +
          String(today.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(today.getDate()).padStart(2, "0");

        const yesterdayFormatted = yesterday.toISOString().split("T")[0];
        const currentMonth = yesterdayFormatted.split("-")[1];
        const currentYear = yesterdayFormatted.split("-")[0];

        // Config untuk header authorization
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Fetch semua data secara parallel
        const [
          todayAgendaResponse,
          monthlyAgendaResponse,
          monthlyGuestResponse,
          yearlyAgendaResponse,
          yearlyGuestResponse,
          monthlyLettersIncomingResponse,
          monthlyLettersOutgoinponse,
          yearlyLettersIncomingResponse,
          yearlyLettersOutgoingResponse,
        ] = await Promise.all([
          // Data agenda hari ini
          api.get(
            `/api/academic/agendas?limit=1&sort=-createdAt&start_date=${todayFormatted}`,
            config
          ),

          // Total agenda bulan ini
          api.get(
            `/api/academic/agendas?count=true&month=true&monthSet=${currentMonth}`
          ),

          // Total tamu bulan ini
          api.get(
            `/api/attendance/guests?count=true&month=true&monthSet=${currentMonth}`
          ),

          // Statistik agenda per tahun
          api.get(
            `/api/academic/agendas?statistics_month=true&year=true&yearSet=${currentYear}`
          ),

          // Statistik tamu per tahun
          api.get(
            `/api/attendance/guests?count=true&month=true&statistics_month=true&monthSet=${currentMonth}`
          ),
          api.get(
            `/api/academic/letters?count=true&month=true&monthSet=${currentMonth}&letter_type=incoming`
          ),
          api.get(
            `/api/academic/letters?count=true&month=true&monthSet=${currentMonth}&letter_type=outgoing`
          ),
          api.get(
            `/api/academic/letters?statistics_month=true&year=true&yearSet=${currentYear}letter_type=incoming`
          ),
          api.get(
            `/api/academic/letters?statistics_month=true&year=true&yearSet=${currentYear}letter_type=outgoing`
          ),
        ]);

        // Set semua state
        setData(todayAgendaResponse.data[0]);
        setTotalAgenda(monthlyAgendaResponse.data.count);
        setTotalTamu(monthlyGuestResponse.data.count);
        setTotalAgendaYear(yearlyAgendaResponse.data.data);
        setTotalGuestYear(yearlyGuestResponse.data);
        console.log(monthlyLettersIncomingResponse.data.count);
        setTotalSuratMasuk(monthlyLettersIncomingResponse.data.count);
        setTotalSuratKeluar(monthlyLettersOutgoinponse.data.count);
        console.log("yearlyLettersIncomingResponse: ", yearlyLettersIncomingResponse.data)
        setTotalSuratMasukYear(yearlyLettersIncomingResponse.data);
        setTotalSuratKeluarYear(yearlyLettersOutgoingResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllData();
  }, []);
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground overflow-hidden">
            <CardContent className="p-6 flex items-center">
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">
                  Selamat Datang, Admin
                </h2>
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
              {data?.event_name || "Tidak ada agenda hari ini"}
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
                <div
                  className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                >
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
            <CardDescription>
              Menampilkan riwayat agenda kegiatan
            </CardDescription>
          </CardHeader>
          <CardContent>
            {console.log(totalAgendaYear)}
            {console.log(totalGuestYear)}
            <MonthlyChart data={totalAgendaYear} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Statistik Kunjungan Tamu</CardTitle>
            <CardDescription>
              Menampilkan riwayat statistik tamu yang datang
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MonthlyChart data={totalGuestYear} />
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
            <MonthlyChart data={totalSuratMasukYear} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Statistik Surat Keluar</CardTitle>
            <CardDescription>
              Menampilkan statistik surat keluar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MonthlyChart data={totalSuratKeluarYear} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
