import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, Settings, User } from "lucide-react";
import React from "react";
import chatifyLogo from "../chatify.svg"; // ✅ Apna logo import

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="bg-gradient-to-r from-[#0F051D] to-[#1C0C3D] shadow-md border-b border-purple-900/40 fixed w-full top-0 z-40 backdrop-blur-lg bg-opacity-90">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center gap-2 hover:opacity-80 transition-all"
            >
              <img
                src={chatifyLogo}
                alt="Chatify Logo"
                className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-md"
              />
              <h1 className="text-lg sm:text-xl font-bold text-white">
                Chatify
              </h1>
            </Link>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-2">
          <Link
  to={"/settings"}
  className="
    px-4 py-2 rounded-xl font-medium flex items-center gap-2
    bg-gradient-to-r from-violet-600 to-purple-700
    hover:from-violet-700 hover:to-purple-800
    text-white shadow-lg shadow-violet-900/40
    transition-all duration-300
  "
>
  <Settings className="w-4 h-4" />
  <span className="hidden sm:inline">Settings</span>
</Link>

{authUser && (
  <>
    <Link
      to={"/profile"}
      className="
        px-4 py-2 rounded-xl font-medium flex items-center gap-2
        bg-gradient-to-r from-pink-500 to-fuchsia-600
        hover:from-pink-600 hover:to-fuchsia-700
        text-white shadow-lg shadow-fuchsia-900/40
        transition-all duration-300
      "
    >
      <User className="size-5" />
      <span className="hidden sm:inline">Profile</span>
    </Link>

    <button
      onClick={logout}
      className="
        px-4 py-2 rounded-xl font-medium flex items-center gap-2
        bg-gradient-to-r from-red-500 to-rose-600
        hover:from-red-600 hover:to-rose-700
        text-white shadow-lg shadow-rose-900/40
        transition-all duration-300
      "
    >
      <LogOut className="size-5" />
      <span className="hidden sm:inline">Logout</span>
    </button>
  </>
)}

          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
