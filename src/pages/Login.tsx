import { useEffect } from "react";
import LoginForm from "./LoginForm";
import educationIllustration from "../assets/download.png";
// import { useRouter } from "next/navigation";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);
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
