import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import api from "@/utils/axios";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsloading(true);

      const response = await api.post(`api/auth/login`, {
        email: "admin12345@gmail.com",
        password: "Admin12345",
      });
      localStorage.setItem("token", response.data.token);
      setIsloading(false);
      navigate("/dashboard");
      return response.data;
    } catch (error) {
      console.error("Error submitting data:", error);
      // setIsloadingQuestion(false); // Reset loading state on error
      throw error;
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="flex justify-end mb-8"></div>

      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-foreground">
          Selamat Datang di Sistem Tata Usaha! 👋
        </h1>
        <p className="text-text-secondary">
          Silahkan Login untuk menggunakan sistem ini
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-sm font-medium text-foreground"
          >
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 border-border bg-background"
            // required
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-foreground"
          >
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 border-border bg-background pr-10"
              // required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="text-right">
          <button
            onClick={() => navigate("/forgot-password")}
            type="button"
            className="text-primary text-sm hover:underline"
          >
            Lupa Password?
          </button>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
        >
          {isLoading ? (
            <div className="w-8 h-8 border-4 border-gray-300 rounded-full border-t-blue-500 animate-spin"></div>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
