import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserGlobalData } from "../store/orbitSlice";
import { Automation, PostData } from "../types";
import orbitProvider from "../backend/OrbitProvider";
import {
  Zap,
  FileText,
  TrendingUp,
  Calendar,
  Clock,
  Cpu,
  Eye,
  Heart,
  MessageSquare,
  Repeat,
  Share2,
  Settings,
  Play,
  Pause,
  Trash2,
  Edit,
  ChevronLeft,
  Check,
  Save,
  X,
} from "lucide-react";
import LoadingIndicator from "../components/LoadingIndicator";
import PiIcon from "../components/PiIcon";

const AutomationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [automation, setAutomation] = useState<Automation | null>(null);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const userGlobalData = useSelector(selectUserGlobalData);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchAutomationAndPosts = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const foundAutomation = await orbitProvider.getAutomationById(id);
        setAutomation(foundAutomation);
        if (foundAutomation) {
          setFormData({
            name: foundAutomation.name,
            description: foundAutomation.description,
          });
          const fetchedPosts = await orbitProvider.getPostsByAutomationId(id);
          setPosts(fetchedPosts as PostData[]);
        }
      } catch (error) {
        console.error("Error fetching automation details or posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAutomationAndPosts();
  }, [id]);

  const handleStop = async () => {
    if (!id) return;
    if (window.confirm("Are you sure you want to stop this automation? This action cannot be undone.")) {
      try {
        await orbitProvider.stopAutomation(id);
        setAutomation((prev) => (prev ? { ...prev, status: "stopped" } : null));
      } catch (error) {
        console.error("Error stopping automation:", error);
      }
    }
  };

  const handlePause = async () => {
    if (!id) return;
    try {
      await orbitProvider.pauseAutomation(id);
      setAutomation((prev) => (prev ? { ...prev, status: "paused" } : null));
    } catch (error) {
      console.error("Error pausing automation:", error);
    }
  };

  const handleResume = async () => {
    if (!id || !userGlobalData?.userData?.uid) return;
    try {
      await orbitProvider.resumeAutomation(id, userGlobalData.userData.uid);
      setAutomation((prev) => (prev ? { ...prev, status: "running" } : null));
    } catch (error) {
      console.error("Error resuming automation:", error);
      alert(error);
    }
  };

  const handleEdit = () => {
    if (!automation) return;
    setFormData({
      name: automation.name,
      description: automation.description,
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!id) return;
    try {
      await orbitProvider.updateAutomation(id, {
        name: formData.name,
        description: formData.description,
      });
      setAutomation((prev) =>
        prev ? { ...prev, name: formData.name, description: formData.description } : null
      );
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating automation:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const totalEngagement = posts.reduce((acc, post) => {
    return (
      acc +
      (post.publicMetrics?.likes ?? 0) +
      (post.publicMetrics?.comments ?? 0) +
      (post.publicMetrics?.shares ?? 0)
    );
  }, 0);

  const totalReach = posts.reduce((acc, post) => {
    return acc + (post.publicMetrics?.views ?? 0);
  }, 0);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <LoadingIndicator />
      </div>
    );
  }

  if (!automation) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <Zap className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">
          Automation Not Found
        </h2>
        <p className="text-gray-500 mt-2">
          The requested automation could not be found.
        </p>
        <button
          onClick={() => navigate("/automation")}
          className="mt-6 flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Automations
        </button>
      </div>
    );
  }

  const statusConfig = {
    running: {
      label: "Running",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: Play,
    },
    paused: {
      label: "Paused",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: Pause,
    },
    stopped: {
      label: "Stopped",
      color: "bg-red-100 text-red-800 border-red-200",
      icon: Trash2,
    },
    completed: {
      label: "Completed",
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: Check,
    },
  };

  const currentStatus =
    statusConfig[automation.status as keyof typeof statusConfig] ||
    statusConfig.completed;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </button>
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="text-2xl md:text-3xl font-bold text-gray-900 w-full border-b-2 border-gray-300 focus:border-indigo-500 outline-none bg-transparent"
                    placeholder="Automation Name"
                  />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="text-sm text-gray-600 mt-1 border rounded-md p-2 w-full"
                    placeholder="Automation Description"
                    rows={3}
                  />
                   <div className="mt-1 p-4 border-2 border-dashed border-gray-300 rounded-md text-center text-gray-500">
                    <p className="text-sm">Brand Reference Image editing coming soon.</p>
                  </div>
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center truncate">
                    <Zap className="w-7 h-7 text-yellow-500 mr-2 flex-shrink-0" />
                    <span className="truncate">{automation.name}</span>
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    {automation.description}
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="p-2 bg-gray-300 rounded-lg hover:bg-gray-400 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${currentStatus.color}`}
                  >
                    <currentStatus.icon className="w-4 h-4" />
                    {currentStatus.label}
                  </div>
                   <button
                      onClick={handleEdit}
                      className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                  {automation.status === "running" && (
                    <button
                      onClick={handlePause}
                      className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
                      title="Pause Automation"
                    >
                      <Pause className="w-4 h-4 text-yellow-600" />
                    </button>
                  )}
                  {automation.status === "paused" && (
                    <button
                      onClick={handleResume}
                      className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
                      title="Resume Automation"
                    >
                      <Play className="w-4 h-4 text-green-600" />
                    </button>
                  )}
                  {automation.status !== "stopped" &&
                    automation.status !== "completed" && (
                      <button
                        onClick={handleStop}
                        className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
                        title="Stop Automation"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    )}
                </>
              )}
            </div>
          </div>
        </header>

        {automation.status === "paused" && automation.pauseReason && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-r-lg">
            <p className="font-bold">Automation Paused</p>
            <p>Reason: {automation.pauseReason}</p>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center text-gray-500 mb-1">
              <FileText className="w-4 h-4 mr-2" />
              <p className="text-sm">Total Posts</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center text-gray-500 mb-1">
              <Eye className="w-4 h-4 mr-2" />
              <p className="text-sm">Total Reach</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalReach}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center text-gray-500 mb-1">
              <Heart className="w-4 h-4 mr-2" />
              <p className="text-sm">Engagement</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {totalEngagement}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center text-gray-500 mb-1">
              <PiIcon className="w-4 h-4 mr-2" />
              <p className="text-sm">Total Cost</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {automation.totalCost} Pi
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Configuration
              </h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Goal</span>
                  <span className="font-medium text-gray-800 text-right">
                    {automation.goal}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Content Type</span>
                  <span className="font-medium text-gray-800 capitalize">
                    {automation.contentType.replace("-", " + ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Frequency</span>
                  <span className="font-medium text-gray-800 capitalize">
                    {automation.frequency.replace("-", " ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">AI Model</span>
                  <span className="font-medium text-gray-800 capitalize">
                    {automation.model}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">End Date</span>
                  <span className="font-medium text-gray-800">
                    {automation.endDate === "infinite"
                      ? "Never"
                      : new Date(automation.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Generated Posts */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Generated Posts
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <p className="text-gray-800 text-sm mb-3">{post.text}</p>
                      {post.images && post.images.length > 0 && (
                        <img
                          src={post.images[0]}
                          alt="Post"
                          className="rounded-lg mb-3 max-h-64 w-full object-cover"
                        />
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="font-semibold capitalize">
                          {post.platformId}
                        </span>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />{" "}
                            {post.publicMetrics?.likes ?? 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />{" "}
                            {post.publicMetrics?.comments ?? 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Repeat className="w-3 h-3" />{" "}
                            {post.publicMetrics?.shares ?? 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />{" "}
                            {post.publicMetrics?.views ?? 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No posts generated yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationDetailsPage;
