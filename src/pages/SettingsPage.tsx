import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUserGlobalData, setUserData } from "../store/orbitSlice";
import orbitProvider from "../backend/OrbitProvider";
import uploadImageToFirebase from "../utils/uploadImageToFirebase";
import { UserData } from "../types";

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userGlobalData = useSelector(selectUserGlobalData);
  const userData = userGlobalData?.userData;

  const [bio, setBio] = useState(userData?.bio || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(userData?.avatarUrl || "");
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!userData) return;
    setIsSaving(true);
    setSuccessMessage("");

    try {
      let avatarUrl = userData.avatarUrl;
      if (avatarFile) {
        avatarUrl = await uploadImageToFirebase(
          avatarFile,
          "userProfilePics"
        );
      }

      const updatedData: Partial<UserData> = {
        bio,
        avatarUrl,
      };

      await orbitProvider.updateUserData(userData.uid, updatedData);

      const newUserData = { ...userData, ...updatedData };
      dispatch(setUserData(newUserData));

      setSuccessMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white text-gray-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Settings</h1>
        <div className="max-w-md mx-auto bg-gray-50 p-6 rounded-lg shadow-md">
          <div className="flex flex-col items-center mb-6">
            <img
              src={avatarPreview || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Change Picture
            </button>
          </div>

          <div className="mb-6">
            <label
              htmlFor="bio"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
              placeholder="Tell us about yourself"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 disabled:bg-indigo-300"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>

          {successMessage && (
            <p className="text-green-500 text-center mt-4">
              {successMessage}
            </p>
          )}

          <div className="mt-8 border-t pt-6">
            <button
              onClick={() => navigate("/tos")}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg mb-4 transition-colors duration-300"
            >
              Terms of Service
            </button>
            <button
              onClick={() => navigate("/pp")}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors duration-300"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;