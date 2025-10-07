import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUserGlobalData } from "../store/orbitSlice";
import { AccountData, Automation } from "../types";
import orbitProvider from "../backend/OrbitProvider";
import ImageSelectionPanel from "../components/ImageSelectionPanel";
import PiIcon from "../components/PiIcon";
import {
  Users,
  Info,
  Zap,
  Calendar,
  Globe,
  Copy,
  Cpu,
  Clock,
  Image,
  Type,
  FileText,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import eventBus from "../utils/eventBus";

const CreateAutomationPage: React.FC = () => {
  const navigate = useNavigate();
  const userGlobalData = useSelector(selectUserGlobalData);
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [contentType, setContentType] = useState<
    "text" | "image" | "text-image"
  >("text");
  const [brandRefImages, setBrandRefImages] = useState<string[]>([]);
  const [isImagePanelOpen, setIsImagePanelOpen] = useState(false);
  const [frequency, setFrequency] = useState<
    "hourly" | "5-hours" | "10-hours" | "15-hours" | "daily" | "weekly"
  >("daily");
  const [internetBrowsing, setInternetBrowsing] = useState(false);
  const [duplicateControl, setDuplicateControl] = useState<0 | 10 | 20 | 100>(
    20
  );
  const [model, setModel] = useState<"basic" | "premium">("basic");
  const [endDate, setEndDate] = useState<"infinite" | number>("infinite");
  const [accounts, setAccounts] = useState<
    (AccountData & { platform: string })[]
  >([]);
  const [selectedAccounts, setSelectedAccounts] = useState<
    { accountId: string; platformId: string }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [costs, setCosts] = useState({
    contentType: 0,
    accounts: 0,
    frequency: 0,
    aiBoost: 0,
    duplicateControl: 0,
    model: 0,
  });

  useEffect(() => {
    if (userGlobalData?.workspace?.id) {
      orbitProvider
        .getAccountsForWorkspace(userGlobalData.workspace.id)
        .then(setAccounts);
    }
  }, [userGlobalData?.workspace?.id]);

  const handleAccountSelection = (accountId: string, platformId: string) => {
    setSelectedAccounts((prev) => {
      const isSelected = prev.some(
        (acc) => acc.accountId === accountId && acc.platformId === platformId
      );
      if (isSelected) {
        return prev.filter(
          (acc) =>
            !(acc.accountId === accountId && acc.platformId === platformId)
        );
      } else {
        return [...prev, { accountId, platformId }];
      }
    });
  };

  const groupedAccounts = accounts.reduce(
    (acc, account) => {
      const platform = account.platform || "Unknown";
      if (!acc[platform]) {
        acc[platform] = [];
      }
      acc[platform].push(account);
      return acc;
    },
    {} as { [key: string]: (AccountData & { platform: string })[] }
  );

  const validateStep = (currentStep: number) => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    switch (currentStep) {
      case 1:
        if (!name.trim()) {
          newErrors.name = "Automation Name is required.";
          isValid = false;
        }
        if (!description.trim()) {
          newErrors.description = "Description is required.";
          isValid = false;
        }
        break;
      case 2:
        if (!goal.trim()) {
          newErrors.goal = "Automation Goal is required.";
          isValid = false;
        }
        break;
      case 4:
        if (selectedAccounts.length === 0) {
          newErrors.accounts = "Please select at least one account.";
          isValid = false;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    setErrors({});
    setStep(step - 1);
  };

  const calculateCost = useCallback(() => {
    const newCosts = {
      contentType: 0,
      accounts: 0,
      frequency: 0,
      aiBoost: 0,
      duplicateControl: 0,
      model: 0,
    };

    // Content Type
    if (contentType === "text") newCosts.contentType = 1;
    else if (contentType === "image") newCosts.contentType = 2;
    else if (contentType === "text-image") newCosts.contentType = 3;

    // Accounts
    newCosts.accounts = selectedAccounts.length * 5;

    // Frequency
    const frequencyCosts = {
      hourly: 10,
      "5-hours": 5,
      "10-hours": 3,
      "15-hours": 2,
      daily: 1,
      weekly: 0.5,
    };
    newCosts.frequency = frequencyCosts[frequency];

    // AI Boost
    if (internetBrowsing) newCosts.aiBoost = 5;

    // Duplicate Control
    const duplicateControlCosts = { 0: 0, 10: 1, 20: 2, 100: 5 };
    newCosts.duplicateControl = duplicateControlCosts[duplicateControl];

    // Model
    if (model === "premium") newCosts.model = 10;

    setCosts(newCosts);
  }, [
    contentType,
    selectedAccounts,
    frequency,
    internetBrowsing,
    duplicateControl,
    model,
  ]);

  useEffect(() => {
    calculateCost();
  }, [calculateCost]);

  const getTotalCost = () => {
    return Object.values(costs).reduce((acc, cost) => acc + cost, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userGlobalData?.userData || !userGlobalData.workspace) {
      alert(
        "You must be logged in and have an active workspace to create an automation."
      );
      return;
    }

    const totalCost = getTotalCost();
    if (
      (userGlobalData?.userData?.piBalance ?? 0) < totalCost &&
      endDate !== "infinite"
    ) {
      eventBus.emit("showInsufficientFundsModal");
      return;
    }

    setIsSubmitting(true);
    try {
      await orbitProvider.createAutomation({
        userId: userGlobalData.userData.uid,
        workspaceId: userGlobalData.workspace.id,
        name,
        description,
        goal,
        contentType,
        brandRefImages,
        selectedAccounts,
        frequency,
        aiBoost: {
          internetBrowsing,
        },
        duplicateControl,
        model,
        endDate,
      });
      alert("Automation created successfully!");
      navigate("/automation");
    } catch (error) {
      console.error("Error creating automation:", error);
      alert(
        "Failed to create automation. Please check your Pi balance and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const Tooltip = ({
    id,
    children,
  }: {
    id: string;
    children: React.ReactNode;
  }) => (
    <div className="relative inline-block ml-2">
      <button
        type="button"
        onMouseEnter={() => setShowTooltip(id)}
        onMouseLeave={() => setShowTooltip(null)}
        onClick={() => setShowTooltip(showTooltip === id ? null : id)}
        className="text-blue-500 hover:text-blue-600 focus:outline-none"
      >
        <Info className="w-4 h-4" />
      </button>
      {showTooltip === id && (
        <div className="absolute z-50 w-64 p-3 text-sm text-white bg-gray-900 rounded-lg shadow-lg -left-32 top-6 sm:left-0">
          {children}
          <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -top-1 left-36 sm:left-4"></div>
        </div>
      )}
    </div>
  );

  const totalSteps = 10;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <Zap className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-500 mr-2" />
              Create Automation
            </h1>
            <span className="text-xs sm:text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
              Step {step}/{totalSteps}
            </span>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            Your 24/7 AI-powered social media manager
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Desktop Layout with Side Summary */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          {/* Main Form Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <form>
              <div className="p-4 sm:p-6 md:p-8">
                {/* Step 1: Basic Info */}
                {step === 1 && (
                  <div className="space-y-5">
                    <div className="flex items-center mb-4">
                      <FileText className="w-6 h-6 text-blue-600 mr-2" />
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Basic Information
                      </h2>
                    </div>

                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Automation Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="e.g., Daily Pi Network Updates"
                        required
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                        placeholder="Briefly describe what this automation does..."
                        required
                      />
                      {errors.description && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.description}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Goal */}
                {step === 2 && (
                  <div className="space-y-5">
                    <div className="flex items-center mb-4">
                      <TrendingUp className="w-6 h-6 text-purple-600 mr-2" />
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Automation Goal
                      </h2>
                      <Tooltip id="goal">
                        Define the purpose of your automation. The AI uses this
                        to create relevant, on-brand content that aligns with
                        your objectives.
                      </Tooltip>
                    </div>

                    <div>
                      <label
                        htmlFor="goal"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        What should this automation achieve?
                      </label>
                      <textarea
                        id="goal"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none"
                        placeholder="e.g., I want to create posts about the Pi network to motivate users in the ecosystem. The posts should be critically accurate and include real data."
                        required
                      />
                      {errors.goal && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.goal}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Be specific about tone, topics, and target audience for
                        best results.
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 3: Content Type */}
                {step === 3 && (
                  <div className="space-y-5">
                    <div className="flex items-center mb-4">
                      <Image className="w-6 h-6 text-green-600 mr-2" />
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Content Type
                      </h2>
                      <Tooltip id="content-type">
                        Choose what type of content the AI should create.
                        Text-only is fastest, while images or combined content
                        creates more engaging posts.
                      </Tooltip>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                        <input
                          type="radio"
                          name="contentType"
                          value="text"
                          checked={contentType === "text"}
                          onChange={() => setContentType("text")}
                          className="mt-1 focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Type className="w-5 h-5 text-blue-600 mr-2" />
                              <span className="font-semibold text-gray-900">
                                Text Only
                              </span>
                            </div>
                            <div className="flex items-center text-sm font-semibold text-blue-600">
                              <PiIcon className="w-4 h-4 mr-1" />
                              <span>+1 Pi</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Quick, concise written content
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                        <input
                          type="radio"
                          name="contentType"
                          value="image"
                          checked={contentType === "image"}
                          onChange={() => setContentType("image")}
                          className="mt-1 focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Image className="w-5 h-5 text-purple-600 mr-2" />
                              <span className="font-semibold text-gray-900">
                                Images Only
                              </span>
                            </div>
                            <div className="flex items-center text-sm font-semibold text-purple-600">
                              <PiIcon className="w-4 h-4 mr-1" />
                              <span>+2 Pi</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Visual content that speaks volumes
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                        <input
                          type="radio"
                          name="contentType"
                          value="text-image"
                          checked={contentType === "text-image"}
                          onChange={() => setContentType("text-image")}
                          className="mt-1 focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <FileText className="w-5 h-5 text-green-600 mr-2" />
                              <span className="font-semibold text-gray-900">
                                Text + Images
                              </span>
                              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                Recommended
                              </span>
                            </div>
                            <div className="flex items-center text-sm font-semibold text-green-600">
                              <PiIcon className="w-4 h-4 mr-1" />
                              <span>+3 Pi</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Maximum engagement with combined content
                          </p>
                        </div>
                      </label>
                    </div>

                    {contentType !== "text" && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-sm font-semibold text-gray-700">
                            Brand Reference Images
                            <Tooltip id="brand-images">
                              Upload images that represent your brand style. The
                              AI will create visuals matching your aesthetic.
                            </Tooltip>
                          </label>
                          <button
                            type="button"
                            onClick={() => setIsImagePanelOpen(true)}
                            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                          >
                            Select Images
                          </button>
                        </div>
                        {brandRefImages.length > 0 && (
                          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-3">
                            {brandRefImages.map((url) => (
                              <img
                                key={url}
                                src={url}
                                alt="Brand Reference"
                                className="w-full h-16 rounded-md object-cover border-2 border-gray-200"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Step 4: Select Accounts */}
                {step === 4 && (
                  <div className="space-y-5">
                    <div className="flex items-center mb-4">
                      <Users className="w-6 h-6 text-teal-600 mr-2" />
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Select Accounts
                      </h2>
                      <Tooltip id="accounts">
                        Choose which social media accounts this automation will
                        post to.
                      </Tooltip>
                    </div>
                    {errors.accounts && (
                      <p className="text-red-500 text-sm">{errors.accounts}</p>
                    )}
                    <div className="flex items-center justify-between p-3 bg-teal-50 border-2 border-teal-100 rounded-lg">
                      <p className="font-semibold text-teal-800">
                        Accounts Cost
                      </p>
                      <div className="flex items-center font-bold text-teal-600">
                        <PiIcon className="w-5 h-5 mr-1" />
                        <span>{costs.accounts.toFixed(1)} Pi</span>
                      </div>
                    </div>
                    <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                      {Object.keys(groupedAccounts).length > 0 ? (
                        Object.keys(groupedAccounts).map((platform) => (
                          <div key={platform}>
                            <h3 className="text-lg font-semibold text-gray-800 capitalize mb-2 sticky top-0 bg-white py-2">
                              {platform}
                            </h3>
                            <div className="space-y-2">
                              {groupedAccounts[platform].map((account) => (
                                <label
                                  key={account.id}
                                  className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedAccounts.some(
                                      (acc) => acc.accountId === account.id
                                    )}
                                    onChange={() =>
                                      handleAccountSelection(
                                        account.id,
                                        account.platform
                                      )
                                    }
                                    className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300 rounded"
                                  />
                                  <img
                                    src={
                                      (account as any).profilePicture ||
                                      "https://via.placeholder.com/150"
                                    }
                                    alt={account.username}
                                    className="w-8 h-8 rounded-full"
                                  />
                                  <div className="ml-3">
                                    <span className="font-semibold text-gray-900">
                                      {account.username}
                                    </span>
                                    {platform === "Reddit" && (
                                      <p className="text-xs text-red-500">
                                        Reddit is not supported for automation.
                                      </p>
                                    )}
                                  </div>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">
                          No social accounts found in this workspace. Please
                          connect accounts in the Settings page.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 5: Frequency */}
                {step === 5 && (
                  <div className="space-y-5">
                    <div className="flex items-center mb-4">
                      <Calendar className="w-6 h-6 text-orange-600 mr-2" />
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Posting Frequency
                      </h2>
                      <Tooltip id="frequency">
                        Choose how often the AI should create and publish new
                        content. More frequent posting increases visibility but
                        costs more Pi.
                      </Tooltip>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        {
                          value: "hourly",
                          label: "Every Hour",
                          icon: Clock,
                          cost: 10,
                        },
                        {
                          value: "5-hours",
                          label: "Every 5 Hours",
                          icon: Clock,
                          cost: 5,
                        },
                        {
                          value: "10-hours",
                          label: "Every 10 Hours",
                          icon: Clock,
                          cost: 3,
                        },
                        {
                          value: "15-hours",
                          label: "Every 15 Hours",
                          icon: Clock,
                          cost: 2,
                        },
                        {
                          value: "daily",
                          label: "Daily",
                          icon: Calendar,
                          cost: 1,
                        },
                        {
                          value: "weekly",
                          label: "Weekly",
                          icon: Calendar,
                          cost: 0.5,
                        },
                      ].map((freq) => (
                        <label
                          key={freq.value}
                          className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition ${
                            frequency === freq.value
                              ? "border-orange-500 bg-orange-50"
                              : "border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="frequency"
                            value={freq.value}
                            checked={frequency === freq.value}
                            onChange={(e) =>
                              setFrequency(e.target.value as any)
                            }
                            className="sr-only"
                          />
                          <freq.icon className="w-8 h-8 text-orange-600 mb-2" />
                          <span className="font-semibold text-gray-900 text-center text-sm">
                            {freq.label}
                          </span>
                          <div className="flex items-center text-xs font-semibold text-orange-600 mt-1">
                            <PiIcon className="w-3 h-3 mr-1" />
                            <span>+{freq.cost} Pi</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 6: AI Boost */}
                {step === 6 && (
                  <div className="space-y-5">
                    <div className="flex items-center mb-4">
                      <Globe className="w-6 h-6 text-blue-600 mr-2" />
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                        AI Boost
                      </h2>
                      <Tooltip id="ai-boost">
                        Enable internet browsing to let the AI fetch real-time
                        data, news, and trends for more accurate and timely
                        content.
                      </Tooltip>
                    </div>

                    <label className="flex items-start p-5 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                      <input
                        type="checkbox"
                        id="internetBrowsing"
                        checked={internetBrowsing}
                        onChange={(e) => setInternetBrowsing(e.target.checked)}
                        className="mt-1 focus:ring-blue-500 h-5 w-5 text-blue-600 border-gray-300 rounded"
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex items-center">
                          <Globe className="w-5 h-5 text-blue-600 mr-2" />
                          <span className="font-semibold text-gray-900 text-lg">
                            Internet Browsing
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Allow the AI to browse the web for fresh data, current
                          news, and real-time information to create more
                          accurate and relevant content.
                        </p>
                        <div className="mt-3 flex items-center text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg w-fit">
                          <Zap className="w-4 h-4 mr-1" />
                          Recommended for news and data-driven content
                        </div>
                      </div>
                      <div className="flex items-center text-lg font-bold text-blue-600 mt-3">
                        <PiIcon className="w-5 h-5 mr-1" />
                        <span>+5 Pi</span>
                      </div>
                    </label>
                  </div>
                )}

                {/* Step 7: Duplicate Control */}
                {step === 7 && (
                  <div className="space-y-5">
                    <div className="flex items-center mb-4">
                      <Copy className="w-6 h-6 text-indigo-600 mr-2" />
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Duplicate Control
                      </h2>
                      <Tooltip id="duplicate">
                        The AI remembers your recent posts to avoid repeating
                        content. Higher values mean better variety but use more
                        memory.
                      </Tooltip>
                    </div>

                    <div className="space-y-3">
                      {[
                        {
                          value: 0,
                          label: "No Memory",
                          desc: "Fresh start every time, may repeat content",
                          cost: 0,
                        },
                        {
                          value: 10,
                          label: "10 Posts",
                          desc: "Basic duplicate prevention",
                          cost: 1,
                        },
                        {
                          value: 20,
                          label: "20 Posts",
                          desc: "Recommended for most users",
                          cost: 2,
                        },
                        {
                          value: 100,
                          label: "100 Posts",
                          desc: "Maximum variety and uniqueness",
                          cost: 5,
                        },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition ${
                            duplicateControl === option.value
                              ? "border-indigo-500 bg-indigo-50"
                              : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="duplicateControl"
                            value={option.value}
                            checked={duplicateControl === option.value}
                            onChange={(e) =>
                              setDuplicateControl(Number(e.target.value) as any)
                            }
                            className="mt-1 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                          />
                          <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-gray-900">
                                {option.label}
                              </span>
                              <div className="flex items-center text-sm font-semibold text-indigo-600">
                                <PiIcon className="w-4 h-4 mr-1" />
                                <span>+{option.cost} Pi</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {option.desc}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 8: Model Selection */}
                {step === 8 && (
                  <div className="space-y-5">
                    <div className="flex items-center mb-4">
                      <Cpu className="w-6 h-6 text-purple-600 mr-2" />
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                        AI Model
                      </h2>
                      <Tooltip id="model">
                        Premium models provide higher quality, more creative
                        content with better understanding of context and nuance.
                      </Tooltip>
                    </div>

                    <div className="space-y-3">
                      <label
                        className={`block p-5 border-2 rounded-lg cursor-pointer transition ${
                          model === "basic"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="model"
                          value="basic"
                          checked={model === "basic"}
                          onChange={() => setModel("basic")}
                          className="sr-only"
                        />
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <Cpu className="w-5 h-5 text-blue-600 mr-2" />
                              <span className="font-bold text-lg text-gray-900">
                                Basic Model
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                              Fast and efficient for straightforward content
                              creation
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                Cost-effective
                              </span>
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                Quick generation
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center text-lg font-bold text-blue-600">
                            <PiIcon className="w-5 h-5 mr-1" />
                            <span>+0 Pi</span>
                          </div>
                        </div>
                      </label>

                      <label
                        className={`block p-5 border-2 rounded-lg cursor-pointer transition ${
                          model === "premium"
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="model"
                          value="premium"
                          checked={model === "premium"}
                          onChange={() => setModel("premium")}
                          className="sr-only"
                        />
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <Zap className="w-5 h-5 text-purple-600 mr-2" />
                              <span className="font-bold text-lg text-gray-900">
                                Premium Model
                              </span>
                              <span className="ml-2 text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded-full">
                                PRO
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                              Advanced AI for creative, nuanced, and highly
                              engaging content
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                Superior quality
                              </span>
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                Creative output
                              </span>
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                Better context
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center text-lg font-bold text-purple-600">
                            <PiIcon className="w-5 h-5 mr-1" />
                            <span>+10 Pi</span>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Step 9: Duration */}
                {step === 9 && (
                  <div className="space-y-5">
                    <div className="flex items-center mb-4">
                      <Clock className="w-6 h-6 text-red-600 mr-2" />
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Automation Duration
                      </h2>
                      <Tooltip id="duration">
                        Choose how long the automation should run. You can run
                        it indefinitely with a daily fee or set a specific end
                        date.
                      </Tooltip>
                    </div>

                    <div className="space-y-3">
                      <label
                        className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition ${
                          endDate === "infinite"
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-green-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="endDate"
                          value="infinite"
                          checked={endDate === "infinite"}
                          onChange={() => setEndDate("infinite")}
                          className="mt-1 focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-900">
                              Run Indefinitely
                            </span>
                            <div className="flex items-center text-sm font-semibold text-green-600">
                              <PiIcon className="w-4 h-4 mr-1" />
                              <span>{getTotalCost()} Pi / day</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Pay a daily fee for continuous operation. Billed
                            every 24 hours.
                          </p>
                        </div>
                      </label>

                      <label
                        className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition ${
                          typeof endDate === "number"
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:border-orange-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="endDate"
                          value="date"
                          checked={typeof endDate === "number"}
                          onChange={() =>
                            setEndDate(
                              new Date().setDate(new Date().getDate() + 2)
                            )
                          }
                          className="mt-1 focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300"
                        />
                        <div className="ml-3 flex-1">
                          <span className="font-semibold text-gray-900">
                            Set End Date
                          </span>
                          <p className="text-sm text-gray-600 mt-1">
                            Pay a one-time setup fee. The automation will stop
                            on the selected date.
                          </p>
                          {typeof endDate === "number" && (
                            <input
                              type="date"
                              value={
                                new Date(endDate).toISOString().split("T")[0]
                              }
                              min={
                                new Date(
                                  new Date().setDate(new Date().getDate() + 2)
                                )
                                  .toISOString()
                                  .split("T")[0]
                              }
                              onChange={(e) =>
                                setEndDate(new Date(e.target.value).getTime())
                              }
                              className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                            />
                          )}
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Step 10: Review & Submit */}
                {step === 10 && (
                  <div className="space-y-6">
                    <div className="flex items-center mb-4">
                      <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Review & Activate
                      </h2>
                    </div>

                    {/* Cost Summary */}
                    <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">
                          {endDate === "infinite"
                            ? "Cost Per Day"
                            : "One-Time Setup Fee"}
                        </h3>
                        <Zap className="w-6 h-6" />
                      </div>
                      <div className="text-4xl sm:text-5xl font-bold mb-2">
                        {getTotalCost()} Pi
                      </div>
                      <p className="text-sm text-blue-100">
                        {endDate === "infinite"
                          ? "This amount will be deducted from your wallet daily."
                          : "This is a one-time fee to set up your automation."}
                      </p>
                    </div>

                    {/* Summary */}
                    <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200">
                      <h3 className="font-bold text-gray-900 mb-3 text-sm sm:text-base">
                        Configuration Summary
                      </h3>
                      <div className="space-y-2 text-xs sm:text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-semibold text-gray-900">
                            {endDate === "infinite"
                              ? "Indefinite"
                              : `Ends on ${new Date(
                                  endDate
                                ).toLocaleDateString()}`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Content Type:</span>
                          <span className="font-semibold text-gray-900">
                            {contentType === "text-image"
                              ? "Text + Images"
                              : contentType === "image"
                                ? "Images"
                                : "Text"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Frequency:</span>
                          <span className="font-semibold text-gray-900 capitalize">
                            {frequency.replace("-", " ")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">AI Model:</span>
                          <span className="font-semibold text-gray-900 capitalize">
                            {model}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Internet Browsing:
                          </span>
                          <span
                            className={`font-semibold ${internetBrowsing ? "text-green-600" : "text-gray-400"}`}
                          >
                            {internetBrowsing ? "Enabled" : "Disabled"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Duplicate Control:
                          </span>
                          <span className="font-semibold text-gray-900">
                            {duplicateControl} posts
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 border-t border-gray-200 pt-3">
                        <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                          Cost Breakdown
                        </h4>
                        <div className="space-y-1 text-xs">
                          {Object.entries(costs).map(([key, value]) =>
                            value > 0 ? (
                              <div
                                key={key}
                                className="flex justify-between items-center"
                              >
                                <span className="text-gray-600 capitalize">
                                  {key.replace(/([A-Z])/g, " $1")}
                                </span>
                                <div className="flex items-center font-semibold text-gray-800">
                                  <PiIcon className="w-3 h-3 mr-1" />
                                  <span>{value.toFixed(1)} Pi</span>
                                </div>
                              </div>
                            ) : null
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="bg-gray-50 px-4 py-4 sm:px-6 sm:py-5 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-4 sm:px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition shadow-sm"
                    >
                      Back
                    </button>
                  ) : (
                    <div></div>
                  )}

                  {step < totalSteps ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-4 sm:px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition shadow-lg"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="px-4 sm:px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:from-green-700 hover:to-emerald-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Creating...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Activate Automation
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Desktop Sidebar - Configuration Summary */}
          <div className="hidden lg:block lg:col-span-1 space-y-4">
            {/* Current Configuration Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 sticky top-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="font-bold text-gray-900">Configuration</h3>
              </div>

              <div className="space-y-4">
                {/* Basic Info */}
                {name && (
                  <div className="pb-3 border-b border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">
                      Automation Name
                    </p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {name}
                    </p>
                  </div>
                )}

                {/* Content Type */}
                <div className="pb-3 border-b border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Content Type</p>
                  <div className="flex items-center">
                    {contentType === "text" && (
                      <Type className="w-4 h-4 text-blue-600 mr-2" />
                    )}
                    {contentType === "image" && (
                      <Image className="w-4 h-4 text-purple-600 mr-2" />
                    )}
                    {contentType === "text-image" && (
                      <FileText className="w-4 h-4 text-green-600 mr-2" />
                    )}
                    <p className="font-semibold text-gray-900 text-sm">
                      {contentType === "text-image"
                        ? "Text + Images"
                        : contentType === "image"
                          ? "Images Only"
                          : "Text Only"}
                    </p>
                  </div>
                </div>

                {/* Frequency */}
                <div className="pb-3 border-b border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">
                    Posting Frequency
                  </p>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-orange-600 mr-2" />
                    <p className="font-semibold text-gray-900 text-sm capitalize">
                      {frequency.replace("-", " ")}
                    </p>
                  </div>
                </div>

                {/* AI Model */}
                <div className="pb-3 border-b border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">AI Model</p>
                  <div className="flex items-center">
                    <Cpu className="w-4 h-4 text-purple-600 mr-2" />
                    <p className="font-semibold text-gray-900 text-sm capitalize">
                      {model}
                    </p>
                    {model === "premium" && (
                      <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                        PRO
                      </span>
                    )}
                  </div>
                </div>

                {/* Internet Browsing */}
                <div className="pb-3 border-b border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">
                    Internet Browsing
                  </p>
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 text-blue-600 mr-2" />
                    <p
                      className={`font-semibold text-sm ${internetBrowsing ? "text-green-600" : "text-gray-400"}`}
                    >
                      {internetBrowsing ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                </div>

                {/* Duplicate Control */}
                <div className="pb-3 border-b border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">
                    Duplicate Control
                  </p>
                  <div className="flex items-center">
                    <Copy className="w-4 h-4 text-indigo-600 mr-2" />
                    <p className="font-semibold text-gray-900 text-sm">
                      {duplicateControl} posts
                    </p>
                  </div>
                </div>

                {/* Duration */}
                <div className="pb-3">
                  <p className="text-xs text-gray-500 mb-1">Duration</p>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-red-600 mr-2" />
                    <p className="font-semibold text-gray-900 text-sm">
                      {endDate === "infinite"
                        ? "Indefinite"
                        : "Custom End Date"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cost Display */}
              <div className="mt-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold">
                    {endDate === "infinite" ? "Cost Per Day" : "One-Time Fee"}
                  </p>
                  <Zap className="w-5 h-5" />
                </div>
                <p className="text-3xl font-bold">{getTotalCost()} Pi</p>
                <p className="text-xs text-blue-100 mt-1">
                  {endDate === "infinite"
                    ? "Billed every 24 hours"
                    : "One-time setup fee"}
                </p>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-l-4 border-yellow-400 p-4 rounded-lg">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-gray-900 mb-1">Pro Tip</p>
                  <p className="text-gray-700 text-xs">
                    Your automation runs 24/7. You can pause or modify it
                    anytime from the dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Info Banner */}
        <div className="lg:hidden mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-gray-900 mb-1">Pro Tip</p>
              <p className="text-gray-700">
                Your automation runs 24/7, building your online presence while
                you focus on what matters. You can pause or modify it anytime
                from the Automation Dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>

      <ImageSelectionPanel
        isOpen={isImagePanelOpen}
        onClose={() => setIsImagePanelOpen(false)}
        onSelectImages={(images) => {
          setBrandRefImages(images);
          setIsImagePanelOpen(false);
        }}
        selectedImages={brandRefImages}
      />
    </div>
  );
};

export default CreateAutomationPage;
