"use client";

import type React from "react";

import {
  Facebook,
  Instagram,
  Twitter,
  X,
  MessageCircle,
  CheckCircle,
  Clock,
  Loader2,
} from "lucide-react";
import type { SupportedPlatforms } from "../types";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { useEffect, useState } from "react";
import eventBus from "../utils/eventBus";

interface ConnectSocialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlatform: (platform: SupportedPlatforms) => void;
}

const socialPlatforms: {
  name: SupportedPlatforms;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  available: boolean;
  description: string;
}[] = [
  {
    name: "Twitter",
    icon: Twitter,
    color: "text-sky-500",
    bgColor: "bg-sky-50 hover:bg-sky-100",
    available: true,
    description: "Post tweets and engage with your audience",
  },
  {
    name: "Facebook",
    icon: Facebook,
    color: "text-blue-600",
    bgColor: "bg-blue-50 hover:bg-blue-100",
    available: false,
    description: "Share updates and connect with followers",
  },
  {
    name: "Instagram",
    icon: Instagram,
    color: "text-pink-500",
    bgColor: "bg-pink-50 hover:bg-pink-100",
    available: false,
    description: "Share photos and stories with your community",
  },
  {
    name: "Reddit",
    icon: MessageCircle,
    color: "text-orange-500",
    bgColor: "bg-orange-50 hover:bg-orange-100",
    available: true,
    description: "Engage in discussions and share content",
  },
  {
    name: "Threads",
    icon: MessageCircle,
    color: "text-gray-800",
    bgColor: "bg-gray-50 hover:bg-gray-100",
    available: true,
    description: "Connect through text-based conversations",
  },
  {
    name: "Bluesky",
    icon: MessageCircle,
    color: "text-blue-500",
    bgColor: "bg-blue-50 hover:bg-blue-100",
    available: true,
    description: "Join the decentralized social network",
  },
];

const ConnectSocialsModal: React.FC<ConnectSocialsModalProps> = ({
  isOpen,
  onClose,
  onSelectPlatform,
}) => {
  const userGlobalData = useSelector(
    (state: RootState) => state.orbit.userGlobalData
  );

  const [loadingPlatform, setLoadingPlatform] =
    useState<SupportedPlatforms | null>(null);

  useEffect(() => {
    if (isOpen) {
      eventBus.emit("fullscreen:enter");
    }

    return () => {
      eventBus.emit("fullscreen:exit");
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePlatformClick = async (platform: SupportedPlatforms) => {
    // Prevent double clicks
    if (loadingPlatform) return;

    if (
      platform === "Twitter" ||
      platform === "Reddit" ||
      platform === "Threads" ||
      platform === "Bluesky"
    ) {
      setLoadingPlatform(platform);
      try {
        await onSelectPlatform(platform);
      } finally {
        setLoadingPlatform(null);
      }
    } else {
      alert(`${platform} integration is coming soon!`);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-2 sm:p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-2 sm:mx-0 max-h-[95vh] overflow-y-auto">
          <div className="relative px-4 sm:px-6 pt-6 pb-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-xl">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white hover:bg-opacity-80 rounded-full transition-all duration-200"
            >
              <X size={18} />
            </button>

            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="text-white" size={20} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Connect Social Accounts
              </h2>
              <p className="text-gray-600 text-sm max-w-md mx-auto">
                Choose a platform to connect and start managing your social
                presence
              </p>
            </div>
          </div>

          <div className="px-4 sm:px-6 py-4 sm:py-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-4">
              {socialPlatforms.map((platform) => {
                const isLoading = loadingPlatform === platform.name;
                const isDisabled = !platform.available || !!loadingPlatform;

                return (
                  <button
                    key={platform.name}
                    onClick={() => handlePlatformClick(platform.name)}
                    disabled={isDisabled}
                    className={`
                      w-full flex flex-col items-center p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 text-center relative
                      ${
                        platform.available && !loadingPlatform
                          ? `${platform.bgColor} border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-105 cursor-pointer`
                          : "bg-gray-50 border-gray-100 cursor-not-allowed opacity-60"
                      }
                      ${isLoading ? "opacity-75" : ""}
                    `}
                  >
                    <div
                      className={`p-2 sm:p-3 rounded-xl ${platform.available ? platform.color : "text-gray-400"} bg-white shadow-sm mb-2 sm:mb-3`}
                    >
                      {isLoading ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <platform.icon size={20} />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-center gap-1 mb-1 sm:mb-2">
                        <span className="font-bold text-gray-800 text-sm sm:text-base">
                          {platform.name}
                        </span>
                        {platform.available ? (
                          <CheckCircle className="text-green-500" size={14} />
                        ) : (
                          <Clock className="text-gray-400" size={14} />
                        )}
                      </div>

                      <p className="hidden sm:block text-xs text-gray-600 leading-relaxed mb-2">
                        {platform.description}
                      </p>

                      {!platform.available ? (
                        <div className="inline-flex items-center px-2 py-1 bg-gray-200 rounded-full">
                          <p className="text-xs text-gray-500 font-medium">
                            Coming Soon
                          </p>
                        </div>
                      ) : (
                        <div className="inline-flex items-center px-2 sm:px-3 py-1 bg-white rounded-full shadow-sm border border-gray-200">
                          <span className="text-xs sm:text-sm font-medium text-gray-700">
                            {isLoading ? "Connecting..." : "Connect Now"}
                          </span>
                          {!isLoading && (
                            <span className="ml-1 sm:ml-2 text-gray-400">
                              →
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Accounts will be added to your active workspace.
              </p>
            </div>

            <div className="hidden sm:block mt-6 pt-4 border-t border-gray-100">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-sm">💡</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-base mb-1">
                      Pro Tip
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Connect multiple platforms to manage all your social
                      accounts from one unified dashboard. Schedule posts, track
                      engagement, and grow your audience across all platforms
                      seamlessly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConnectSocialsModal;
