"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import orbitProvider from "../backend/OrbitProvider";
import {
  Sparkles,
  Hash,
  RefreshCw,
  Clock,
  Palette,
  TrendingUp,
  Lightbulb,
  Copy,
  ThumbsUp,
  Target,
  Eye,
  Heart,
  BarChart3,
  Settings,
  Upload,
  Download,
  Share2,
  Wand2,
  Save,
  Image,
  Video,
} from "lucide-react";
import ImageGenerationTool from "../components/ImageGenerationTool";
import VideoGenerationTool from "../components/VideoGenerationTool";
import { useSelector } from "react-redux";
import { selectUserGlobalData } from "../store/orbitSlice";
import PiIcon from "../components/PiIcon";

const AiAssistPage = () => {
  const navigate = useNavigate();
  const userGlobalData = useSelector(selectUserGlobalData);
  const [error, setError] = useState<string | null>(null);

  const AI_PRICING = {
    CAPTION_GENERATION: 0.1,
    REPURPOSE_CONTENT: 0.2,
    GENERATE_POSTS: 0.5,
    HASHTAG_GENERATION: 0, // Free
    IDEA_GENERATION: 0, // Free
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [activeTab, setActiveTab] = useState("generator");
  const [inputText, setInputText] = useState("");
  const [selectedPlatform, setSelectedPlatform] =
    useState<PlatformType>("instagram");
  const [selectedTone, setSelectedTone] = useState("casual");
  const [generatedCaptions, setGeneratedCaptions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentProject, setCurrentProject] = useState("New Project");
  type PlatformType = "instagram" | "twitter" | "linkedin" | "reddit";
  const [repurposeInput, setRepurposeInput] = useState("");
  const [repurposedContent, setRepurposedContent] = useState<
    Record<string, string>
  >({});
  const [isRepurposing, setIsRepurposing] = useState<Record<string, boolean>>(
    {}
  );
  const [hashtagTopic, setHashtagTopic] = useState("");
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([]);
  const [isGeneratingHashtags, setIsGeneratingHashtags] = useState(false);
  const [ideaTopic, setIdeaTopic] = useState("");
  const [contentIdeas, setContentIdeas] = useState<any[]>([]);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [expandedIdea, setExpandedIdea] = useState<string | null>(null);
  const [postSuggestions, setPostSuggestions] = useState<Record<string, any[]>>(
    {}
  );
  const [isGeneratingPosts, setIsGeneratingPosts] = useState<
    Record<string, boolean>
  >({});
  const [selectedPlatformsForPosts, setSelectedPlatformsForPosts] = useState<
    string[]
  >([]);

  const mockCaptions: Record<PlatformType, string[]> = {
    instagram: [],
    twitter: [],
    linkedin: [],
    reddit: [],
  };

  const mockHashtags: string[] = [];

  const features = [
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "AI-Powered Caption Generator",
      description:
        "Transform your ideas into platform-optimized captions instantly",
      color: "bg-indigo-50 text-indigo-700",
    },
    {
      icon: <Hash className="w-5 h-5" />,
      title: "Hashtag Intelligence",
      description: "Data-driven hashtags that boost discovery in your niche",
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      icon: <RefreshCw className="w-5 h-5" />,
      title: "Smart Repurposing",
      description:
        "One content piece → multiple platform versions automatically",
      color: "bg-blue-50 text-blue-700",
    },
    {
      icon: <Palette className="w-5 h-5" />,
      title: "Tone & Style Adjustments",
      description:
        "Adapt your voice: funny, professional, motivational, or bold",
      color: "bg-rose-50 text-rose-700",
    },
  ];

  const mockBestTimes: any[] = [];

  const platforms = [
    { id: "linkedin", name: "LinkedIn", icon: "💼", color: "bg-blue-700" },
    { id: "twitter", name: "Twitter", icon: "🐦", color: "bg-slate-800" },
    {
      id: "instagram",
      name: "Instagram",
      icon: "📸",
      color: "bg-gradient-to-r from-purple-600 to-pink-600",
    },
    { id: "reddit", name: "Reddit", icon: "🤖", color: "bg-orange-500" },
  ];

  const tones = [
    { id: "professional", name: "Professional", emoji: "💼" },
    { id: "casual", name: "Casual", emoji: "😊" },
    { id: "authoritative", name: "Authoritative", emoji: "🎯" },
    { id: "inspirational", name: "Inspirational", emoji: "💪" },
    { id: "analytical", name: "Analytical", emoji: "📊" },
    { id: "conversational", name: "Conversational", emoji: "💬" },
  ];

  const handleGenerate = async ({ append = false }: { append?: boolean } = {}) => {
    if (!inputText.trim() || !userGlobalData?.user) return;
    setIsGenerating(true);
    setError(null);
    if (!append) {
      setGeneratedCaptions([]);
    }

    const cost = AI_PRICING.CAPTION_GENERATION;
    try {
      await orbitProvider.deductPi(userGlobalData.user.uid, cost);
    } catch (error: any) {
      setError(error.message);
      setIsGenerating(false);
      return;
    }

    try {
      const fullPrompt = `Generate 3 social media captions for the ${selectedPlatform} platform with a ${selectedTone} tone. The topic is: "${inputText}". Return the response as a valid JSON array of strings. For example: ["caption 1", "caption 2", "caption 3"]`;
      const response = await orbitProvider.getAiTextResponse(fullPrompt);
      const cleanedResponse = response.replace(/```json\n|\n```/g, "").trim();
      const captions = JSON.parse(cleanedResponse);
      if (append) {
        setGeneratedCaptions((prev) => [...prev, ...captions]);
      } else {
        setGeneratedCaptions(captions);
      }
    } catch (error) {
      await orbitProvider.addPi(userGlobalData.user.uid, cost);
      console.error("Failed to generate captions:", error);
      if (!append) {
        setGeneratedCaptions([
          "Sorry, we couldn't generate captions at this time. Please try again.",
        ]);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRepurpose = async (platformId: string) => {
    if (!repurposeInput.trim() || !userGlobalData?.user) return;
    setIsRepurposing((prev) => ({ ...prev, [platformId]: true }));
    setError(null);

    const cost = AI_PRICING.REPURPOSE_CONTENT;
    try {
      await orbitProvider.deductPi(userGlobalData.user.uid, cost);
    } catch (error: any) {
      setError(error.message);
      setIsRepurposing((prev) => ({ ...prev, [platformId]: false }));
      return;
    }

    try {
      const prompt = `Repurpose the following content for the ${platformId} platform. Keep the core message but adapt the style, length, and format. Here is the content: "${repurposeInput}" \n Provide the repurposed content only without any additional text. No yapping. No markdown, just the content, plain and simple.`;
      const result = await orbitProvider.getAiTextResponse(prompt);
      setRepurposedContent((prev) => ({ ...prev, [platformId]: result }));
    } catch (error) {
      await orbitProvider.addPi(userGlobalData.user.uid, cost);
      console.error(`Failed to repurpose for ${platformId}:`, error);
      setRepurposedContent((prev) => ({
        ...prev,
        [platformId]: "Failed to generate.",
      }));
    } finally {
      setIsRepurposing((prev) => ({ ...prev, [platformId]: false }));
    }
  };

  const handleRepurposeAll = () => {
    platforms.forEach((platform) => {
      handleRepurpose(platform.id);
    });
  };

  const handleGenerateHashtags = async () => {
    if (!hashtagTopic.trim()) return;
    setIsGeneratingHashtags(true);
    setGeneratedHashtags([]);
    try {
      const hashtags = await orbitProvider.getHashtagsFromAI(hashtagTopic);
      setGeneratedHashtags(hashtags);
    } catch (error) {
      console.error("Failed to generate hashtags:", error);
    } finally {
      setIsGeneratingHashtags(false);
    }
  };

  const handleGenerateIdeas = async () => {
    if (!ideaTopic.trim()) return;
    setIsGeneratingIdeas(true);
    setContentIdeas([]);
    try {
      const prompt = `Generate 5 content ideas for the topic: "${ideaTopic}". Return the response as a valid JSON array of strings. For example: ["idea 1", "idea 2", "idea 3"]`;
      const response = await orbitProvider.getAiTextResponse(prompt);
      const cleanedResponse = response.replace(/```json\n|\n```/g, "").trim();
      const ideas = JSON.parse(cleanedResponse);
      setContentIdeas(ideas);
    } catch (error) {
      console.error("Failed to generate content ideas:", error);
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  const handleGeneratePosts = async (idea: string, append = false) => {
    if (selectedPlatformsForPosts.length === 0 || !userGlobalData?.user) return;

    setIsGeneratingPosts((prev) => ({ ...prev, [idea]: true }));
    setError(null);
    if (!append) {
      setPostSuggestions((prev) => ({ ...prev, [idea]: [] }));
    }

    const cost = AI_PRICING.GENERATE_POSTS;
    try {
      await orbitProvider.deductPi(userGlobalData.user.uid, cost);
    } catch (error: any) {
      setError(error.message);
      setIsGeneratingPosts((prev) => ({ ...prev, [idea]: false }));
      return;
    }

    try {
      const prompt = `For the content idea "${idea}", generate one post for each of the following platforms: ${selectedPlatformsForPosts.join(
        ", "
      )}. Return the response as a valid JSON object where keys are platform names and values are the post strings. For example: {"twitter": "post text", "linkedin": "post text"}`;
      const response = await orbitProvider.getAiTextResponse(prompt);
      const cleanedResponse = response.replace(/```json\n|\n```/g, "").trim();
      const posts = JSON.parse(cleanedResponse);

      const newSuggestions = Object.entries(posts).map(
        ([platform, content]) => ({ platform, content })
      );

      if (append) {
        setPostSuggestions((prev) => ({
          ...prev,
          [idea]: [...(prev[idea] || []), ...newSuggestions],
        }));
      } else {
        setPostSuggestions((prev) => ({ ...prev, [idea]: newSuggestions }));
      }
    } catch (error) {
      await orbitProvider.addPi(userGlobalData.user.uid, cost);
      console.error("Failed to generate post suggestions:", error);
    } finally {
      setIsGeneratingPosts((prev) => ({ ...prev, [idea]: false }));
    }
  };

  const tabs = [
    {
      id: "generator",
      name: "Caption Generator",
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: "repurpose",
      name: "Smart Repurpose",
      icon: <RefreshCw className="w-4 h-4" />,
    },
    {
      id: "hashtags",
      name: "Hashtag Intelligence",
      icon: <Hash className="w-4 h-4" />,
    },
    {
      id: "ideas",
      name: "Content Ideas",
      icon: <Lightbulb className="w-4 h-4" />,
    },
    {
      id: "image",
      name: "Image Generation",
      icon: <Image className="w-4 h-4" />,
    },
    {
      id: "video",
      name: "Video Generation",
      icon: <Video className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className=" mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-sm">
                <Wand2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  AI Content Studio
                </h1>
                <p className="text-sm text-slate-600 hidden sm:block">
                  Create, optimize, and schedule content with AI assistance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className=" mx-auto px-3 sm:px-4 lg:px-2 py-2 sm:py-2">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
          {/* Left Sidebar - Tools */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-3">AI Tools</h3>
              <div className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {tab.icon}
                    <span className="text-sm font-medium">{tab.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              {activeTab === "generator" && (
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                    <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                      AI Caption Generator
                    </h2>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 text-xs sm:text-sm border border-slate-300 rounded-md hover:bg-slate-50 transition-colors flex items-center gap-1">
                        <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Import</span>
                      </button>
                      <button className="px-3 py-1.5 text-xs sm:text-sm border border-slate-300 rounded-md hover:bg-slate-50 transition-colors flex items-center gap-1">
                        <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Export</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    {/* Input Panel */}
                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Content Brief
                        </label>
                        <textarea
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          placeholder="Describe your content idea, key message, or paste existing text to optimize..."
                          className="w-full h-28 sm:h-32 p-3 sm:p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Platform
                          </label>
                          <select
                            value={selectedPlatform}
                            onChange={(e) =>
                              setSelectedPlatform(
                                e.target.value as PlatformType
                              )
                            }
                            className="w-full p-2.5 sm:p-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                          >
                            {platforms.map((platform) => (
                              <option key={platform.id} value={platform.id}>
                                {platform.icon} {platform.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Tone
                          </label>
                          <select
                            value={selectedTone}
                            onChange={(e) => setSelectedTone(e.target.value)}
                            className="w-full p-2.5 sm:p-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                          >
                            {tones.map((tone) => (
                              <option key={tone.id} value={tone.id}>
                                {tone.emoji} {tone.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex gap-2 sm:gap-3">
                        <button
                          onClick={() => handleGenerate()}
                          disabled={isGenerating}
                          className="flex-1 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
                        >
                          {isGenerating ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Generating...
                            </>
                          ) : (
                            <>
                              <Wand2 className="w-4 h-4" />
                              Generate Captions
                              <div className="flex items-center space-x-1 bg-white/20 px-2 py-0.5 rounded-full">
                                <PiIcon size="w-3 h-3" className="text-white" />
                                <span className="text-xs font-bold">
                                  {AI_PRICING.CAPTION_GENERATION}
                                </span>
                              </div>
                            </>
                          )}
                        </button>
                        <button className="px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors duration-200">
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Output Panel */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base sm:text-lg font-medium text-slate-900">
                          Generated Options
                        </h3>
                        {generatedCaptions.length > 0 && (
                          <button
                            onClick={() => handleGenerate({ append: true })}
                            className="text-sm text-indigo-600 hover:text-indigo-700"
                          >
                            Generate More
                          </button>
                        )}
                      </div>

                      {generatedCaptions.length > 0 ? (
                        <div className="space-y-3 sm:space-y-4">
                          {generatedCaptions.map((caption: any, index) => (
                            <div
                              key={index}
                              className="p-3 sm:p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors duration-200"
                            >
                              <div className="flex justify-between items-start mb-2 sm:mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                    Option {index + 1}
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    {caption?.length} chars
                                  </span>
                                </div>
                                <div className="flex gap-1">
                                  <button
                                    onClick={() =>
                                      navigator.clipboard.writeText(caption)
                                    }
                                    className="p-1 hover:bg-slate-100 rounded transition-colors duration-200"
                                  >
                                    <Copy className="w-4 h-4 text-slate-500" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line mb-2 sm:mb-3">
                                {caption}
                              </p>
                              <div className="flex items-center justify-end text-xs text-slate-500">
                                <button
                                  onClick={() =>
                                    navigate("/create", {
                                      state: { text: caption },
                                    })
                                  }
                                  className="px-2 py-1 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
                                >
                                  Use This
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 sm:py-12 text-slate-500 border-2 border-dashed border-slate-200 rounded-lg">
                          <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                          <p className="font-medium text-sm sm:text-base">
                            Ready to create amazing content?
                          </p>
                          <p className="text-xs sm:text-sm">
                            Enter your content brief and let AI do the magic
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "repurpose" && (
                <div className="p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4 sm:mb-6">
                    Smart Repurposing
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Original Content
                      </label>
                      <textarea
                        value={repurposeInput}
                        onChange={(e) => setRepurposeInput(e.target.value)}
                        placeholder="Paste your existing content here to repurpose for different platforms..."
                        className="w-full h-32 sm:h-40 p-3 sm:p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
                      />
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={handleRepurposeAll}
                          className="px-3 sm:px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-sm flex items-center gap-2"
                        >
                          Repurpose for All Platforms
                          <div className="flex items-center space-x-1 bg-white/20 px-2 py-0.5 rounded-full">
                            <PiIcon size="w-3 h-3" className="text-white" />
                            <span className="text-xs font-bold">
                              {(
                                AI_PRICING.REPURPOSE_CONTENT * platforms.length
                              ).toFixed(1)}
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-medium text-slate-900 mb-4">
                        Platform Versions
                      </h3>
                      <div className="space-y-3 sm:space-y-4">
                        {platforms.map((platform) => (
                          <div
                            key={platform.id}
                            className="p-3 sm:p-4 border border-slate-200 rounded-lg"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm">
                                {platform.icon} {platform.name}
                              </span>
                              <button
                                onClick={() => handleRepurpose(platform.id)}
                                disabled={isRepurposing[platform.id]}
                                className="text-sm text-indigo-600 hover:text-indigo-700 disabled:opacity-50 flex items-center gap-1"
                              >
                                {isRepurposing[platform.id]
                                  ? "Generating..."
                                  : "Generate"}
                                <PiIcon size="w-3 h-3" />
                                <span>{AI_PRICING.REPURPOSE_CONTENT}</span>
                              </button>
                            </div>
                            <div className="text-sm text-slate-500 bg-slate-50 p-2 sm:p-3 rounded whitespace-pre-wrap">
                              {repurposedContent[platform.id] ||
                                "Optimized version will appear here..."}
                            </div>
                            {repurposedContent[platform.id] && (
                              <div className="flex items-center justify-end gap-2 mt-2">
                                <button
                                  onClick={() =>
                                    navigator.clipboard.writeText(
                                      repurposedContent[platform.id]
                                    )
                                  }
                                  className="p-1 hover:bg-slate-100 rounded transition-colors duration-200"
                                >
                                  <Copy className="w-4 h-4 text-slate-500" />
                                </button>
                                <button
                                  onClick={() =>
                                    navigate("/create", {
                                      state: {
                                        text: repurposedContent[platform.id],
                                      },
                                    })
                                  }
                                  className="px-2 py-1 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
                                >
                                  Use This
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "hashtags" && (
                <div className="p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4 sm:mb-6">
                    Hashtag Intelligence
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    <div>
                      <h3 className="text-base sm:text-lg font-medium text-slate-900 mb-4">
                        Generate Hashtags
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Your Topic
                          </label>
                          <textarea
                            value={hashtagTopic}
                            onChange={(e) => setHashtagTopic(e.target.value)}
                            placeholder="e.g., 'digital marketing trends for 2024'"
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
                          />
                        </div>
                        <button
                          onClick={handleGenerateHashtags}
                          disabled={isGeneratingHashtags}
                          className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isGeneratingHashtags
                            ? "Generating..."
                            : "Generate Hashtags (Free)"}
                        </button>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base sm:text-lg font-medium text-slate-900">
                          Generated Hashtags
                        </h3>
                        {generatedHashtags.length > 0 && (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                navigator.clipboard.writeText(
                                  generatedHashtags.map((h) => `#${h}`).join(" ")
                                )
                              }
                              className="text-sm text-indigo-600 hover:text-indigo-700"
                            >
                              Copy All
                            </button>
                            <button
                              onClick={() =>
                                navigate("/create", {
                                  state: {
                                    text: generatedHashtags
                                      .map((h) => `#${h}`)
                                      .join(" "),
                                  },
                                })
                              }
                              className="text-sm text-indigo-600 hover:text-indigo-700"
                            >
                              Use All
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2 sm:space-y-3">
                        {isGeneratingHashtags ? (
                          <p className="text-slate-500">Generating...</p>
                        ) : generatedHashtags.length > 0 ? (
                          generatedHashtags.map((hashtag, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2.5 sm:p-3 border border-slate-200 rounded-lg"
                            >
                              <span className="font-medium text-indigo-600 text-sm">
                                #{hashtag}
                              </span>
                              <button
                                onClick={() =>
                                  navigator.clipboard.writeText(`#${hashtag}`)
                                }
                                className="p-1 hover:bg-slate-100 rounded transition-colors duration-200"
                              >
                                <Copy className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500" />
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="text-slate-500">
                            Enter a topic to generate hashtags.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "ideas" && (
                <div className="p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4 sm:mb-6">
                    Content Ideas
                  </h2>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Enter a topic to get content ideas
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={ideaTopic}
                        onChange={(e) => setIdeaTopic(e.target.value)}
                        placeholder="e.g., 'sustainable fashion'"
                        className="flex-grow p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      />
                      <button
                        onClick={handleGenerateIdeas}
                        disabled={isGeneratingIdeas}
                        className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isGeneratingIdeas
                          ? "Generating..."
                          : "Generate Ideas (Free)"}
                      </button>
                    </div>
                  </div>

                  {isGeneratingIdeas && <p>Generating ideas...</p>}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {contentIdeas.map((idea, index) => (
                      <div
                        key={index}
                        className="p-3 sm:p-4 border border-slate-200 rounded-lg"
                      >
                        <div
                          className="flex items-center justify-between cursor-pointer group"
                          onClick={() =>
                            setExpandedIdea(expandedIdea === idea ? null : idea)
                          }
                        >
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-50 rounded-full flex items-center justify-center">
                              <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" />
                            </div>
                            <span className="font-medium text-slate-900 text-sm">
                              {idea}
                            </span>
                          </div>
                        </div>
                        {expandedIdea === idea && (
                          <div className="mt-4">
                            {/* Platform selection and Suggest Posts button */}
                            <h4 className="font-semibold text-slate-800 mb-2">
                              Select Platforms
                            </h4>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {platforms.map((p) => (
                                <button
                                  key={p.id}
                                  onClick={() => {
                                    setSelectedPlatformsForPosts((prev) =>
                                      prev.includes(p.id)
                                        ? prev.filter((id) => id !== p.id)
                                        : [...prev, p.id]
                                    );
                                  }}
                                  className={`px-3 py-1 text-sm rounded-full border ${
                                    selectedPlatformsForPosts.includes(p.id)
                                      ? "bg-indigo-600 text-white border-indigo-600"
                                      : "bg-white text-slate-700 border-slate-300"
                                  }`}
                                >
                                  {p.name}
                                </button>
                              ))}
                            </div>
                            <button
                              onClick={() => handleGeneratePosts(idea)}
                              disabled={
                                isGeneratingPosts[idea] ||
                                selectedPlatformsForPosts.length === 0
                              }
                              className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              {isGeneratingPosts[idea]
                                ? "Generating..."
                                : "Suggest Posts"}
                              <div className="flex items-center space-x-1 bg-white/20 px-2 py-0.5 rounded-full">
                                <PiIcon size="w-3 h-3" className="text-white" />
                                <span className="text-xs font-bold">
                                  {AI_PRICING.GENERATE_POSTS}
                                </span>
                              </div>
                            </button>

                            {/* Post suggestions */}
                            {postSuggestions[idea] &&
                              postSuggestions[idea].length > 0 && (
                                <div className="mt-4 space-y-3">
                                  {postSuggestions[idea].map(
                                    (post, postIndex) => (
                                      <div
                                        key={postIndex}
                                        className="p-3 border rounded-lg bg-slate-50"
                                      >
                                        <p className="text-sm text-slate-800 mb-2 whitespace-pre-line">
                                          {post.content}
                                        </p>
                                        <div className="flex justify-between items-center">
                                          <span className="text-xs font-medium text-slate-500">
                                            {post.platform}
                                          </span>
                                          <div className="flex gap-2">
                                            <button
                                              onClick={() =>
                                                navigator.clipboard.writeText(
                                                  post.content
                                                )
                                              }
                                              className="p-1 hover:bg-slate-200 rounded"
                                            >
                                              <Copy className="w-3 h-3 text-slate-600" />
                                            </button>
                                            <button
                                              onClick={() =>
                                                navigate("/create", {
                                                  state: { text: post.content },
                                                })
                                              }
                                              className="px-2 py-0.5 bg-indigo-500 text-white rounded text-xs hover:bg-indigo-600"
                                            >
                                              Post
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}
                                  <button
                                    onClick={() =>
                                      handleGeneratePosts(idea, true)
                                    }
                                    disabled={isGeneratingPosts[idea]}
                                    className="w-full text-sm text-indigo-600 hover:text-indigo-700 py-1"
                                  >
                                    {isGeneratingPosts[idea]
                                      ? "Generating..."
                                      : "More"}
                                  </button>
                                </div>
                              )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "image" && <ImageGenerationTool />}
              {activeTab === "video" && <VideoGenerationTool />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistPage;
