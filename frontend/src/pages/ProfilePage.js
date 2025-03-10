import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Pencil, Check, X } from "lucide-react";
import Navbar from "../components/Navbar";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(authUser?.bio || "");
  const [skillsInput, setSkillsInput] = useState(
    authUser?.skills?.join(", ") || ""
  );
  const [isEditingSkills, setIsEditingSkills] = useState(false);

  // Bio Güncelleme Fonksiyonu
  const handleBioUpdate = async () => {
    if (!bioInput.trim()) return;

    await updateProfile({ bio: bioInput });
    setIsEditingBio(false);
  };

  const cancelBioEdit = () => {
    setBioInput(authUser?.bio || ""); // Eski değeri geri yükle
    setIsEditingBio(false);
  };

  const handleSkillsUpdate = async () => {
    if (!skillsInput.trim()) return;

    await updateProfile({ skills: skillsInput.split(",") });
    setIsEditingSkills(false);
  };

  const cancelSkillsEdit = () => {
    setSkillsInput(authUser?.skills?.join(", ") || ""); // Eski değeri geri yükle
    setIsEditingSkills(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ image: base64Image });
    };
  };

  return (
    <div className="pt-20 bg-base-300">
      <Navbar />
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-gradient-to-bl from-slate-800 to-cyan-900 shadow-lg shadow-cyan-900 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={
                  selectedImg ||
                  authUser.image ||
                  "https://st.depositphotos.com/1537427/3571/v/950/depositphotos_35717211-stock-illustration-vector-user-icon.jpg"
                }
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
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
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 shadow-sm shadow-white rounded-lg border">
                {authUser?.fullName}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 shadow-sm shadow-white rounded-lg border">
                {authUser?.email}
              </p>
            </div>

            {/* Bio Güncelleme Alanı */}
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                Bio
              </div>

              <div className="flex shadow-sm shadow-white items-center gap-2 px-4 py-2.5 rounded-lg border">
                {isEditingBio ? (
                  <>
                    <input
                      type="text"
                      className="flex-1 border-none focus:outline-none"
                      value={bioInput}
                      onChange={(e) => setBioInput(e.target.value)}
                    />
                    <Check
                      className="text-green-500 cursor-pointer"
                      onClick={handleBioUpdate}
                    />
                    <X
                      className="text-red-500 cursor-pointer"
                      onClick={() => cancelBioEdit()}
                    />
                  </>
                ) : (
                  <>
                    <span className="flex-1">
                      {authUser?.bio || "No bio added"}
                    </span>
                    <Pencil
                      className="cursor-pointer"
                      onClick={() => setIsEditingBio(true)}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Skills Güncelleme Alanı */}
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                Skills
              </div>

              <div className="flex shadow-sm shadow-white items-center gap-2 px-4 py-2.5 rounded-lg border">
                {isEditingSkills ? (
                  <>
                    <input
                      type="text"
                      className="flex-1 bg-transparent border-none focus:outline-none"
                      value={skillsInput}
                      onChange={(e) => setSkillsInput(e.target.value)}
                    />
                    <Check
                      className="text-green-500 cursor-pointer"
                      onClick={handleSkillsUpdate}
                    />
                    <X
                      className="text-red-500 cursor-pointer"
                      onClick={() => cancelSkillsEdit()}
                    />
                  </>
                ) : (
                  <>
                    <span className="flex-1">
                      {authUser?.skills?.join(", ") || "No skills added"}
                    </span>
                    <Pencil
                      className="cursor-pointer"
                      onClick={() => setIsEditingSkills(true)}
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 shadow-lg shadow-rose-950 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b ">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
