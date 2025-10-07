"use client";

import React, { useEffect, useState } from "react";
import { Globe, Search, Plus, Bell, ChevronDown, Zap } from "lucide-react";
import { useSelector } from "react-redux";
import WorkspaceSwitcher from "./WorkspaceSwitcher";
import { useNavigate } from "react-router-dom";
import { selectUserGlobalData } from "../../store/orbitSlice";
import PiIcon from "../PiIcon";
import eventBus from "../../utils/eventBus";

const Button = ({
  onClick,
  children,
  className = "",
  variant = "default",
  size = "default",
  ...props
}: {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  [key: string]: any;
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-900",
    ghost: "hover:bg-gray-100 text-gray-900",
  };

  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 text-sm",
    lg: "h-11 px-8",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Badge = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={`inline-flex items-center justify-center bg-red-500 text-white font-bold ${className}`}
    >
      {children}
    </span>
  );
};

const Avatar = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}
  >
    {children}
  </div>
);

const AvatarImage = ({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) => (
  <img
    className={`aspect-square h-full w-full ${className}`}
    src={src || "/placeholder.svg"}
    alt={alt}
  />
);

const AvatarFallback = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-600 text-sm font-medium ${className}`}
  >
    {children}
  </div>
);

const Input = ({
  className = "",
  type = "text",
  placeholder,
  ...props
}: {
  className?: string;
  type?: string;
  placeholder?: string;
  [key: string]: any;
}) => (
  <input
    type={type}
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    placeholder={placeholder}
    {...props}
  />
);

// --- The Improved Header Component ---

const DesktopHeader = () => {
  const userGlobalData = useSelector(selectUserGlobalData);
  const [piBalance, setPiBalance] = useState(
    userGlobalData?.userData?.piBalance ?? 0
  );

  useEffect(() => {
    setPiBalance(userGlobalData?.userData?.piBalance ?? 0);
  }, [userGlobalData?.userData?.piBalance]);

  useEffect(() => {
    const handleBalanceUpdate = (newBalance: number) => {
      setPiBalance(newBalance);
    };
    eventBus.on("balanceUpdate", handleBalanceUpdate);
    return () => {
      eventBus.off("balanceUpdate", handleBalanceUpdate);
    };
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const navigate = useNavigate();
  const goToprofile = () => {
    navigate("/profile");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="w-full flex h-16 items-center px-6 max-w-[1600px] mx-auto">
        {/* Left Section - Workspace + Search */}
        <div className="flex items-center gap-4 flex-1">
          <WorkspaceSwitcher />

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search posts, analytics, team..."
              className="w-full pl-10 bg-gray-50 border-gray-200 hover:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Right Section - Actions + User */}
        <div className="flex items-center gap-3">
          {/* Pi Balance Display */}
          <div className="flex items-center gap-2 bg-gradient-to-br from-amber-50 to-orange-50 rounded-full px-4 py-2 border border-amber-200/60 shadow-sm">
            <PiIcon size="w-5 h-5" />
            <span className="font-semibold text-amber-900 text-sm">
              {piBalance?.toFixed(2)}
            </span>
          </div>

          {/* Create Post Button */}
          <Button
            onClick={() => navigate("/create-post")}
            variant="default"
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Post
          </Button>

          {/* Notifications */}
          <Button
            onClick={() => navigate("/notifications")}
            variant="ghost"
            size="sm"
            className="relative h-10 w-10 p-0 hover:bg-gray-100"
          >
            <Bell className="h-5 w-5 text-gray-600" />
          </Button>

          {/* User Profile Avatar */}
          <button
            onClick={goToprofile}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Avatar>
              <AvatarImage
                src={userGlobalData?.userData?.avatarUrl || "/placeholder.svg"}
                alt={userGlobalData?.userData?.username ?? ""}
              />
              <AvatarFallback>
                {getInitials(userGlobalData?.userData?.username ?? "")}
              </AvatarFallback>
            </Avatar>
          </button>
        </div>
      </div>
    </header>
  );
};

export default DesktopHeader;
