import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import KlasifikasiSurat from "./pages/KlasifikasiSurat";
// import Sekolah from "./pages/Sekolah";
import Agenda from "./pages/Agenda";
import BukuTamu from "./pages/BukuTamu";
import DaftarSurvei from "./pages/DaftarSurvei";
import HasilSurvei from "./pages/HasilSurvei";
import ManajemenRole from "./pages/ManajemenRole";
import TambahRole from "./pages/TambahRole";
import EditRole from "./pages/EditRole";
import NotFound from "./pages/NotFound";
import Digitalsignage from "./pages/Digitalsignage";
import Siswa from "./pages/Siswa";
import Guru from "./pages/Guru";
import Presensi from "./pages/Presensi";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/presensi"
            element={
              <Layout>
                <Presensi />
              </Layout>
            }
          />
          <Route
            path="/klasifikasi-surat"
            element={
              <Layout>
                <KlasifikasiSurat />
              </Layout>
            }
          />
          {/* <Route
            path="/sekolah"
            element={
              <Layout>
                <Sekolah />
              </Layout>
            }
          /> */}
          <Route
            path="/agenda"
            element={
              <Layout>
                <Agenda />
              </Layout>
            }
          />
          <Route
            path="/buku-tamu"
            element={
              <Layout>
                <BukuTamu />
              </Layout>
            }
          />
          <Route
            path="/survei/daftar"
            element={
              <Layout>
                <DaftarSurvei />
              </Layout>
            }
          />
          <Route
            path="/survei/hasil"
            element={
              <Layout>
                <HasilSurvei />
              </Layout>
            }
          />
          <Route
            path="/manajemen-role"
            element={
              <Layout>
                <ManajemenRole />
              </Layout>
            }
          />
          <Route
            path="/manajemen-role/tambah"
            element={
              <Layout>
                <TambahRole />
              </Layout>
            }
          />
          <Route
            path="/manajemen-role/edit/:id"
            element={
              <Layout>
                <EditRole />
              </Layout>
            }
          />
          <Route
            path="/manajemen-role/edit/:id"
            element={
              <Layout>
                <EditRole />
              </Layout>
            }
          />
          <Route
            path="/siswa"
            element={
              <Layout>
                <Siswa />
              </Layout>
            }
          />
          <Route
            path="/guru"
            element={
              <Layout>
                <Guru />
              </Layout>
            }
          />
          <Route path="/guest-visits/landing" element={<Digitalsignage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
