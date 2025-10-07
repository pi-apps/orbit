"use client";

import type React from "react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import orbitProvider from "../backend/OrbitProvider";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Grid3X3,
  List,
  Clock,
  Eye,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Facebook,
  MessageSquare,
  Sparkles,
  Users,
  BarChart3,
} from "lucide-react";
import {
  setPosts,
  addPosts,
  setNextCursor,
  clearCalendarState,
} from "../store/calendarSlice";
import { RootState, AppDispatch } from "../store/store";
import useMediaQuery from "../hooks/useMediaQuery";
import DayPostsPanel from "../components/DayPostsPanel";
import eventBus from "../utils/eventBus";
import { AnimatePresence } from "framer-motion";

import { PostData } from "../types";

const platformColors: { [key: string]: string } = {
  instagram: "#E4405F",
  twitter: "#1DA1F2",
  linkedin: "#0077B5",
  youtube: "#FF0000",
  facebook: "#1877F2",
  tiktok: "#000000",
  threads: "#000000",
  reddit: "#FF4500",
};

const platformIcons: { [key: string]: React.FC<any> } = {
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
  facebook: Facebook,
  tiktok: MessageSquare,
  threads: MessageSquare, // No threads icon in lucide-react, using fallback
  reddit: MessageSquare, // No reddit icon in lucide-react, using fallback
};

type ViewMode = "month" | "week" | "day" | "timeline";

