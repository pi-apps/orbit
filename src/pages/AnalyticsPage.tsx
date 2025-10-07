"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import {
  BarChart3,
  TrendingUp,
  Heart,
  Eye,
  Download,
  RefreshCw,
  Instagram,
  Twitter,
  Linkedin,
  Users,
  MessageSquare,
  ThumbsUp,
  Share2,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import LoadingIndicator from "../components/LoadingIndicator";
import {
  selectAnalyticsDashboardData,
  selectUserGlobalData,
  setAnalyticsDashboardData,
} from "../store/orbitSlice";
import orbitProvider from "../backend/OrbitProvider";

const AnalyticsPage: React.FC = () => {
  const dispatch = useDispatch();
  const analyticsData = useSelector(selectAnalyticsDashboardData);
  const userGlobalData = useSelector(selectUserGlobalData);
  const [loading, setLoading] = useState(false);

  const [selectedTimeframe, setSelectedTimeframe] = useState("7d");
  const [selectedPlatform, setSelectedPlatform] = useState("all");

  const platformConfig: {
    [key: string]: { icon: React.ElementType; color: string };
  } = {
    Instagram: { icon: Instagram, color: "text-pink-600" },
    Twitter: { icon: Twitter, color: "text-sky-500" },
    Linkedin: { icon: Linkedin, color: "text-blue-700" },
  };

  const fetchAnalyticsData = useCallback(async () => {
    if (!userGlobalData?.workspace?.id) return;
    setLoading(true);
    try {
      const data = await orbitProvider.getAnalyticsDashboardData(
        userGlobalData.workspace.id
      );
      dispatch(setAnalyticsDashboardData(data));
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  }, [userGlobalData?.workspace?.id, dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!analyticsData) {
      fetchAnalyticsData();
    }
  }, [analyticsData, fetchAnalyticsData]);

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num?.toString() || "0";
  };

  const filteredData = (() => {
    if (!analyticsData) {
      return null;
    }
    if (selectedPlatform === "all") {
      return analyticsData;
    }
    const platformData = analyticsData.platformStats.find(
      (p) => p.platform.toLowerCase() === selectedPlatform
    );
    if (!platformData) {
      return analyticsData;
    }
    return {
      ...analyticsData,
      overview: {
        totalReach: platformData.reach,
        totalEngagement: platformData.engagement,
        totalPosts: platformData.posts,
        avgEngagementRate: platformData.avgEngagementRate,
      },
      platformStats: [platformData],
    };
  })();

  if (loading && !filteredData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <LoadingIndicator size="w-10 h-10" />
      </div>
    );
  }

  if (!filteredData) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <BarChart3 className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-gray-600 mb-4">No analytics data available.</p>
        <button
          onClick={fetchAnalyticsData}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          disabled={loading}
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          {loading ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>
    );
  }

  const kpiCards = [
    {
      label: "Total Reach",
      value: formatNumber(filteredData.overview.totalReach),
      icon: Eye,
      trend: "+15.5%",
    },
    {
      label: "Engagement",
      value: formatNumber(filteredData.overview.totalEngagement),
      icon: Heart,
      trend: "+8.3%",
    },
    {
      label: "Avg. Engagement",
      value: `${filteredData.overview.avgEngagementRate?.toFixed(2)}%`,
      icon: TrendingUp,
      trend: "+2.1%",
    },
    {
      label: "Total Posts",
      value: formatNumber(filteredData.overview.totalPosts),
      icon: BarChart3,
      trend: "+5",
    },
  ];

  const getDetailedMetrics = (
    platform: (typeof filteredData.platformStats)[0]
  ) => {
    switch (platform.platform) {
      case "Instagram":
        return [
          { label: "Story Views", value: formatNumber(platform.storyViews ?? 0), icon: Eye },
          { label: "Saves", value: formatNumber(platform.saves ?? 0), icon: Heart },
          { label: "Comments", value: formatNumber(platform.comments ?? 0), icon: MessageSquare },
          { label: "New Followers", value: formatNumber(platform.newFollowers ?? 0), icon: Users },
        ];
      case "Twitter":
        return [
          { label: "Retweets", value: formatNumber(platform.retweets ?? 0), icon: RefreshCw },
          { label: "Replies", value: formatNumber(platform.replies ?? 0), icon: MessageSquare },
          { label: "Likes", value: formatNumber(platform.likes ?? 0), icon: ThumbsUp },
          { label: "New Followers", value: formatNumber(platform.newFollowers ?? 0), icon: Users },
        ];
      case "Linkedin":
         return [
          { label: "Shares", value: formatNumber(platform.shares ?? 0), icon: Share2 },
          { label: "Comments", value: formatNumber(platform.comments ?? 0), icon: MessageSquare },
          { label: "Likes", value: formatNumber(platform.likes ?? 0), icon: ThumbsUp },
          { label: "New Followers", value: formatNumber(platform.newFollowers ?? 0), icon: Users },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Analytics
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Your social media performance at a glance.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm transition"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <button
                onClick={fetchAnalyticsData}
                disabled={loading}
                className="p-2 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-5 h-5 text-gray-600 ${
                    loading ? "animate-spin" : ""
                  }`}
                />
              </button>
              <button className="flex items-center px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </header>

        {/* Platform Filters */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex items-center gap-2 pb-2">
            <button
              onClick={() => setSelectedPlatform("all")}
              className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                selectedPlatform === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              All Platforms
            </button>
            {analyticsData &&
              analyticsData.platformStats.map((platform) => {
                const config = platformConfig[platform.platform];
                return (
                  <button
                    key={platform.platform}
                    onClick={() =>
                      setSelectedPlatform(platform.platform.toLowerCase())
                    }
                    className={`flex-shrink-0 flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                      selectedPlatform === platform.platform.toLowerCase()
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {config && (
                      <config.icon className={`w-4 h-4 mr-2 ${config.color}`} />
                    )}
                    {platform.platform}
                  </button>
                );
              })}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {kpiCards.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">{card.label}</p>
                <card.icon className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <div className="flex items-center text-xs mt-1 text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>{card.trend}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content: Platform Performance Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Platform Performance
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 font-semibold text-gray-600">Platform</th>
                  <th className="p-4 font-semibold text-gray-600">Followers</th>
                  <th className="p-4 font-semibold text-gray-600">
                    Engagement Rate
                  </th>
                  <th className="p-4 font-semibold text-gray-600">Reach</th>
                  <th className="p-4 font-semibold text-gray-600">
                    Impressions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.platformStats.map((platform) => {
                  const config = platformConfig[platform.platform];
                  return (
                    <tr key={platform.platform}>
                      <td className="p-4">
                        <div className="flex items-center font-semibold text-gray-800">
                          {config && (
                            <config.icon
                              className={`w-5 h-5 mr-3 ${config.color}`}
                            />
                          )}
                          {platform.platform}
                        </div>
                      </td>
                      <td className="p-4 font-medium text-gray-800">
                        {formatNumber(platform.followers)}
                      </td>
                      <td className="p-4 font-medium text-gray-800">
                        {platform.avgEngagementRate?.toFixed(2)}%
                      </td>
                      <td className="p-4 font-medium text-gray-800">
                        {formatNumber(platform.reach)}
                      </td>
                      <td className="p-4 font-medium text-gray-800">
                        {formatNumber(platform.impressions)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Detailed Metrics for selected platform */}
          {selectedPlatform !== "all" && filteredData.platformStats[0] && (
             <div className="p-4 sm:p-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {getDetailedMetrics(filteredData.platformStats[0]).map(metric => (
                      <div key={metric.label} className="bg-gray-50 rounded-lg p-3">
                         <div className="flex items-center text-gray-500 mb-1">
                           <metric.icon className="w-4 h-4 mr-2" />
                           <p className="text-sm">{metric.label}</p>
                         </div>
                         <p className="text-xl font-semibold text-gray-900">{metric.value}</p>
                      </div>
                   ))}
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;