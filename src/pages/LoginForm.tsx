import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import api from "@/utils/axios";
import { toast } from "react-toastify";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoading) return;

    setIsLoading(true);
    window.dispatchEvent(new CustomEvent("loginStart"));

    try {
      if (!email || !password) {
        toast.error("Mohon lengkapi semua data!");
        return;
      }

      if (!emailRegex.test(email)) {
        toast.error("Mohon masukkan email dengan format yang benar!");
        return;
      }

      if (!passwordRegex.test(password)) {
        toast.error(
          "Password harus memiliki minimal 8 karakter dengan kombinasi huruf besar, huruf kecil, dan angka!"
        );
        return;
      }

      const response = await api.post("/api/auth/login", { email, password });
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("id_users", response.data.user.id);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        const responseRule = await api.get(
          `/api/role/management?limit=no_limit&role=${response.data.user.id_role}&include_relations=true`
        );
        if (responseRule.status === 200) {
          localStorage.setItem("role", JSON.stringify(responseRule.data));
        }

        toast.success("Login berhasil!");
        navigate("/dashboard");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
      window.dispatchEvent(new CustomEvent("loginEnd"));
    }
  };

  const handleError = (error) => {
    if (error.response) {
      const { status, statusText } = error.response;
      if (status === 500) {
        toast.error("Server sedang bermasalah. Silakan coba lagi nanti!");
      } else if (status === 401) {
        toast.error("Email atau password salah!");
      } else if (status === 422) {
        toast.error("Data yang dimasukkan tidak valid!");
      } else if (status === 404) {
        toast.error("Endpoint login tidak ditemukan. Periksa konfigurasi API!");
      } else {
        toast.error(`Server Error ${status}: ${statusText}`);
      }
    } else if (error.request) {
      toast.error("Tidak dapat terhubung ke server. Periksa koneksi internet Anda!");
    } else {
      toast.error("Terjadi kesalahan saat login. Silakan coba lagi!");
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-foreground">
          Selamat Datang di Sistem Tata Usaha! 👋
        </h1>
        <p className="text-text-secondary">
          Silakan login untuk menggunakan sistem ini
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Masukkan email Anda"
            autoComplete="email"
            className="h-12 border-border bg-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password Anda"
              autoComplete="current-password"
              className="h-12 border-border bg-background pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="text-right">
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-sm text-primary hover:underline"
          >
            Lupa Password?
          </button>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-white"></span>
              Loading...
            </span>
          ) : (
            "Login"
          )}
        </Button>
      </form>

      <div className="mt-6 rounded-lg border bg-gray-50 p-4">
        <h3 className="mb-2 text-sm font-medium text-gray-700">
          Akun yang bisa digunakan untuk login:
        </h3>
        <div className="text-xs text-gray-600">
          <p>
            <strong>Admin:</strong>
          </p>
          <p>Email: admin12345@gmail.com</p>
          <p>Password: Admin12345</p>
        </div>
        <div className="text-xs text-gray-600">
          <p>
            <strong>Kepala Sekolah:</strong>
          </p>
          <p>Email: kepsek123@gmail.com</p>
          <p>Password: Kepsek123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;