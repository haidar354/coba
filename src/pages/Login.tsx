import { useEffect, useState } from "react";
import LoginForm from "./LoginForm";
import educationIllustration from "../assets/download.png";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Checking token:", token ? "exists" : "not found");

        if (token) {
          console.log("Token found, navigating to dashboard");
          navigate("/dashboard", { replace: true });
        } else {
          console.log("No token found, staying on login page");
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setIsChecking(false);
      }
    };

    // Add a small delay to prevent immediate navigation conflicts
    const timeoutId = setTimeout(checkAuth, 100);

    return () => clearTimeout(timeoutId);
  }, [navigate]);

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 rounded-full border-t-blue-500 animate-spin mx-auto mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-illustration-bg items-center justify-center p-12">
        <div className="max-w-lg">
          <img
            src={educationIllustration}
            alt="Educational System Illustration"
            className="w-full h-auto max-w-full max-h-full object-contain"
          />
        </div>
      </div>
      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 bg-login-bg flex items-center justify-center p-8">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
