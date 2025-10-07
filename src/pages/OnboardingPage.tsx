"use client";
import { useState, useEffect, useRef } from "react";
import {
  Orbit,
  ChevronRight,
  Users,
  BarChart3,
  Settings,
  Globe,
  ArrowLeft,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectUserGlobalData } from "../store/orbitSlice";
import orbitProvider from "../backend/OrbitProvider";
import { useNavigate } from "react-router-dom";

export default function OnboardingPage() {
  const userGlobalData = useSelector(selectUserGlobalData);
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const [workspaceImage, setWorkspaceImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setWorkspaceImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
  // Check authentication first
  if (!userGlobalData?.user) {
    setError("You must be logged in to create a workspace.");
    return;
  }
  
  // Then validate form fields
  if (!workspaceName.trim()) {
    setError("Workspace name is required.");
    return;
  }
  
  if (!workspaceImage) {
    setError("Workspace image is required.");
    return;
  }

  setIsLoading(true);
  setError(null);

  try {
    await orbitProvider.createWorkspace({
      name: workspaceName,
      description: workspaceDescription,
      image: workspaceImage,
      creatorId: userGlobalData.user.uid,
    });
    navigate("/",{replace:true}); // ✅ This will refresh everything
  } catch (err: any) {
    setError(err.message || "Failed to create workspace.");
  } finally {
    setIsLoading(false);
  }
};

  const workspaceFeatures = [
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Invite team members, assign roles, and manage permissions for seamless collaboration",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description:
        "Track performance across all your social channels with detailed insights and reports",
    },
    {
      icon: Globe,
      title: "Multi-Platform Management",
      description:
        "Connect and manage multiple social media accounts from one centralized workspace",
    },
    {
      icon: Settings,
      title: "Custom Workflows",
      description:
        "Set up automated posting schedules, approval processes, and brand guidelines",
    },
  ];

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Left Panel - Workspace Benefits */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 lg:flex-col lg:justify-center lg:p-10 xl:p-12 lg:bg-gradient-to-br lg:from-blue-600 lg:via-indigo-600 lg:to-purple-700 lg:relative lg:overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-32 h-32 bg-white rounded-full blur-2xl"></div>
          <div className="absolute top-1/3 left-1/3 w-20 h-20 bg-white rounded-full blur-xl"></div>
        </div>

        <div
          className={`relative z-10 text-white transition-all duration-1000 ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="mb-8">
            <h1 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight">
              A New Workspace
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Awaits
              </span>
            </h1>
            <p className="text-lg xl:text-xl text-blue-100 leading-relaxed">
              Create a dedicated space where your team can collaborate, manage
              content, and track performance across all social platforms.
            </p>
          </div>

          {/* Workspace Features Grid */}
          <div className="grid grid-cols-1 gap-4">
            {workspaceFeatures.map((feature, index) => (
              <div
                key={index}
                className={`flex items-start space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl transition-all duration-700 hover:bg-white/15 ${
                  animate ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                }`}
                style={{ transitionDelay: `${600 + index * 150}ms` }}
              >
                <div className="flex-shrink-0 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <feature.icon size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-8 relative">
        {userGlobalData?.workspace && (
          <button
            onClick={() => navigate("/dashboard")}
            className="absolute top-6 left-6 text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        <div className="w-full max-w-md lg:max-w-lg">
          {/* Mobile Header */}
          <div
            className={`lg:hidden mb-6 text-center transition-all duration-700 ${
              animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-3">
              <Orbit size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Create a New Workspace
            </h1>
            <p className="text-gray-600 text-sm">
              Set up a new collaboration hub for your team.
            </p>
          </div>

          <div
            className={`bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-2xl transition-all duration-700 ease-out ${
              animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {/* Desktop Header */}
            <div className="hidden lg:block mb-6 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
                <Orbit size={28} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Create a New Workspace
              </h2>
              <p className="text-gray-600">
                Set up a new digital headquarters for your team.
              </p>
            </div>

            <div className="space-y-5">
              {/* Workspace Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Workspace Name
                </label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-400"
                  placeholder="e.g., Marketing Team, Brand Studio"
                />
              </div>

              {/* Workspace Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description{" "}
                  <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  value={workspaceDescription}
                  onChange={(e) => setWorkspaceDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-400 resize-none"
                  placeholder="What's this workspace for?"
                />
              </div>

              {/* Workspace Image */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Workspace Image
                </label>
                <div
                  className="w-full h-32 lg:h-36 border-2 border-dashed border-gray-300 rounded-xl flex justify-center items-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300 bg-gray-50/70"
                  onClick={handleImageClick}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={imagePreview}
                        alt="Workspace preview"
                        className="w-full h-full object-cover rounded-xl"
                      />
                      <div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white/90 px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                          Change
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <div className="w-10 h-10 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v14z"
                          />
                        </svg>
                      </div>
                      <div className="text-sm font-medium">Upload Image</div>
                      <div className="text-xs text-gray-400">
                        PNG, JPG up to 5MB
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm text-center">{error}</p>
                </div>
              )}

              {/* Create Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full h-12 lg:h-14 text-base lg:text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Workspace</span>
                      <ChevronRight
                        size={20}
                        className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </>
                  )}
                </div>
              </button>

              {/* Legal Text */}
              <div className="text-center pt-2">
                <p className="text-xs text-gray-500">
                  By creating a workspace, you agree to our{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Features Preview */}
          <div
            className={`hidden lg:grid mt-6 grid-cols-2 gap-3 transition-all duration-700 delay-500 ${
              animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {workspaceFeatures.slice(0, 4).map((feature, index) => (
              <div
                key={index}
                className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-xl p-3 text-center"
              >
                <div className="w-8 h-8 mx-auto mb-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <feature.icon size={16} className="text-white" />
                </div>
                <div className="text-xs font-medium text-gray-700">
                  {feature.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
