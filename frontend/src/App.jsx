import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import React, { useEffect } from "react";
import { Loader } from "lucide-react";
import { useAuthStore } from "./store/useAuthStore";
import { Routes, Route, Navigate } from "react-router-dom"; 
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers} = useAuthStore();
  const { theme } = useThemeStore();

  console.log({onlineUsers});

  // 🔑 Auth check
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 🔑 Apply theme to <html>
  useEffect(() => {
  if (theme) {
    document.querySelector("html").setAttribute("data-theme", theme);
  }
}, [theme]);



  // Loader while checking auth
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-5 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Navbar />

      

      {/* Routes */}
   <Routes>
  {/* Default home route */}
  <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />

  {/* Login & Signup */}
  <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
  <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />

  {/* Protected */}
  <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />
  <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
</Routes>


      {/* Toasts */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "linear-gradient(135deg, #7e22ce, #9333ea)",
            color: "#fff",
            borderRadius: "12px",
            padding: "12px 16px",
            fontSize: "15px",
            fontWeight: "500",
            textAlign: "center",
            minWidth: "250px",
            boxShadow:
              "0 0 15px rgba(147, 51, 234, 0.6), 0 0 30px rgba(126, 34, 206, 0.5)",
          },
        }}
      />
    </>
  );
};

export default App;
