// src/pages/DashboardPage.tsx
"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Users,
  MessageSquare,
  Briefcase,
  CheckCircle,
  BarChart2,
  AlertTriangle,
  TrendingUp,
  Plus,
  Zap,
} from "lucide-react";
import AllPosts from "../components/AllPosts";
import { useDispatch, useSelector } from "react-redux";
import { Automation } from "../types";
import {
  setDashboardData,
  selectDashboardData,
  selectUserGlobalData,
  setInteractionsGrowthData,
  selectInteractionsGrowthData,
} from "../store/orbitSlice";
import { AppDispatch } from "../store/store";
import LoadingIndicator from "../components/LoadingIndicator";
import orbitProvider from "../backend/OrbitProvider";
import InteractionsGrowthChart from "../components/InteractionsGrowthChart";
import FollowersGrowthChart from "../components/FollowersGrowthChart";
import InvitesSection from "../components/InvitesSection";
import PiIcon from "../components/PiIcon";
import eventBus from "../utils/eventBus";

// --- Reusable Components ---

const Card = ({
  children,
  className = "",
  gradient = false,
}: {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
}) => (
  <div
    className={`${
      gradient ? "bg-gradient-to-br from-white to-slate-50" : "bg-white"
    } rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-slate-300 ${className}`}
  >
    {children}
  </div>
);

const StatCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  color = "slate",
  trend,
}: {
  icon: React.ElementType;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  trend?: { value: number; isPositive: boolean };
}) => {
  const colorClasses = {
    slate: "from-slate-500 to-slate-600",
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    amber: "from-amber-500 to-amber-600",
  };

  return (
    <Card className="p-4 hover:scale-[1.02] transition-transform duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`p-2 rounded-xl bg-gradient-to-r ${
                colorClasses[color as keyof typeof colorClasses]
              } text-white shadow-lg`}
            >
              <Icon className="h-4 w-4" />
            </div>
            <p className="text-sm font-medium text-slate-600">{title}</p>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-slate-900">{value}</div>
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
            {trend && (
              <div
                className={`flex items-center gap-1 text-xs ${
                  trend.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                <TrendingUp
                  className={`h-3 w-3 ${!trend.isPositive ? "rotate-180" : ""}`}
                />
                {trend.value}%
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

const TimeSelector = ({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) => (
  <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
    {options.map((option) => (
      <button
        key={option.value}
        onClick={() => onChange(option.value)}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
          value === option.value
            ? "bg-white text-slate-900 shadow-sm"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        {option.label}
      </button>
    ))}
  </div>
);

export default function DashboardPage() {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const userGlobalData = useSelector(selectUserGlobalData);
  const dashboardData = useSelector(selectDashboardData);
  const interactionsGrowthData = useSelector(selectInteractionsGrowthData);
  const [loading, setLoading] = useState(dashboardData ? false : true);
  const [error, setError] = useState<string | null>(null);
  const [interval, setInterval] = useState<"7" | "15" | "30" | "365">("7");
  const [automations, setAutomations] = useState<Automation[]>([]);

  const fetchDashboardData = useCallback(async () => {
    if (!userGlobalData?.workspace?.id || !userGlobalData?.user?.uid) return;

    setLoading(true);
    setError(null);
    try {
      const response = await orbitProvider.getDashboardData(
        userGlobalData.workspace.id,
        userGlobalData.user.uid
      );
      dispatch(setDashboardData(response));
    } catch (err) {
      setError("Could not load dashboard data. Please try again later.");
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, [dispatch, userGlobalData]);

  const fetchInteractionsGrowthData = useCallback(async () => {
    if (!userGlobalData?.workspace?.id) return;
    try {
      const response = await orbitProvider.getInteractionsGrowth(
        userGlobalData.workspace.id,
        interval
      );
      dispatch(setInteractionsGrowthData(response));
    } catch (err) {
      console.error("Error fetching interactions growth data:", err);
    }
  }, [dispatch, userGlobalData, interval]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!dashboardData) {
      fetchDashboardData();
    }
  }, [dashboardData, fetchDashboardData]);

  useEffect(() => {
    fetchInteractionsGrowthData();
  }, [fetchInteractionsGrowthData]);

  useEffect(() => {
    if (userGlobalData?.workspace?.id) {
      orbitProvider
        .getAutomations(userGlobalData.workspace.id)
        .then(setAutomations)
        .catch((err) => console.error("Failed to fetch automations:", err));
    }
  }, [userGlobalData?.workspace?.id]);

  useEffect(() => {
    if (
      userGlobalData?.userData?.piBalance !== undefined &&
      userGlobalData.userData.piBalance < 100000
    ) {
      const lastModalShown = localStorage.getItem("lowBalanceModalLastShown");
      const now = new Date().getTime();
      const oneDay = 5 * 60 * 1000;

      if (!lastModalShown || now - parseInt(lastModalShown) > oneDay) {
        eventBus.emit("showLowBalanceModal");
        localStorage.setItem("lowBalanceModalLastShown", now.toString());
      }
    }
  }, [userGlobalData]);

  const dailyPiDeduction = useMemo(() => {
    return (
      automations
        // .filter((a) => a.status === "running" && a.endDate === "infinite")
        .reduce((sum, a) => sum + a.totalCost, 0)
    );
  }, [automations]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-red-50 rounded-full p-4 w-fit mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            {error || "Could not load dashboard data"}
          </h2>
          <p className="text-slate-600">
            There was an error fetching the data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const engagementChartData = [
    { name: "Likes", value: dashboardData.engagementAnalytics.likes },
    { name: "Comments", value: dashboardData.engagementAnalytics.comments },
    { name: "Shares", value: dashboardData.engagementAnalytics.shares },
  ];
  const COLORS = ["#4f46e5", "#7c3aed", "#059669"];

  const timeOptions = [
    { value: "7", label: "7D" },
    { value: "15", label: "15D" },
    { value: "30", label: "30D" },
    { value: "365", label: "1Y" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-slate-600 mt-1">
              Welcome back, {userGlobalData?.userData?.username || "User"}
            </p>
          </div>
          <button
            onClick={() => navigate("/create")}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            Create Post
          </button>
        </div>
        {/* Automation Card */}
        <Card className="mb-8 bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-gray-200 p-6 sm:p-8 hover:shadow-xl hover:border-blue-300 transition-all duration-300">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-md">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Automations
                </h2>
              </div>
              <p className="text-gray-600 text-sm sm:text-base max-w-lg mb-6">
                Fully autonomous social managers that create and post content
                for you 24/7.
              </p>
              <div className="flex items-center space-x-8 text-sm">
                <div>
                  <p className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {automations.length}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Total Automations
                  </p>
                </div>
                <div className="h-12 w-px bg-gray-300"></div>
                <div>
                  <p className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {automations.filter((a) => a.status === "running").length}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Currently Running
                  </p>
                </div>
                <div className="h-12 w-px bg-gray-300"></div>
                <div>
                  <span className="flex items-center">
                    <p className="font-black text-2xl bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 bg-clip-text text-transparent">
                      {dailyPiDeduction.toFixed(2)}
                    </p>
                    <PiIcon size="w-5 h-5 inline-block ml-1" />
                  </span>
                  <p className="text-gray-500 text-xs mt-1">
                    Pi deducted today
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("/automation")}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 w-full md:w-auto"
            >
              Manage Automations
            </button>
          </div>
        </Card>
        {/* Invites Section */}
        <div className="mb-8">
          <InvitesSection />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Briefcase}
            title="Workspaces"
            value={dashboardData.workspacesCount}
            color="blue"
          />
          <StatCard
            icon={Users}
            title="Connected Accounts"
            value={dashboardData.accountsCount}
            color="green"
          />
          <StatCard
            icon={MessageSquare}
            title="Total Posts"
            value={dashboardData.totalPosts}
            color="purple"
          />
          <StatCard
            icon={CheckCircle}
            title="Posts Today"
            value={dashboardData.todayPostsCount}
            color={dashboardData.todayPostsCount === 0 ? "amber" : "green"}
          />
        </div>

        {/* No Posts Today Alert */}
        {dashboardData.todayPostsCount === 0 &&
          dashboardData.noPostTodayAccounts.length > 0 && (
            <Card className="mb-8 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 rounded-xl p-2 flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-2">
                      You haven't posted today!
                    </h3>
                    <p className="text-slate-600 mb-4 text-sm">
                      Keep your audience engaged by posting on these accounts:
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {dashboardData.noPostTodayAccounts.map((acc, index) => (
                        <span
                          key={index}
                          className="bg-white rounded-full px-3 py-1 text-sm font-medium text-slate-700 border border-slate-200"
                        >
                          <span className="font-semibold">{acc.username}</span>
                          <span className="text-slate-500 ml-1">
                            ({acc.platform})
                          </span>
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => navigate("/create")}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:shadow-lg font-medium text-sm transition-all duration-200 hover:scale-105"
                    >
                      Create Post Now
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          )}

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Engagement Analytics */}
          <Card gradient className="lg:col-span-1">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-xl text-white">
                  <BarChart2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Engagement</h3>
                  <p className="text-xs text-slate-600">Overall distribution</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={engagementChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {engagementChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <p className="text-xs text-slate-500 text-center mt-2">
                Last updated:{" "}
                {dashboardData.lastFetchedDate
                  ? new Date(dashboardData.lastFetchedDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </Card>

          {/* Interactions Growth Chart */}
          <Card gradient className="lg:col-span-2">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-xl text-white">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Growth Trends
                    </h3>
                    <p className="text-xs text-slate-600">
                      Interactions over time
                    </p>
                  </div>
                </div>
                <TimeSelector
                  value={interval}
                  onChange={(value) =>
                    setInterval(value as "7" | "15" | "30" | "365")
                  }
                  options={timeOptions}
                />
              </div>
              <InteractionsGrowthChart data={interactionsGrowthData || []} />
            </div>
          </Card>
          <FollowersGrowthChart />
        </div>

        {/* Connected Platforms */}
        <Card gradient className="mb-8">
          <div className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">
              Connected Platforms
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Object.entries(dashboardData.connectedPlatforms).map(
                ([platformName, platformData]) => (
                  <div
                    key={platformName}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 hover:shadow-md transition-all duration-200 hover:border-slate-200"
                  >
                    <div
                      className="h-10 w-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg"
                      style={{ backgroundColor: platformData.color }}
                    >
                      {platformData.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 capitalize truncate">
                        {platformName}
                      </p>
                      <p className="text-sm text-slate-500">
                        {platformData.count} account
                        {platformData.count !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </Card>

        {/* All Posts Section */}
        <AllPosts />
      </div>
    </div>
  );
}
