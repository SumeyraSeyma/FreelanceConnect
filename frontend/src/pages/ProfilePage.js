import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Pencil, Check, X } from "lucide-react";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(authUser?.bio || "");
  const [skillsInput, setSkillsInput] = useState(
    authUser?.skills?.join(", ") || ""
  );
  const [isEditingSkills, setIsEditingSkills] = useState(false);

  const handleBioUpdate = async () => {
    const trimmedBio = bioInput.replace(/\s/g, "");

    if (!trimmedBio) {
      alert("Bio cannot be empty or just whitespace.");
      return;
    }

  

    if (bioInput.length < 10) {
      toast.error("Bio must be at least 10 characters long.");
      return;
    }

    if (bioInput.length > 300) {
      toast.error("Bio cannot exceed 300 characters.");
      return;
    }

    if (bioInput === authUser?.bio) {
      toast.error("No changes made to bio.");
      return;
    }

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
    <div className="pt-20 bg-base-200 min-h-screen text-base-content">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Panel */}
          <div className="md:col-span-1 flex flex-col items-center bg-base-100 p-6 rounded-xl shadow-xl">
            <div className="relative">
              <img
                src={
                  selectedImg ||
                  authUser.image ||
                  "https://st.depositphotos.com/1537427/3571/v/950/depositphotos_35717211-stock-illustration-vector-user-icon.jpg"
                }
                alt="Profile"
                className="size-36 rounded-full object-cover border-4 border-base-content"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-1 right-1 bg-cyan-600 p-2 rounded-full cursor-pointer transition-transform hover:scale-110 ${
                  isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                }`}
              >
                <Camera className="w-5 h-5 text-base-100" />
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
            <p className="mt-3 text-sm text-base-content/60 italic">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the icon to change photo"}
            </p>
            <h2 className="mt-4 font-semibold text-xl">{authUser?.fullName}</h2>
            <p className="text-base-content/70 italic">{authUser?.email}</p>
          </div>

          {/* Right Panel */}
          <div className="md:col-span-2 space-y-6">
            {/* Bio */}
            <div className="bg-base-100 p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">Bio</h3>
                {!isEditingBio && (
                  <Pencil
                    className="cursor-pointer hover:text-cyan-600"
                    onClick={() => setIsEditingBio(true)}
                  />
                )}
              </div>
              {isEditingBio ? (
                <div className="flex items-center gap-3">
                  <textarea
                    rows={7}
                    maxLength={150}
                    className="w-full resize-none rounded-lg p-3 text-sm bg-base-100 border border-base-300 text-base-content focus:outline-none focus:ring-2 focus:ring-cyan-600 overflow-y-auto"
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                  />

                  <Check
                    className="text-green-500 cursor-pointer"
                    onClick={handleBioUpdate}
                  />
                  <X
                    className="text-red-500 cursor-pointer"
                    onClick={cancelBioEdit}
                  />
                </div>
              ) : (
                <p className="text-base-content/70 break-words whitespace-pre-wrap italic">
                  {authUser?.bio || "No bio added"}
                </p>
              )}
            </div>

            {/* Skills */}
            <div className="bg-base-100 p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">Skills</h3>
                {!isEditingSkills && (
                  <Pencil
                    className="cursor-pointer hover:text-cyan-600"
                    onClick={() => setIsEditingSkills(true)}
                  />
                )}
              </div>
              {isEditingSkills ? (
                <div className="flex items-center gap-3">
                  <textarea
                    rows={3}
                    maxLength={50}
                    type="text"
                    className="w-full resize-none rounded-lg p-3 text-sm bg-base-100 border border-base-300 text-base-content focus:outline-none focus:ring-2 focus:ring-cyan-600 overflow-y-auto"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                  />
                  <Check
                    className="text-green-500 cursor-pointer"
                    onClick={handleSkillsUpdate}
                  />
                  <X
                    className="text-red-500 cursor-pointer"
                    onClick={cancelSkillsEdit}
                  />
                </div>
              ) : (
                <p className="text-base-content/70 italic break-words whitespace-pre-wrap">
                  {authUser?.skills?.join(", ") || "No skills added"}
                </p>
              )}
            </div>

            {/* Account Info */}
            <div className="bg-base-100 p-6 rounded-xl shadow-md">
              <h3 className="font-semibold text-lg mb-3">
                Account Information
              </h3>
              <div className="text-sm text-base-content/60 flex justify-between border-b border-cyan-600 py-2 italic">
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
