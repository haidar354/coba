import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import KlasifikasiSurat from "./pages/KlasifikasiSurat";
import Agenda from "./pages/Agenda";
import BukuTamu from "./pages/BukuTamu";
import DaftarSurvei from "./pages/DaftarSurvei";
import HasilSurvei from "./pages/HasilSurvei";
import ManajemenRole from "./pages/ManajemenRole";
import TambahRole from "./pages/TambahRole";
import TambahUser from "./pages/TambahUser";
import EditRole from "./pages/EditRole";
import EditUser from "./pages/EditUser";
import ManagementUsers from "./pages/ManajemenUsers";
import NotFound from "./pages/NotFound";
import Digitalsignage from "./pages/DigitalSignageOptimized";
import Siswa from "./pages/Siswa";
import Guru from "./pages/Guru";
import Presensi from "./pages/Presensi";
import PresensiGuru from "./pages/presensi/PresensiGuru";
import Digitalsignage2 from "./pages/DigitalSignageResposive";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import { ToastContainer } from "react-toastify";
import Kelas from "./pages/Kelas";
import Jurusan from "./pages/Jurusan";
import DaftarPertanyaan from "./pages/DaftarPertanyaan";
import "react-toastify/dist/ReactToastify.css";
import Kelas_coba from "./pages/Kelas _coba";
import TahunAjaran from "./pages/TahunAjaran";

const queryClient = new QueryClient();

const router = createBrowserRouter(
  [
    { path: "/", element: <Login /> },
    { path: "/login", element: <Login /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/coba", element: <Kelas_coba /> },
    {
      path: "/dashboard",
      element: (
        <Layout>
          <Dashboard />
        </Layout>
      ),
    },
    {
      path: "/kelas",
      element: (
        <Layout>
          <Kelas />
        </Layout>
      ),
    },
    {
      path: "/jurusan",
      element: (
        <Layout>
          <Jurusan />
        </Layout>
      ),
    },
    {
      path: "/siswa",
      element: (
        <Layout>
          <Siswa />
        </Layout>
      ),
    },
    {
      path: "/guru",
      element: (
        <Layout>
          <Guru />
        </Layout>
      ),
    },
    {
      path: "/presensi",
      element: (
        <Layout>
          <Presensi />
        </Layout>
      ),
    },
    {
      path: "/presensi/presensi-guru",
      element: (
        <Layout>
          <PresensiGuru />
        </Layout>
      ),
    },
    {
      path: "/klasifikasi-surat",
      element: (
        <Layout>
          <KlasifikasiSurat />
        </Layout>
      ),
    },
    {
      path: "/agenda",
      element: (
        <Layout>
          <Agenda />
        </Layout>
      ),
    },
    {
      path: "/buku-tamu",
      element: (
        <Layout>
          <BukuTamu />
        </Layout>
      ),
    },
    {
      path: "/survei/daftar",
      element: (
        <Layout>
          <DaftarSurvei />
        </Layout>
      ),
    },
    {
      path: "/survei/pertanyaan",
      element: (
        <Layout>
          <DaftarPertanyaan />
        </Layout>
      ),
    },
    {
      path: "/survei/pertanyaan/:id",
      element: (
        <Layout>
          <DaftarPertanyaan />
        </Layout>
      ),
    },
    {
      path: "/survei/hasil",
      element: (
        <Layout>
          <HasilSurvei />
        </Layout>
      ),
    },
    {
      path: "/manajemen-role",
      element: (
        <Layout>
          <ManajemenRole />
        </Layout>
      ),
    },
    {
      path: "/manajemen-user",
      element: (
        <Layout>
          <ManagementUsers />
        </Layout>
      ),
    },
    {
      path: "/manajemen-role/tambah",
      element: (
        <Layout>
          <TambahRole />
        </Layout>
      ),
    },
    {
      path: "/manajemen-user/tambah",
      element: (
        <Layout>
          <TambahUser />
        </Layout>
      ),
    },
    {
      path: "/manajemen-role/edit/:id",
      element: (
        <Layout>
          <EditRole />
        </Layout>
      ),
    },
    {
      path: "/manajemen-user/edit/:id",
      element: (
        <Layout>
          <EditUser />
        </Layout>
      ),
    },
    { path: "/guest-visits/landing/responsive", element: <Digitalsignage2 /> },
    { path: "/guest-visits/landing", element: <Digitalsignage /> },
    {
      path: "/tahun-ajaran",
      element: (
        <Layout>
          <TahunAjaran />
        </Layout>
      ),
    },
    { path: "*", element: <NotFound /> },
  ],
  {
    basename: "/tu/",
    future: {
      v7_relativeSplatPath: true,
      // @ts-expect-error v7 flag not in types yet
      v7_startTransition: true,
    },
  }
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* REMOVED: <Toaster /> and <Sonner /> to avoid conflicts */}
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;