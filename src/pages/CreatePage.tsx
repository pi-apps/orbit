"use client";

import {
  AlertCircle,
  ArrowUp,
  AtSign,
  Book,
  Calendar,
  CheckCircle,
  Crown,
  Facebook,
  FileText,
  Globe,
  Image as ImageIcon,
  Instagram,
  Linkedin,
  MessageCircle,
  Plus,
  Save,
  Send,
  Sparkles,
  Trash2,
  Twitter,
  Youtube,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import orbitProvider from "../backend/OrbitProvider";
import ImageSelectionPanel from "../components/ImageSelectionPanel";
import PiIcon from "../components/PiIcon";
import PlaceholderModal from "../components/PlaceholderModal";
import RedditPostModal from "../components/RedditPostModal";
import ScheduleModal from "../components/ScheduleModal";
import TemplateSelectionModal from "../components/TemplateSelectionModal";
import {
  addDraft,
  addDrafts,
  addScheduledPost,
  addScheduledPosts,
  deleteDraft as deleteDraftAction,
  deleteScheduledPost as deleteScheduledPostAction,
  selectCreatePage,
  setError,
  setLastVisibleDraft,
  setLastVisibleScheduledPost,
  setLoading,
  updateDraft as updateDraftAction,
} from "../store/createPageSlice";
import { selectUserGlobalData } from "../store/orbitSlice";
import { AppDispatch } from "../store/store";
import { Draft, SupportedPlatforms, Template } from "../types";

const platformDetails: {
  [key in SupportedPlatforms]: {
    icon: React.ElementType;
    color: string;
  };
} = {
  Twitter: { icon: Twitter, color: "bg-slate-800" },
  Linkedin: { icon: Linkedin, color: "bg-blue-700" },
  Instagram: { icon: Instagram, color: "bg-pink-600" },
  Facebook: { icon: Facebook, color: "bg-blue-600" },
  Youtube: { icon: Youtube, color: "bg-red-600" },
  Threads: { icon: AtSign, color: "bg-black" },
  Reddit: { icon: Globe, color: "bg-orange-500" },
  Bluesky: { icon: MessageCircle, color: "bg-blue-500" },
};

const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();
  const userGlobalData = useSelector(selectUserGlobalData);
  const {
    drafts,
    scheduledPosts,
    loading,
    lastVisibleDraft,
    lastVisibleScheduledPost,
  } = useSelector(selectCreatePage);
  const observerDraft = useRef<IntersectionObserver | null>(null);
  const observerScheduled = useRef<IntersectionObserver | null>(null);

  const [activeTab, setActiveTab] = useState("create");
  const [selectedAccounts, setSelectedAccounts] = useState<
    { accountId: string; platformId: string }[]
  >([]);
  const [postContent, setPostContent] = useState("");
  const [platformContent, setPlatformContent] = useState<{
    [key: string]: string;
  }>({});
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string[];
  }>({});
  const [draftId, setDraftId] = useState<string | null>(null);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  const [showPlaceholderModal, setShowPlaceholderModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const [postSuccess, setPostSuccess] = useState<string | null>(null);
  const [showReauthToast, setShowReauthToast] = useState(false);
  const [newPostId, setNewPostId] = useState<string | null>(null);
  const [activePlatformTab, setActivePlatformTab] = useState<string>("default");
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showImageSelectionPanel, setShowImageSelectionPanel] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showRedditModal, setShowRedditModal] = useState(false);
  const [redditData, setRedditData] = useState<{
    title: string;
    subreddit: string;
  } | null>(null);
  useEffect(() => {
    if (location.state && location.state.text) {
      setPostContent(location.state.text);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);
  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScrollToTop && window.pageYOffset > 400) {
        setShowScrollToTop(true);
      } else if (showScrollToTop && window.pageYOffset <= 400) {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener("scroll", checkScrollTop);
    return () => window.removeEventListener("scroll", checkScrollTop);
  }, [showScrollToTop]);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const platforms = userGlobalData?.workspace
    ? (Object.keys(platformDetails) as SupportedPlatforms[])
        .map((platformName) => {
          const accountKey =
            `${platformName.toLowerCase()}Accounts` as keyof typeof userGlobalData.workspace;
          const accounts = userGlobalData.workspace![accountKey] as
            | any[]
            | undefined;
          return {
            id: platformName,
            name: platformName,
            icon: platformDetails[platformName].icon,
            color: platformDetails[platformName].color,
            accounts: accounts
              ? accounts.map((acc: any) => ({
                  id: acc.id,
                  name: acc.username,
                  handle: `@${acc.username}`,
                  followers: acc.followersCount
                    ? `${(acc.followersCount / 1000).toFixed(1)}k`
                    : "N/A",
                  profilePicture:
                    acc.profilePicture || "/generic-social-media-profile.png",
                }))
              : [],
          };
        })
        .filter((platform) => platform.accounts.length > 0)
    : [];

  const loadMoreDrafts = useCallback(async () => {
    if (!userGlobalData?.workspace || loading) return;
    dispatch(setLoading(true));

    try {
      const { drafts: newDrafts, lastVisible } = await orbitProvider.getDrafts(
        userGlobalData.workspace.id,
        lastVisibleDraft || undefined
      );
      if (newDrafts.length > 0) {
        dispatch(addDrafts(newDrafts));
        dispatch(setLastVisibleDraft(lastVisible));
      } else {
        dispatch(setLastVisibleDraft(null));
      }
    } catch (error) {
      dispatch(setError("Failed to fetch drafts."));
      setLastVisibleDraft(null);
    } finally {
      dispatch(setLoading(false));
    }
  }, [userGlobalData?.workspace, lastVisibleDraft, loading]);

  const loadMoreScheduledPosts = useCallback(async () => {
    if (!userGlobalData?.workspace || loading) return;
    dispatch(setLoading(true));
    try {
      const { posts: newPosts, lastVisible } =
        await orbitProvider.getScheduledPosts(
          userGlobalData.workspace.id,
          lastVisibleScheduledPost || undefined
        );
      if (newPosts.length > 0) {
        dispatch(addScheduledPosts(newPosts));
        dispatch(setLastVisibleScheduledPost(lastVisible));
      } else {
        dispatch(setLastVisibleScheduledPost(null));
      }
    } catch (error) {
      dispatch(setError("Failed to fetch scheduled posts."));
      setLastVisibleScheduledPost(null);
    } finally {
      dispatch(setLoading(false));
    }
  }, [userGlobalData?.workspace, lastVisibleScheduledPost, loading]);

  const lastDraftElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observerDraft.current) observerDraft.current.disconnect();
      observerDraft.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && lastVisibleDraft !== null) {
          loadMoreDrafts();
        }
      });
      if (node) observerDraft.current.observe(node);
    },
    [loading, lastVisibleDraft]
  );

  const lastScheduledPostElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observerScheduled.current) observerScheduled.current.disconnect();
      observerScheduled.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && lastVisibleScheduledPost !== null) {
          loadMoreScheduledPosts();
        }
      });
      if (node) observerScheduled.current.observe(node);
    },
    [loading, lastVisibleScheduledPost]
  );

  useEffect(() => {
    if (drafts.length === 0) {
      loadMoreDrafts();
    }
    if (scheduledPosts.length === 0) {
      loadMoreScheduledPosts();
    }
  }, [drafts.length, scheduledPosts.length]);

  const toggleAccount = (accountId: string, platformId: string) => {
    const isCurrentlySelected = selectedAccounts.some(
      (a) => a.accountId === accountId
    );

    if (platformId === "Reddit" && !isCurrentlySelected) {
      setShowRedditModal(true);
    }
    setSelectedAccounts((prev) =>
      prev.some((a) => a.accountId === accountId)
        ? prev.filter((a) => a.accountId !== accountId)
        : [...prev, { accountId, platformId }]
    );
  };

  const toggleAllAccountsForPlatform = (platformId: string) => {
    const platform = platforms.find((p) => p.id === platformId);
    if (!platform) return;

    const platformAccountIds = platform.accounts.map((acc) => acc.id);
    const allSelected = platformAccountIds.every((id) =>
      selectedAccounts.some((sa) => sa.accountId === id)
    );

    if (allSelected) {
      setSelectedAccounts((prev) =>
        prev.filter((acc) => !platformAccountIds.includes(acc.accountId))
      );
    } else {
      setSelectedAccounts((prev) => {
        const newSelected = prev.filter(
          (acc) => !platformAccountIds.includes(acc.accountId)
        );
        platformAccountIds.forEach((id) => {
          newSelected.push({ accountId: id, platformId });
        });
        return newSelected;
      });
    }
  };

  const toggleAllAccounts = () => {
    const allAccounts = platforms.flatMap((p) =>
      p.accounts.map((a) => ({ accountId: a.id, platformId: p.id }))
    );
    const allSelected = allAccounts.every((acc) =>
      selectedAccounts.find((sa) => sa.accountId === acc.accountId)
    );

    if (allSelected) {
      setSelectedAccounts([]);
    } else {
      setSelectedAccounts(allAccounts);
    }
  };

  const getSelectedPlatforms = () => {
    const platformIds = new Set<string>();
    selectedAccounts.forEach((account) => {
      platformIds.add(account.platformId);
    });

    if (selectedTemplate && selectedTemplate.platformOverrides) {
      Object.keys(selectedTemplate.platformOverrides).forEach((platform) => {
        const capitalizedPlatform =
          platform.charAt(0).toUpperCase() + platform.slice(1);
        if (Object.keys(platformDetails).includes(capitalizedPlatform)) {
          platformIds.add(capitalizedPlatform);
        }
      });
    }

    return Array.from(platformIds);
  };

  const handlePostNow = async () => {
    if (
      !userGlobalData ||
      !userGlobalData.workspace ||
      isPosting ||
      Object.keys(validationErrors).length > 0
    ) {
      return;
    }

    setIsPosting(true);
    setPostError(null);
    setPostSuccess(null);

    const cost = selectedAccounts.length * 0.1;

    try {
      await orbitProvider.deductPi(userGlobalData.user.uid, cost);
    } catch (error: any) {
      setPostError(error.message);
      setIsPosting(false);
      return;
    }

    const contentPayload: { [key: string]: string } = { default: postContent };
    getSelectedPlatforms().forEach((platformId) => {
      const platformSpecificContent = platformContent[platformId.toLowerCase()];
      if (platformSpecificContent) {
        contentPayload[platformId.toLowerCase()] = platformSpecificContent;
      }
    });

    const postData = {
      workspaceId: userGlobalData.workspace.id,
      userId: userGlobalData.user.uid,
      accounts: selectedAccounts,
      content: contentPayload,
      images: selectedImages,
      reddit: redditData,
    };

    try {
      const response = await orbitProvider.postContent(postData);
      if (response.success) {
        setPostSuccess("Your posts have been sent successfully!");
        if (response.postIds && response.postIds.length > 0) {
          setNewPostId(response.postIds[0]);
        }
        setPostContent("");
        setPlatformContent({});
        setSelectedAccounts([]);
        setDraftId(null);
        setSelectedImages([]);
        setRedditData(null);
      } else {
        await orbitProvider.addPi(userGlobalData.user.uid, cost);
        if (
          response.errors &&
          response.errors.some((e: any) => e.needsReauthentication)
        ) {
          setShowReauthToast(true);
        }
        const errorMessages = response.errors
          ?.map((e: any) => `${e.platform}: ${e.error}`)
          .join("\n");
        setPostError(
          errorMessages || "An unknown error occurred while posting."
        );
      }
    } catch (error) {
      await orbitProvider.addPi(userGlobalData.user.uid, cost);
      console.error("Error posting:", error);
      setPostError("Failed to send posts. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!userGlobalData || !userGlobalData.workspace || !postContent.trim())
      return;

    const draftData = {
      workspaceId: userGlobalData.workspace.id,
      userId: userGlobalData.user.uid,
      content: { default: postContent, ...platformContent },
      selectedAccounts,
    };

    try {
      if (draftId) {
        const existingDraft = drafts.find((d) => d.id === draftId);
        if (existingDraft) {
          await orbitProvider.updateDraft(draftId, draftData);
          dispatch(
            updateDraftAction({
              ...existingDraft,
              ...draftData,
              id: draftId,
              lastEdited: Date.now(),
            })
          );
        }
      } else {
        const newDraft = await orbitProvider.saveDraft(draftData);
        if (userGlobalData) {
          const completeDraft = { ...newDraft, user: userGlobalData.userData };
          dispatch(addDraft(completeDraft));
          setDraftId(newDraft.id);
        }
      }
      setPostSuccess("Draft saved successfully!");
    } catch (error) {
      console.error("Error saving draft:", error);
      setPostError("Failed to save draft.");
    }
  };

  const handleContinueDraft = (draft: Draft) => {
    setPostContent(draft.content.default);
    const { default: defaultContent, ...platformOverrides } = draft.content;
    setPlatformContent(platformOverrides);
    setSelectedAccounts(draft.selectedAccounts);
    setDraftId(draft.id);
    setActiveTab("create");
  };

  const handleDeleteDraft = async (id: string) => {
    try {
      await orbitProvider.deleteDraft(id);
      dispatch(deleteDraftAction(id));
    } catch (error) {
      console.error("Error deleting draft:", error);
      setPostError("Failed to delete draft.");
    }
  };

  const handleSchedule = async () => {
    if (
      !userGlobalData ||
      !userGlobalData.workspace ||
      !postContent.trim() ||
      !scheduleDate ||
      !scheduleTime ||
      selectedAccounts.length === 0
    ) {
      return;
    }
    setIsScheduling(true);
    const cost = selectedAccounts.length * 0.2;
    try {
      await orbitProvider.deductPi(userGlobalData.user.uid, cost);
    } catch (error: any) {
      setPostError(error.message);
      setIsScheduling(false);
      return;
    }

    const scheduledTime = new Date(`${scheduleDate}T${scheduleTime}`).getTime();

    const contentPayload: { [key: string]: string } = { default: postContent };
    getSelectedPlatforms().forEach((platformId) => {
      const platformSpecificContent = platformContent[platformId.toLowerCase()];
      if (platformSpecificContent) {
        contentPayload[platformId.toLowerCase()] = platformSpecificContent;
      }
    });

    const postData = {
      workspaceId: userGlobalData.workspace.id,
      userId: userGlobalData.user.uid,
      accounts: selectedAccounts,
      content: contentPayload,
      images: selectedImages,
      reddit: redditData,
      scheduledTime: scheduledTime,
    };

    try {
      const response = await orbitProvider.postContent(postData);
      if (response.success && response.postIds && response.postIds.length > 0) {
        const postId = response.postIds[0];
        if (userGlobalData) {
          const newScheduledPost = {
            id: postId,
            workspaceId: userGlobalData.workspace.id,
            userId: userGlobalData.user.uid,
            content: { default: postContent, ...platformContent },
            selectedAccounts,
            scheduledTime,
            createdAt: Date.now(),
            user: userGlobalData.userData,
          };
          dispatch(addScheduledPost(newScheduledPost));
        }
        setPostSuccess("Your post has been scheduled successfully!");
        setPostContent("");
        setPlatformContent({});
        setSelectedAccounts([]);
        setScheduleDate("");
        setScheduleTime("");
        setDraftId(null);
        setSelectedImages([]);
        setRedditData(null);
      } else {
        await orbitProvider.addPi(userGlobalData.user.uid, cost);
        if (
          response.errors &&
          response.errors.some((e: any) => e.needsReauthentication)
        ) {
          setShowReauthToast(true);
        }
        const errorMessages = response.errors
          ?.map((e: any) => `${e.platform}: ${e.error}`)
          .join("\n");
        setPostError(
          errorMessages || "An unknown error occurred while scheduling."
        );
      }
    } catch (error) {
      await orbitProvider.addPi(userGlobalData.user.uid, cost);
      console.error("Error scheduling post:", error);
      setPostError("Failed to schedule post.");
    } finally {
      setIsScheduling(false);
    }
  };

  const handleDeleteScheduledPost = async (id: string) => {
    try {
      await orbitProvider.deleteScheduledPost(id);
      dispatch(deleteScheduledPostAction(id));
    } catch (error) {
      console.error("Error deleting scheduled post:", error);
      setPostError("Failed to delete scheduled post.");
    }
  };

  const handlePostScheduledPostNow = async (id: string) => {
    try {
      await orbitProvider.postScheduledPostNow(id);
      dispatch(deleteScheduledPostAction(id));
      setPostSuccess("Post sent successfully!");
    } catch (error) {
      console.error("Error posting scheduled post now:", error);
      setPostError("Failed to post scheduled post.");
    }
  };

  const handleSelectTemplate = (template: Template) => {
    setShowTemplateSelection(false);
    setSelectedTemplate(template); // Set the template right away

    if (template.placeholders && template.placeholders.length > 0) {
      setShowPlaceholderModal(true);
    } else {
      setPostContent(template.defaultText);
      if (template.platformOverrides) {
        const newPlatformContent: { [key: string]: string } = {};
        for (const [platform, text] of Object.entries(
          template.platformOverrides
        )) {
          if (text) {
            // only add if text is not null/undefined
            newPlatformContent[platform.toLowerCase()] = text;
          }
        }
        setPlatformContent(newPlatformContent);
      } else {
        setPlatformContent({});
      }
    }
  };

  const handlePlaceholderContinue = (values: { [key: string]: string }) => {
    if (!selectedTemplate) return;

    let newText = selectedTemplate.defaultText;
    let newPlatformContent = { ...selectedTemplate.platformOverrides };

    Object.entries(values).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      newText = newText.replace(new RegExp(placeholder, "g"), value);
      Object.keys(newPlatformContent).forEach((platform) => {
        if (newPlatformContent[platform as keyof typeof newPlatformContent]) {
          newPlatformContent[platform as keyof typeof newPlatformContent] =
            newPlatformContent[
              platform as keyof typeof newPlatformContent
            ]!.replace(new RegExp(placeholder, "g"), value);
        }
      });
    });

    setPostContent(newText);
    setPlatformContent(newPlatformContent as { [key: string]: string });
    setShowPlaceholderModal(false);
  };

  const validateContent = useCallback(() => {
    const errors: { [key: string]: string[] } = {};
    const selectedPlatforms = getSelectedPlatforms();
    selectedPlatforms.forEach((platformId) => {
      const content = platformContent[platformId.toLowerCase()] || postContent;
      const platformErrors: string[] = [];

      if (platformId === "Twitter" && content.length > 280) {
        platformErrors.push("Tweet cannot exceed 280 characters.");
      }

      if (platformId === "Reddit") {
        if (!redditData?.title) {
          platformErrors.push("Reddit posts require a title.");
        }
        if (!redditData?.subreddit) {
          platformErrors.push("Reddit posts require a subreddit.");
        }
      }
      // Add other platform-specific validation rules here

      if (platformErrors.length > 0) {
        errors[platformId] = platformErrors;
      }
    });

    setValidationErrors(errors);
  }, [postContent, platformContent, redditData]);

  useEffect(() => {
    validateContent();
  }, [postContent, platformContent, selectedAccounts]);

  return (
    <div className="min-h-screen bg-slate-50">
      <ImageSelectionPanel
        isOpen={showImageSelectionPanel}
        onClose={() => setShowImageSelectionPanel(false)}
        onSelectImages={(images) => {
          setSelectedImages(images);
          setShowImageSelectionPanel(false);
        }}
        selectedImages={selectedImages}
      />
      <RedditPostModal
        isOpen={showRedditModal}
        onClose={() => setShowRedditModal(false)}
        onSave={(data) => {
          setRedditData(data);
          setShowRedditModal(false);
        }}
      />
      <TemplateSelectionModal
        isOpen={showTemplateSelection}
        onClose={() => setShowTemplateSelection(false)}
        onSelectTemplate={handleSelectTemplate}
      />
      {selectedTemplate && (
        <PlaceholderModal
          isOpen={showPlaceholderModal}
          onClose={() => setShowPlaceholderModal(false)}
          placeholders={selectedTemplate.placeholders || []}
          onContinue={handlePlaceholderContinue}
        />
      )}
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-3">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Create Studio
              </h1>
              <div className="hidden md:flex items-center space-x-2 text-sm text-slate-600">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Content Creation</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1.5 bg-indigo-600 text-white px-2.5 py-1.5 rounded-lg text-sm font-medium">
                <Crown className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pro</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <nav className="flex space-x-6 sm:space-x-8 overflow-x-auto">
            {[
              { id: "create", label: "Create", icon: Plus },
              { id: "drafts", label: "Drafts", icon: FileText },
              { id: "scheduled", label: "Scheduled", icon: Calendar },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-3 sm:py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-indigo-600 text-indigo-700"
                    : "border-transparent text-slate-600 hover:text-slate-800 hover:border-slate-300"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Create Tab */}
        {activeTab === "create" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Main Editor */}
            <div className="lg:col-span-2 space-y-4">
              {/* Post Status Alerts */}
              {showReauthToast && (
                <div className="fixed top-20 right-5 bg-white border border-yellow-300 rounded-lg shadow-lg p-4 max-w-sm z-50 animate-fade-in-down">
                  <div className="flex items-start">
                    <AlertCircle className="w-6 h-6 text-yellow-500 mr-3" />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">
                        Action Required
                      </p>
                      <p className="text-sm text-slate-600">
                        Some accounts need to be re-authenticated.
                      </p>
                      <button
                        onClick={() => {
                          setShowReauthToast(false);
                          navigate("/accounts", {
                            state: { refresh: true },
                          });
                        }}
                        className="mt-3 w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-medium text-sm transition-colors"
                      >
                        Go to Accounts
                      </button>
                    </div>
                    <button
                      onClick={() => setShowReauthToast(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              )}
              {postSuccess && (
                <div className="fixed top-20 right-5 bg-white border border-emerald-300 rounded-lg shadow-lg p-4 max-w-sm z-50 animate-fade-in-down">
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-emerald-500 mr-3" />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">Success!</p>
                      <p className="text-sm text-slate-600">{postSuccess}</p>
                      {newPostId && (
                        <button
                          onClick={() => navigate(`/post/${newPostId}`)}
                          className="mt-3 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm transition-colors"
                        >
                          View Post
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => setPostSuccess(null)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              )}
              {postError && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-4 flex justify-between items-center">
                  <p>{postError}</p>
                  <button
                    onClick={() => setPostError(null)}
                    className="text-red-700"
                  >
                    &times;
                  </button>
                </div>
              )}

              {/* Compact Content Editor */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-slate-900">
                    {draftId ? "Edit Draft" : "Create Post"}
                  </h2>
                  <div className="flex items-center space-x-2">
                    {selectedTemplate ? (
                      <div className="flex items-center space-x-2 text-sm text-slate-600 bg-slate-100 rounded-lg p-2">
                        <Book className="w-4 h-4" />
                        <span>Template: {selectedTemplate.name}</span>
                        <button
                          onClick={() => {
                            setSelectedTemplate(null);
                            setPostContent("");
                            setPlatformContent({});
                          }}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          &times;
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowTemplateSelection(true)}
                        className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors"
                      >
                        <Book className="w-4 h-4" />
                        <span className="hidden sm:inline">
                          Choose Template
                        </span>
                      </button>
                    )}
                    <button
                      onClick={() => setShowAISuggestions(!showAISuggestions)}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span className="hidden sm:inline">AI Assist</span>
                    </button>
                  </div>
                </div>

                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    <button
                      onClick={() => setActivePlatformTab("default")}
                      className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                        activePlatformTab === "default"
                          ? "border-indigo-500 text-indigo-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Default
                    </button>
                    {getSelectedPlatforms().map((p) => (
                      <button
                        key={p}
                        onClick={() => setActivePlatformTab(p)}
                        className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                          activePlatformTab === p
                            ? "border-indigo-500 text-indigo-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        } ${
                          validationErrors[p]
                            ? "text-red-600 border-red-500"
                            : ""
                        }`}
                      >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </button>
                    ))}
                  </nav>
                </div>

                {activePlatformTab === "default" ? (
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="What's on your mind? Share your thoughts with the world..."
                    className="w-full h-24 p-3 border-t-0 border-slate-200 rounded-b-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors mb-3"
                  />
                ) : (
                  <textarea
                    value={
                      platformContent[activePlatformTab.toLowerCase()] || ""
                    }
                    onChange={(e) =>
                      setPlatformContent((prev) => ({
                        ...prev,
                        [activePlatformTab.toLowerCase()]: e.target.value,
                      }))
                    }
                    placeholder={`Custom content for ${activePlatformTab}...`}
                    className="w-full h-24 p-3 border-t-0 border-slate-200 rounded-b-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors mb-3"
                  />
                )}

                {selectedImages.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-slate-700 mb-2">
                      Selected Images:
                    </p>
                    <div className="flex space-x-2">
                      {selectedImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`selected ${index}`}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          <button
                            onClick={() =>
                              setSelectedImages(
                                selectedImages.filter((_, i) => i !== index)
                              )
                            }
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={handlePostNow}
                    disabled={
                      isPosting ||
                      !postContent.trim() ||
                      selectedAccounts.length === 0
                    }
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                  >
                    {isPosting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Posting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Post Now</span>
                        {selectedAccounts.length > 0 && (
                          <div className="flex items-center space-x-1 bg-white/20 px-2 py-0.5 rounded-full">
                            <PiIcon size="w-3 h-3" className="text-white" />
                            <span className="text-xs font-bold">
                              {(selectedAccounts.length * 0.1).toFixed(1)}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowScheduleModal(true)}
                    disabled={
                      isScheduling ||
                      !postContent.trim() ||
                      selectedAccounts.length === 0
                    }
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                  >
                    {isScheduling ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-700 border-t-transparent rounded-full animate-spin"></div>
                        <span>Scheduling...</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4" />
                        <span>Schedule</span>
                        {selectedAccounts.length > 0 && (
                          <div className="flex items-center space-x-1 bg-slate-200/70 px-2 py-0.5 rounded-full">
                            <PiIcon
                              size="w-3 h-3"
                              className="text-slate-600"
                            />
                            <span className="text-xs font-bold text-slate-600">
                              {(selectedAccounts.length * 0.2).toFixed(1)}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleSaveDraft}
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>{draftId ? "Update Draft" : "Save Draft"}</span>
                  </button>
                  <button
                    onClick={() => setShowImageSelectionPanel(true)}
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium transition-colors"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Add Image</span>
                  </button>
                </div>
              </div>

              {/* Compact Platform Selection */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Select Accounts
                  </h3>
                  <button
                    onClick={toggleAllAccounts}
                    className="px-3 py-1.5 text-sm font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    Select All Accounts
                  </button>
                </div>
                <div className="space-y-3">
                  {platforms.map((platform) => {
                    const platformAccountIds = platform.accounts.map(
                      (acc) => acc.id
                    );
                    const selectedPlatformAccounts = selectedAccounts.filter(
                      (acc) => platformAccountIds.includes(acc.accountId)
                    );
                    const allAccountsSelected =
                      platformAccountIds.length > 0 &&
                      platformAccountIds.every((id) =>
                        selectedAccounts.some((sa) => sa.accountId === id)
                      );
                    const someAccountsSelected =
                      selectedPlatformAccounts.length > 0 &&
                      !allAccountsSelected;

                    return (
                      <div
                        key={platform.id}
                        className="border border-slate-200 rounded-lg p-3"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div
                              className={`p-1.5 rounded-lg ${platform.color}`}
                            >
                              <platform.icon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 text-sm">
                                {platform.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                {platform.accounts.length} accounts
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              toggleAllAccountsForPlatform(platform.id)
                            }
                            className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                              allAccountsSelected
                                ? "bg-indigo-600 text-white"
                                : someAccountsSelected
                                  ? "bg-indigo-100 text-indigo-700 border border-indigo-300"
                                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                          >
                            {allAccountsSelected
                              ? "Deselect All"
                              : "Select All"}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                          {platform.accounts.map((account) => (
                            <div
                              key={account.id}
                              onClick={() =>
                                toggleAccount(account.id, platform.id)
                              }
                              className={`p-2 rounded-lg border cursor-pointer transition-all ${
                                selectedAccounts.some(
                                  (a) => a.accountId === account.id
                                )
                                  ? "border-indigo-500 bg-indigo-50"
                                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 flex-1 min-w-0">
                                  <img
                                    src={account.profilePicture}
                                    alt={account.name}
                                    className="w-6 h-6 rounded-full"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-slate-900 text-sm truncate">
                                      {account.name}
                                    </p>
                                    <p className="text-xs text-slate-500 truncate">
                                      {account.handle} • {account.followers}{" "}
                                      followers
                                    </p>
                                  </div>
                                </div>
                                {selectedAccounts.some(
                                  (a) => a.accountId === account.id
                                ) && (
                                  <CheckCircle className="w-4 h-4 text-indigo-500 flex-shrink-0 ml-2" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

      <ScheduleModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSchedule={handleSchedule}
        scheduleDate={scheduleDate}
        setScheduleDate={setScheduleDate}
        scheduleTime={scheduleTime}
        setScheduleTime={setScheduleTime}
        isScheduling={isScheduling}
        cost={selectedAccounts.length * 0.2}
      />
            </div>

            {/* Sidebar - Live Preview */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Live Preview
                </h3>
                <div className="space-y-3">
                  {selectedAccounts.map(({ accountId, platformId }) => {
                    const platform = platforms.find((p) => p.id === platformId);
                    const account = platform?.accounts.find(
                      (acc) => acc.id === accountId
                    );

                    if (!platform || !account) return null;

                    const content =
                      platformContent[platform.name.toLowerCase()] ||
                      postContent;
                    const errors = validationErrors[platform.id];

                    return (
                      <div
                        key={accountId}
                        className={`border rounded-lg p-3 ${
                          errors ? "border-red-500" : "border-slate-200"
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <platform.icon className="w-4 h-4 text-slate-600" />
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-slate-900 block truncate">
                              {account.name}
                            </span>
                            <span className="text-xs text-slate-500 block truncate">
                              {account.handle}
                            </span>
                          </div>
                        </div>
                        <div className="bg-slate-50 rounded p-2 text-sm text-slate-700">
                          {content || "Your post preview will appear here..."}
                        </div>
                        {errors && (
                          <div className="mt-2 text-red-600 text-xs">
                            <ul>
                              {errors.map((error, index) => (
                                <li key={index}>{error}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {selectedAccounts.length === 0 && (
                    <div className="text-center py-6 text-slate-500">
                      <p className="text-sm">Select accounts to see previews</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Drafts Tab */}
        {activeTab === "drafts" && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
              Drafts
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {drafts.map((draft, index) => {
                const ref =
                  index === drafts.length - 1 ? lastDraftElementRef : null;
                return (
                  <div
                    ref={ref}
                    key={draft.id}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between"
                  >
                    <p className="text-slate-600 mb-4">
                      {draft.content.default}
                    </p>
                    <div>
                      <p className="text-sm text-slate-500 mb-2">
                        By: {draft.user.username}
                      </p>
                      <p className="text-sm text-slate-500 mb-2">
                        Last edited:{" "}
                        {new Date(draft.lastEdited).toLocaleString()}
                      </p>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleContinueDraft(draft)}
                          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm transition-colors"
                        >
                          Continue
                        </button>
                        <button
                          onClick={() => handleDeleteDraft(draft.id)}
                          className="p-2 text-slate-400 hover:text-red-600 border border-slate-200 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {drafts.length === 0 && !loading && (
              <p className="text-slate-500">No drafts saved.</p>
            )}
            {loading && (
              <div className="text-center py-4">
                <p>Loading...</p>
              </div>
            )}
          </div>
        )}

        {/* Scheduled Tab */}
        {activeTab === "scheduled" && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
              Scheduled Posts
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {scheduledPosts.map((post, index) => {
                const ref =
                  index === scheduledPosts.length - 1
                    ? lastScheduledPostElementRef
                    : null;
                return (
                  <div
                    ref={ref}
                    key={post.id}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between"
                  >
                    <p className="text-slate-600 mb-4">
                      {post.content.default}
                    </p>
                    <div>
                      <p className="text-sm text-slate-500 mb-2">
                        By: {post.user.username}
                      </p>
                      <p className="text-sm text-slate-500 mb-2">
                        Scheduled for:{" "}
                        {new Date(post.scheduledTime).toLocaleString()}
                      </p>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePostScheduledPostNow(post.id)}
                          className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium text-sm transition-colors"
                        >
                          Post Now
                        </button>
                        <button
                          onClick={() => handleDeleteScheduledPost(post.id)}
                          className="p-2 text-slate-400 hover:text-red-600 border border-slate-200 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {scheduledPosts.length === 0 && !loading && (
              <p className="text-slate-500">No posts scheduled.</p>
            )}
            {loading && (
              <div className="text-center py-4">
                <p>Loading...</p>
              </div>
            )}
          </div>
        )}
      </div>
      {showScrollToTop && (
        <button
          onClick={scrollTop}
          className="fixed bottom-10 right-10 bg-indigo-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default CreatePage;
