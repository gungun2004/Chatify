import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import chatifyLogo from "../chatify.svg";
import toast from "react-hot-toast";


const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

    const { login, isLoggingIn } = useAuthStore();
  const navigate = useNavigate(); 

    

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await login(formData);  
    toast.dismiss(); // ❌ Purane toast hatado

    if (res?.success) {
      toast.success("🎉 Login Successful! Welcome back 👋", {
        icon: "🚀",
      });
      navigate("/");
    } else {
      toast.error("❌ Invalid email or password!");
    }
  } catch (error) {
    toast.dismiss();
    toast.error("⚠️ Something went wrong, please try again!");
    console.error(error);
  }
};




  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F051D] to-[#1C0C3D] px-4 mt-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white/5 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-lg border border-white/10">
        
        {/* Left Panel */}
        <div className="bg-gradient-to-br from-purple-400 to-indigo-500 p-10 flex flex-col items-center justify-center text-white space-y-6">
          {/* Chatify Logo */}
          <div className="flex flex-col items-center space-y-4">
            <img src={chatifyLogo} alt="Chatify Logo" className="w-50 h-50 object-contain drop-shadow-lg" />
            
          </div>

          <h2 className="text-3xl font-bold">Welcome Back!</h2>
          <p className="text-center text-sm text-white/80 max-w-sm">
            Enter your personal details to use all of Chatify’s features.
          </p>
          <Link
            to="/signup"
            className="mt-4 px-6 py-2 border border-white text-white rounded-full hover:bg-white hover:text-purple-700 transition"
          >
            Sign Up
          </Link>
        </div>

        {/* Right Panel (Login Form) */}
        <div className="p-10 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white">Login to your account</h2>
            <p className="text-sm text-gray-300 mt-1">Please enter your details</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-white font-medium">Email</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input input-bordered w-full pl-10 bg-white/10 text-white placeholder-gray-400 border-gray-600"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-white font-medium">Password</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="input input-bordered w-full pl-10 pr-10 bg-white/10 text-white placeholder-gray-400 border-gray-600"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full bg-gradient-to-r from-purple-500 to-violet-700 hover:from-purple-600 hover:to-violet-800 text-white border-none flex items-center justify-center gap-2"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-300">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-purple-400 hover:underline">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
