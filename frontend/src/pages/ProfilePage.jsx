import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const profileImage =
    selectedImg || authUser?.profilePic || "/avatar_icon.png";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F051D] to-[#1C0C3D] px-4 pt-20">
      <div className="w-full max-w-lg bg-white/5 backdrop-blur-2xl rounded-2xl shadow-xl border border-white/10 p-8 space-y-8 animate-fadeIn">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            My Profile
          </h1>
          <p className="text-gray-400 text-sm">Manage your profile details</p>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative group">
            <div className="rounded-full border-4 border-purple-500 p-1 shadow-lg transition-transform duration-300 group-hover:scale-105">
              <img
                src={profileImage}
                alt="Profile"
                className="size-32 rounded-full object-cover"
              />
            </div>
            <label
              htmlFor="avatar-upload"
              className={`absolute bottom-2 right-2 bg-gradient-to-r from-purple-500 to-pink-600 p-2 rounded-full cursor-pointer shadow-md transition-transform duration-200 hover:scale-110
                ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
              `}
            >
              <Camera className="w-4 h-4 text-white" />
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </label>
          </div>
          <p className="text-xs text-gray-400 italic">
            {isUpdatingProfile
              ? "Uploading..."
              : "Click the camera to update your photo"}
          </p>
        </div>

        {/* User Info */}
        <div className="space-y-5">
          <div>
            <label className="text-xs text-gray-400 flex items-center gap-1 mb-1">
              <User className="w-4 h-4" /> Full Name
            </label>
            <p className="px-4 py-2.5 bg-gradient-to-r from-white/10 to-white/5 text-white rounded-lg border border-gray-700 text-sm shadow-inner">
              {authUser?.fullName}
            </p>
          </div>

          <div>
            <label className="text-xs text-gray-400 flex items-center gap-1 mb-1">
              <Mail className="w-4 h-4" /> Email Address
            </label>
            <p className="px-4 py-2.5 bg-gradient-to-r from-white/10 to-white/5 text-white rounded-lg border border-gray-700 text-sm shadow-inner">
              {authUser?.email}
            </p>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-5 border border-white/10 shadow-lg hover:shadow-purple-500/30 transition-all duration-300">
          <h2 className="text-lg font-semibold text-white mb-4">Account Information</h2>
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex items-center justify-between border-b border-gray-700 pb-2">
              <span>Member Since</span>
              <span>{authUser?.createdAt?.split("T")[0]}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Account Status</span>
              <span className="text-green-400 font-semibold">✔ Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
