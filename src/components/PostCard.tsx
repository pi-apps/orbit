import React, { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Calendar,
  ChevronDown,
  ChevronUp,
  Eye,
  MoreHorizontal,
  TrendingUp,
  Users,
  X,
  Trash2,
  Copy,
  Edit,
  Pin,
  Flag,
  BarChart3,
  Clock,
  ExternalLink,
  // Added platform icons
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Music,
  AtSign,
  Globe,
} from "lucide-react";
import { PostData } from "../types";
import eventBus from "../utils/eventBus";
import { getRedditPostLink } from "../utils/getRedditPostLink";
import { FaReddit } from "react-icons/fa";

interface PostActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: string) => void;
  isMobile?: boolean;
}

const PostActionsModal: React.FC<PostActionsModalProps> = ({
  isOpen,
  onClose,
  onAction,
  isMobile = false,
}) => {
  useEffect(() => {
    if (isOpen) {
      eventBus.emit("fullscreen:enter");
    }

    return () => {
      eventBus.emit("fullscreen:exit");
    };
  }, [isOpen]);
  if (!isOpen) return null;

  const actions = [
    {
      id: "analytics",
      label: "View Analytics",
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "hover:bg-blue-50",
    },
    {
      id: "edit",
      label: "Edit Post",
      icon: Edit,
      color: "text-green-600",
      bgColor: "hover:bg-green-50",
    },
    {
      id: "pin",
      label: "Pin Post",
      icon: Pin,
      color: "text-purple-600",
      bgColor: "hover:bg-purple-50",
    },
    {
      id: "share",
      label: "Share Post",
      icon: Share2,
      color: "text-indigo-600",
      bgColor: "hover:bg-indigo-50",
    },
    {
      id: "copy",
      label: "Copy Link",
      icon: Copy,
      color: "text-gray-600",
      bgColor: "hover:bg-gray-50",
    },
    {
      id: "report",
      label: "Report Post",
      icon: Flag,
      color: "text-orange-600",
      bgColor: "hover:bg-orange-50",
    },
    {
      id: "delete",
      label: "Delete Post",
      icon: Trash2,
      color: "text-red-600",
      bgColor: "hover:bg-red-50",
      destructive: true,
    },
  ];

  const handleAction = (actionId: string) => {
    eventBus.emit("fullscreen:exit");
    onAction(actionId);
    onClose();
  };

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex items-end">
        <div
          className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        <div className="relative w-full bg-white rounded-t-2xl shadow-xl max-h-[80vh] overflow-hidden">
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>
          <div className="px-4 pb-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>
          </div>
          <div className="px-4 py-2 space-y-1 overflow-y-auto">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleAction(action.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-colors ${action.bgColor} ${
                  action.destructive ? "border border-red-200" : ""
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg ${action.destructive ? "bg-red-50" : "bg-white shadow-sm"}`}
                >
                  <action.icon size={16} className={action.color} />
                </div>
                <span
                  className={`font-medium text-sm ${action.destructive ? "text-red-600" : "text-gray-900"}`}
                >
                  {action.label}
                </span>
              </button>
            ))}
          </div>
          <div className="h-6" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xs bg-white rounded-2xl shadow-xl">
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Actions</h3>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={16} className="text-gray-500" />
            </button>
          </div>
        </div>
        <div className="px-4 py-2 space-y-1 max-h-80 overflow-y-auto">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleAction(action.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-colors ${action.bgColor} ${
                action.destructive ? "border border-red-200" : ""
              }`}
            >
              <div
                className={`p-1.5 rounded-lg ${action.destructive ? "bg-red-50" : "bg-white shadow-sm"}`}
              >
                <action.icon size={16} className={action.color} />
              </div>
              <span
                className={`font-medium text-sm ${action.destructive ? "text-red-600" : "text-gray-900"}`}
              >
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

interface PostCardProps {
  post: PostData;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getPostUrl = (post: PostData): string | null => {
    if (!post.platformPostId) return null;

    switch (post.platformId.toLowerCase()) {
      case "twitter":
        return `https://twitter.com/${post.platformProfileData?.username}/status/${post.platformPostId}`;
      case "facebook":
        return `https://www.facebook.com/${post.platformPostId}`;
      case "instagram":
        return `https://www.instagram.com/p/${post.platformPostId}`;
      case "linkedin":
        return `https://www.linkedin.com/feed/update/urn:li:activity:${post.platformPostId}`;
      case "reddit":
        return getRedditPostLink(post.platformPostId);
      case "threads":
        return post?.platformPostUrl
          ? post?.platformPostUrl
          : `https://www.threads.net/@${post.platformProfileData?.username}/post/${post.platformPostId}`;
      case "youtube":
        return `https://www.youtube.com/watch?v=${post.platformPostId}`;
      default:
        return null;
    }
  };

  const handleOpenInSocialMedia = () => {
    const url = getPostUrl(post);
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      alert("Could not open post in social media.");
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 7) return date.toLocaleDateString();
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    return "now";
  };

  const handleAction = (action: string) => {
    console.log(`Action: ${action}`);
    switch (action) {
      case "delete":
        alert("Delete post functionality");
        break;
      case "share":
        alert("Share post functionality");
        break;
      case "edit":
        alert("Edit post functionality");
        break;
      default:
        alert(`${action} functionality`);
    }
  };

  const getPlatformColor = (platform: string) => {
    const colors: { [key: string]: string } = {
      twitter: "#000000", // X branding is black
      instagram: "#E4405F",
      facebook: "#1877F2",
      tiktok: "#000000",
      youtube: "#FF0000",
      threads: "#000000",
      linkedin: "#0A66C2",
      reddit: "#FF4500",
    };
    return colors[platform.toLowerCase()] || "#6B7280";
  };

  const getPlatformIcon = (platform: string): React.ElementType => {
    switch (platform.toLowerCase()) {
      case "twitter":
        return Twitter; // The lucide icon is the bird, which is still widely recognized.
      case "instagram":
        return Instagram;
      case "facebook":
        return Facebook;
      case "linkedin":
        return Linkedin;
      case "youtube":
        return Youtube;
      case "reddit":
        return FaReddit as any;
      case "threads":
        return AtSign; // No official lucide icon for Threads, using AtSign as a hint.
      case "tiktok":
        return Music; // No official lucide icon for TikTok, using Music as a hint.
      default:
        return Globe; // Default icon for any other platform.
    }
  };

  const metrics = [
    {
      icon: Heart,
      value: post.publicMetrics?.likes || 0,
      label: "Likes",
      color: "text-red-500",
      bgColor: "bg-red-50",
      isLiked: isLiked,
    },
    {
      icon: MessageCircle,
      value: post.publicMetrics?.comments || 0,
      label: "Comments",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: Share2,
      value: post.publicMetrics?.shares || 0,
      label: "Shares",
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      icon: BarChart3,
      value: post.publicMetrics?.views || 0,
      label: "Views",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
  ];

  const PlatformIcon = getPlatformIcon(post.platformId);

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 overflow-hidden">
        {/* Header - More Compact */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="relative">
                {post.platformProfileData ? (
                  <img
                    className="w-10 h-10 rounded-full shadow-md ring-2 ring-white"
                    src={post.platformProfileData.profilePicture}
                    // alt={post.platformProfileData.username}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-md">
                    <span className="text-white font-semibold text-sm">
                      {post.authorId?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                )}

                {/* Platform Badge with Lucide Icon */}
                <div
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center shadow-md ring-2 ring-white"
                  style={{ backgroundColor: getPlatformColor(post.platformId) }}
                >
                  <PlatformIcon size={12} className="text-white" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate text-sm">
                  {post.platformProfileData?.username || `@${post.authorId}`}
                </h3>
                <div className="flex items-center space-x-2 text-xs text-gray-500 mt-0.5">
                  <div className="flex items-center space-x-1">
                    <Clock size={12} />
                    <span>{formatDate(post.createdAt!)}</span>
                  </div>
                  <span>•</span>
                  <span className="capitalize">{post.platformId}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <button
                onClick={handleOpenInSocialMedia}
                className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
                title="Open in social media"
              >
                <ExternalLink size={16} className="text-gray-400" />
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <MoreHorizontal size={16} className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* Content - More Compact */}
          <div className="mt-3">
            <p className="text-gray-800 text-sm leading-relaxed line-clamp-3">
              {post.text}
            </p>
          </div>
          {post.images && post.images.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {post.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`post image ${index}`}
                  className="rounded-lg object-cover w-full h-full"
                />
              ))}
            </div>
          )}
        </div>

        {/* Metrics - Redesigned for Compactness */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
            {metrics.map((metric, index) => (
              <div key={index} className="flex items-center space-x-2 min-w-0">
                <div className={`p-1.5 rounded-lg ${metric.bgColor}`}>
                  <metric.icon
                    size={14}
                    className={`${metric.color} ${metric.isLiked ? "fill-current" : ""}`}
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatNumber(metric.value)}
                  </div>
                  <div className="text-xs text-gray-500 hidden sm:block">
                    {metric.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Post Actions Modal */}
      <PostActionsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAction={handleAction}
        isMobile={isMobile}
      />
    </>
  );
};

export default PostCard;
