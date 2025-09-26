import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/utils/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await api.post(`api/auth/forgot-password`, {
        email,
      });
      setIsLoading(false);
      toast.success("Jika email tersebut ada, tautan untuk mengatur ulang kata sandi telah dikirim.", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => navigate("/login"), 3000);
      return response.data;
    } catch (error) {
      setIsLoading(false);
      toast.error("Failed to send reset request. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Error submitting data:", error);
      throw error;
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-foreground">
          Lupa Password
        </h1>
        <p className="text-text-secondary">
          Masukkan email Anda untuk mereset password
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

        <Button
          type="submit"
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="w-8 h-8 border-4 border-gray-300 rounded-full border-t-blue-500 animate-spin"></div>
          ) : (
            "Kirim Permintaan Reset"
          )}
        </Button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;