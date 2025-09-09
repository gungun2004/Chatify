import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react"; 
import { useAuthStore } from "../store/useAuthStore.js";
import chatifyLogo from '../chatify.svg'; 
import { Link } from "react-router-dom"; 
import toast from "react-hot-toast";
// ✅ sahi import

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false); 

  const { signup, isSigningUp } = useAuthStore();

 const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) {
      try {
        await signup(formData); // wait for signup
        navigate("/"); // 👈 redirect to homepage
      } catch (error) {
        console.log("Signup failed:", error);
      }
    }
  };
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-black via-gray-900 to-purple-900 mt-5">
      {/* Left side (Logo + Branding) */}
      <div className="flex flex-col items-center justify-center text-center px-10 pl-30">
        <img src={chatifyLogo} alt="Chatify Logo" className="w-120 h-90 drop-shadow-lg" />

        <p className="text-gray-400 mt-2 text-lg">Connect. Chat. Share instantly 🚀</p>
      </div>

      {/* Right side (Form) */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-purple-500/20">
          <h1 className="text-3xl font-bold text-center text-white mb-8">
            Create Account
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-white">
            
            {/* Full Name */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-10 py-3 rounded-md bg-gray-800/70 placeholder-gray-400 text-white 
                           focus:ring-2 focus:ring-purple-500 outline-none"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="example@mail.com"
                className="w-full px-10 py-3 rounded-md bg-gray-800/70 placeholder-gray-400 text-white 
                           focus:ring-2 focus:ring-purple-500 outline-none"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {/* Password with Eye Toggle */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="******"
                className="w-full px-10 py-3 pr-10 rounded-md bg-gray-800/70 placeholder-gray-400 text-white 
                           focus:ring-2 focus:ring-purple-500 outline-none"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSigningUp}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-violet-700 
                         hover:from-purple-600 hover:to-violet-800 
                         transition-all duration-300 text-white font-semibold rounded-md shadow-md"
            >
              {isSigningUp ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-gray-400 text-sm mt-6 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-400 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