const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { postIds, posts, nextCursor } = useSelector(
    (state: RootState) => state.calendar
  );
  const activeWorkspaceId = useSelector(
    (state: RootState) =>
      state.orbit.userGlobalData?.userData?.activeWorkspaceId
  );

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [postStatusFilter, setPostStatusFilter] = useState<
    "all" | "posted" | "scheduled"
  >("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [loading, setLoading] = useState(false);

  const fetchPosts = useCallback(
    async (cursor?: string | null) => {
      if (loading || !activeWorkspaceId) return;

      setLoading(true);
      try {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const startDate = new Date(year, month, 1).toISOString();
        const endDate = new Date(year, month + 1, 0).toISOString();
        const response = await orbitProvider.getCalendarPosts(
          activeWorkspaceId,
          startDate,
          endDate,
          postStatusFilter,
          cursor
        );

        const { posts: newPosts, nextCursor: newNextCursor } = response;

        if (cursor) {
          dispatch(addPosts(newPosts));
        } else {
          dispatch(setPosts(newPosts));
        }
        dispatch(setNextCursor(newNextCursor));
      } catch (error) {
        console.error("Error fetching calendar posts:", error);
      } finally {
        setLoading(false);
      }
    },
    [activeWorkspaceId, currentDate, loading, postStatusFilter]
  );

  useEffect(() => {
    if (activeWorkspaceId) {
      window.scrollTo(0, 0);
      fetchPosts();
    }
    return () => {
      dispatch(clearCalendarState());
    };
  }, [activeWorkspaceId, currentDate]);

  const allPosts: PostData[] = useMemo(() => {
    return postIds.map((id) => posts[id]).filter(Boolean);
  }, [postIds, posts]);

  // Filter posts based on selected platforms and campaigns
  const filteredPosts = useMemo(() => {
    if (selectedPlatforms.length === 0) {
      return allPosts;
    }
    return allPosts.filter((post) => {
      if (!post.platformId) return false;
      return selectedPlatforms.includes(post.platformId.toLowerCase());
    });
  }, [allPosts, selectedPlatforms]);

  // Get posts for a specific date
  const getPostsForDate = (date: Date) => {
    return filteredPosts.filter((post) => {
      if (!post.createdAt) return false;
      const postDate = new Date(post.createdAt);
      return postDate.toDateString() === date.toDateString();
    });
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    setCurrentDate(newDate);
  };
  const PlatformIcon = ({
    platform,
  }: {
    platform: keyof typeof platformIcons;
  }) => {
    if (typeof platform !== "string") {
      return <MessageSquare className="w-3.5 h-3.5 md:w-4 md:h-4" />;
    }
    const Icon =
      platformIcons[platform.toLowerCase() as keyof typeof platformIcons];

    // Always return a valid JSX element
    if (!Icon) {
      // Return a fallback icon or empty div if no icon is found
      return <MessageSquare className="w-3.5 h-3.5 md:w-4 md:h-4" />;
    }

    return <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />;
  };
  const PostCard = ({
    post,
    isCompact = false,
  }: {
    post: PostData;
    isCompact?: boolean;
  }) => (
    <div
      className={`bg-white rounded-md border-l-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${
        isCompact ? "p-1.5 md:p-2" : "p-2.5 md:p-3"
      }`}
      style={{
        borderLeftColor: post.platformId
          ? platformColors[post.platformId.toLowerCase()]
          : "#ccc",
      }}
    >
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center space-x-1.5 min-w-0 flex-1">
          <PlatformIcon platform={post.platformId.toLowerCase()} />
          <span
            className={`font-medium text-slate-800 truncate ${
              isCompact ? "text-xs" : "text-xs md:text-sm"
            }`}
          >
            {post.text?.substring(0, 50)}
          </span>
        </div>
        <div
          className={`flex items-center space-x-1 flex-shrink-0 ml-2 ${
            isCompact ? "text-xs" : "text-xs md:text-sm"
          }`}
        >
          <Clock className="w-3 h-3 text-slate-400" />
          <span className="text-slate-500 text-xs">
            {new Date(post.createdAt!).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
      {post.isScheduled && (
        <div className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full inline-block mt-1">
          Scheduled
        </div>
      )}

      {!isCompact && (
        <p className="text-xs md:text-sm text-slate-600 mb-2 line-clamp-2">
          {post.text}
        </p>
      )}

      <div className="flex items-center justify-between space-x-2">
        {post.publicMetrics && (
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <span className="flex items-center space-x-1">
              <BarChart3 className="w-3 h-3" />
              <span>{post.publicMetrics.likes}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );

  const MonthView = () => {
    const days = generateCalendarDays();
    const today = new Date();

    const handleDayClick = (day: Date) => {
      setSelectedDay(day);
      eventBus.emit("fullscreen:enter");
    };

    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="grid grid-cols-7 border-b border-slate-200">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="p-2 md:p-3 text-center font-semibold text-slate-700 border-r border-slate-200 last:border-r-0 bg-slate-50"
            >
              <span className="text-xs md:text-sm">{day}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const posts = getPostsForDate(day);
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isToday = day.toDateString() === today.toDateString();

            return (
              <div
                key={index}
                className={`min-h-24 md:min-h-32 p-1.5 md:p-2 border-r border-b border-slate-200 last:border-r-0 ${
                  !isCurrentMonth ? "bg-slate-50" : "bg-white"
                } hover:bg-slate-50 transition-colors`}
                onClick={() => handleDayClick(day)}
              >
                <div
                  className={`text-sm font-medium mb-1.5 ${
                    isToday
                      ? "bg-blue-600 text-white w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-xs"
                      : isCurrentMonth
                        ? "text-slate-900"
                        : "text-slate-400"
                  }`}
                >
                  {day.getDate()}
                </div>

                <div className="space-y-1">
                  {isMobile ? (
                    <div className="flex flex-wrap items-center">
                      {posts.slice(0, 5).map((post) => (
                        <PlatformIcon
                          key={post.id}
                          platform={post.platformId.toLowerCase()}
                        />
                      ))}
                      {posts.length > 5 && (
                        <div className="text-xs text-slate-500 ml-1">
                          +{posts.length - 5}
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {posts.slice(0, 4).map((post) => (
                        <PostCard key={post.id} post={post} isCompact />
                      ))}
                      {posts.length > 4 && (
                        <div className="text-xs text-slate-500 text-center py-0.5 bg-slate-100 rounded">
                          +{posts.length - 4} more
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const TimelineView = () => {
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (
        scrollHeight - scrollTop <= clientHeight * 1.5 &&
        !loading &&
        nextCursor
      ) {
        fetchPosts(nextCursor);
      }
    };

    return (
      <div
        className="space-y-3 md:space-y-4"
        onScroll={handleScroll}
        style={{ maxHeight: "100vh", overflowY: "auto" }}
      >
        {filteredPosts
          .sort(
            (a, b) =>
              new Date(a.createdAt!).getTime() -
              new Date(b.createdAt!).getTime()
          )
          .map((post) => (
            <div
              key={post.id}
              className="flex items-start space-x-3 md:space-x-4"
            >
              <div className="flex-shrink-0 w-16 md:w-20 text-right">
                <div className="text-sm font-medium text-slate-900">
                  {new Date(post.createdAt!).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div className="text-xs text-slate-500">
                  {new Date(post.createdAt!).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              <div className="flex-shrink-0 w-px h-12 md:h-16 bg-slate-200 mt-2"></div>
              <div className="flex-1">
                <PostCard post={post} />
              </div>
            </div>
          ))}
        {loading && <p>Loading more posts...</p>}
      </div>
    );
  };

  const handleClosePanel = () => {
    setSelectedDay(null);
    eventBus.emit("fullscreen:exit");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-2 md:p-2 lg:p-3">
      <AnimatePresence>
        {selectedDay && (
          <DayPostsPanel
            posts={getPostsForDate(selectedDay)}
            onClose={handleClosePanel}
            selectedDate={selectedDay}
          />
        )}
      </AnimatePresence>
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1 md:mb-2">
                Content Calendar
              </h1>
              <p className="text-slate-600 text-sm md:text-base">
                Your content strategy, visualized and organized
              </p>
            </div>

            <div className="flex items-center space-x-2 md:space-x-3 mt-3 lg:mt-0">
              <button
                onClick={() => navigate("/create")}
                className="flex items-center space-x-2 px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm md:text-base">New Post</span>
              </button>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-3 md:px-4 py-2 border border-slate-300 rounded-lg hover:bg-white transition-colors bg-white shadow-sm"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm md:text-base">Filters</span>
              </button>
            </div>
          </div>

          {/* AI Suggestions Banner */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-3 md:p-4 mb-3 md:mb-4">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-5 h-5 text-indigo-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">
                  AI Suggestion
                </p>
                <p className="text-sm text-slate-600">
                  You don't have content planned for Friday — want me to suggest
                  something?
                </p>
              </div>
              <button
                onClick={() => navigate("/ai-assist")}
                className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors flex-shrink-0"
              >
                AI Suggest
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3 md:p-4 mb-4 md:mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2 md:mb-3">
                  Platforms
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(platformColors).map((platform) => (
                    <button
                      key={platform}
                      onClick={() => {
                        setSelectedPlatforms((prev) =>
                          prev.includes(platform)
                            ? prev.filter((p) => p !== platform)
                            : [...prev, platform]
                        );
                      }}
                      className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border transition-colors text-sm ${
                        selectedPlatforms.includes(platform)
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <PlatformIcon platform={platform as any} />
                      <span className="capitalize">{platform}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2 md:mb-3">
                  Status
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(["all", "posted", "scheduled"] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setPostStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                        postStatusFilter === status
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <span className="capitalize">{status}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation and View Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6 space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3 md:space-x-4">
            <button
              onClick={() => navigateMonth("prev")}
              className="p-2 hover:bg-white rounded-lg transition-colors border border-slate-200 bg-white shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <h2 className="text-lg md:text-xl font-semibold text-slate-900">
              {currentDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h2>

            <button
              onClick={() => navigateMonth("next")}
              className="p-2 hover:bg-white rounded-lg transition-colors border border-slate-200 bg-white shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-1 bg-slate-100 rounded-lg p-1">
            {[
              { mode: "month", icon: Grid3X3, label: "Month" },
              { mode: "timeline", icon: List, label: "Timeline" },
            ].map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as ViewMode)}
                className={`flex items-center space-x-2 px-2.5 md:px-3 py-1.5 md:py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === mode
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Calendar Content */}
        <div className="mb-4 md:mb-6">
          {viewMode === "month" && <MonthView />}
          {viewMode === "timeline" && <TimelineView />}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-slate-600">
                  Total Posts
                </p>
                <p className="text-xl md:text-2xl font-bold text-slate-900">
                  {filteredPosts.length}
                </p>
              </div>
              <Calendar className="w-6 md:w-8 h-6 md:h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-slate-600">
                  Scheduled
                </p>
                <p className="text-xl md:text-2xl font-bold text-slate-900">
                  {filteredPosts.length}
                </p>
              </div>
              <Clock className="w-6 md:w-8 h-6 md:h-8 text-amber-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-slate-600">
                  Published
                </p>
                <p className="text-xl md:text-2xl font-bold text-slate-900">
                  0
                </p>
              </div>
              <Eye className="w-6 md:w-8 h-6 md:h-8 text-emerald-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-slate-600">
                  Platforms
                </p>
                <p className="text-xl md:text-2xl font-bold text-slate-900">
                  {new Set(filteredPosts.map((p) => p.platformId)).size}
                </p>
              </div>
              <Users className="w-6 md:w-8 h-6 md:h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
