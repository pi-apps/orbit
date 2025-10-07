"use client";

import type React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Users,
  UserPlus,
  Crown,
  Edit3,
  Eye,
  BarChart3,
  Calendar,
  Activity,
  MoreVertical,
  Search,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Globe,
  MessageSquare,
  Heart,
  Send,
  X,
  ShieldCheck,
} from "lucide-react";
import { useSelector } from "react-redux";
import {
  selectCurrentWorkspace,
  selectUserGlobalData,
} from "../store/orbitSlice";
import orbitProvider from "../backend/OrbitProvider";
import { ActivityLog, TeamMember } from "../types";
import { formatDistanceToNow } from "date-fns";
import { DEFAULT_BOT_PLACEHOLDER_IMAGE_URL } from "../utils/constants";

const roleConfig = {
  admin: {
    color: "bg-purple-50 text-purple-700 border-purple-200",
    icon: Crown,
  },
  editor: {
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Edit3,
  },
  viewer: {
    color: "bg-green-50 text-green-700 border-green-200",
    icon: Eye,
  },
  watcher: {
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: ShieldCheck,
  },
  analyst: {
    color: "bg-orange-50 text-orange-700 border-orange-200",
    icon: BarChart3,
  },
};

const TeamsPage: React.FC = () => {
  const userGlobalData = useSelector(selectUserGlobalData);
  const currentWorkspace = useSelector(selectCurrentWorkspace);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showInviteModal, setShowInviteModal] = useState(false);

  const fetchData = useCallback(async () => {
    if (!currentWorkspace) return;
    setLoading(true);
    try {
      const [team, activity] = await Promise.all([
        orbitProvider.getWorkspaceTeam(currentWorkspace.id),
        orbitProvider.getWorkspaceActivity(currentWorkspace.id),
      ]);
      setTeamMembers(team);
      setActivityFeed(activity);
      if (userGlobalData?.userData?.uid) {
        setIsAdmin(currentWorkspace.creatorId === userGlobalData.user.uid);
      }
    } catch (error) {
      console.error("Failed to fetch team data:", error);
    } finally {
      setLoading(false);
    }
  }, [currentWorkspace, userGlobalData?.userData?.uid]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, [fetchData]);

  const filteredMembers = useMemo(() => {
    return teamMembers.filter((member) => {
      const matchesSearch =
        member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole =
        selectedRole === "All" ||
        member.role.toLowerCase() === selectedRole.toLowerCase();
      const matchesStatus =
        selectedStatus === "All" ||
        member.status.toLowerCase() === selectedStatus.toLowerCase();
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [teamMembers, searchTerm, selectedRole, selectedStatus]);

  const teamMetrics = useMemo(() => {
    const activeMembers = teamMembers.filter(
      (m) => m.status === "active"
    ).length;
    const pendingInvites = teamMembers.filter(
      (m) => m.status === "invited"
    ).length;
    return {
      totalMembers: teamMembers.length,
      activeMembers,
      pendingInvites,
      totalPosts: currentWorkspace?.totalPostsCount || 0,
      totalReach: currentWorkspace?.totalFollowersCount || 0,
    };
  }, [teamMembers, currentWorkspace]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "invited":
        return <Clock className="w-4 h-4 text-amber-500" />;
      case "inactive":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatActivityAction = (log: ActivityLog) => {
    switch (log.action) {
      case "create_post":
        return `made a post for ${log.details?.accounts || "various platforms"}`;
      case "invite_user":
        return `invited ${log.details?.invitedUsername} as a ${log.details?.role}`;
      default:
        return log.action.replace(/_/g, " ");
    }
  };

  const InviteModal = () => {
    const [inviteUsername, setInviteUsername] = useState("");
    const [isInviting, setIsInviting] = useState(false);
    const [userExistsStatus, setUserExistsStatus] = useState<
      "idle" | "checking" | "exists" | "not_found"
    >("idle");

    useEffect(() => {
      if (inviteUsername.trim() === "") {
        setUserExistsStatus("idle");
        return;
      }

      setUserExistsStatus("checking");
      const handler = setTimeout(() => {
        orbitProvider
          .getUserByUsername(inviteUsername)
          .then((user) => {
            setUserExistsStatus(user ? "exists" : "not_found");
          })
          .catch(() => {
            setUserExistsStatus("not_found");
          });
      }, 500);

      return () => {
        clearTimeout(handler);
      };
    }, [inviteUsername]);

    const handleInvite = async () => {
      if (
        !currentWorkspace ||
        !userGlobalData?.user?.uid ||
        !inviteUsername ||
        userExistsStatus !== "exists"
      )
        return;

      setIsInviting(true);
      try {
        await orbitProvider.inviteUserToWorkspace(
          currentWorkspace.id,
          inviteUsername,
          userGlobalData.user.uid
        );
        setShowInviteModal(false);
        fetchData(); // Refresh data
      } catch (error) {
        console.error("Failed to invite user:", error);
        alert(`Error: ${(error as Error).message}`);
      } finally {
        setIsInviting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Invite Team Member
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Add a new member by username
              </p>
            </div>
            <button
              onClick={() => setShowInviteModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={inviteUsername}
                  onChange={(e) => setInviteUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  {userExistsStatus === "checking" && (
                    <Activity className="w-4 h-4 text-gray-400 animate-spin" />
                  )}
                  {userExistsStatus === "exists" && (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  )}
                  {userExistsStatus === "not_found" && (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {userExistsStatus === "not_found"
                  ? "This user does not exist."
                  : "Type the exact username of the user you want to invite."}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <input
                type="text"
                value="Watcher"
                disabled
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                Users are invited with the 'Watcher' role. You can change this
                later.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
            <button
              onClick={() => setShowInviteModal(false)}
              className="px-6 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleInvite}
              disabled={isInviting || userExistsStatus !== "exists"}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <Send className="w-4 h-4" />
              {isInviting ? "Sending..." : "Send Invite"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-lg font-medium text-gray-700">
            Loading Team...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-600 rounded-xl">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Team Management
                </h1>
              </div>
              <p className="text-gray-600">
                Manage your team members and track activity
              </p>
            </div>
            {isAdmin && (
              <button
                onClick={() => setShowInviteModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg shadow-blue-600/20"
              >
                <UserPlus className="w-4 h-4" />
                Invite Member
              </button>
            )}
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1">
                  Total Members
                </p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">
                  {teamMetrics.totalMembers}
                </p>
              </div>
              <div className="p-2 lg:p-3 bg-blue-50 rounded-xl">
                <Users className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1">
                  Active Members
                </p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">
                  {teamMetrics.activeMembers}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {teamMetrics.pendingInvites} pending
                </p>
              </div>
              <div className="p-2 lg:p-3 bg-emerald-50 rounded-xl">
                <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1">
                  Total Posts
                </p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">
                  {teamMetrics.totalPosts}
                </p>
              </div>
              <div className="p-2 lg:p-3 bg-purple-50 rounded-xl">
                <MessageSquare className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1">
                  Followers
                </p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">
                  {teamMetrics.totalReach.toLocaleString()}
                </p>
              </div>
              <div className="p-2 lg:p-3 bg-orange-50 rounded-xl">
                <Heart className="w-4 h-4 lg:w-5 lg:h-5 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Team Members */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              {/* Filters */}
              <div className="p-4 lg:p-6 border-b border-gray-100">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Team Members ({filteredMembers.length})
                  </h2>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search members..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="All">All Roles</option>
                    {Object.keys(roleConfig).map((role) => (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="All">All Status</option>
                    <option value="active">Active</option>
                    <option value="invited">Invited</option>
                  </select>
                </div>
              </div>

              {/* Members List */}
              <div className="p-4 lg:p-6">
                {/* Mobile List View */}
                <div className="block lg:hidden space-y-3">
                  {filteredMembers.map((member) => {
                    const config =
                      roleConfig[
                        member.role.toLowerCase() as keyof typeof roleConfig
                      ];
                    const RoleIcon = config?.icon || Eye;
                    return (
                      <div
                        key={member.uid}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              member.avatarUrl ||
                              DEFAULT_BOT_PLACEHOLDER_IMAGE_URL
                            }
                            alt={member.username}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm">
                              {member.username}
                            </h3>
                            <p className="text-xs text-gray-600">
                              {member.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config?.color || "bg-gray-100 text-gray-800"}`}
                          >
                            <RoleIcon className="w-3 h-3" />
                            {member.role}
                          </span>
                          {getStatusIcon(member.status)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop Cards View */}
                <div className="hidden lg:flex flex-wrap gap-4">
                  {filteredMembers.map((member) => {
                    const config =
                      roleConfig[
                        member.role.toLowerCase() as keyof typeof roleConfig
                      ];
                    const RoleIcon = config?.icon || Eye;
                    return (
                      <div
                        key={member.uid}
                        className="bg-gray-50 rounded-xl p-5 hover:shadow-md transition-all duration-200 flex-shrink-0 w-80"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={member.avatarUrl || "/placeholder.svg"}
                              alt={member.username}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {member.username}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {member.email}
                              </p>
                            </div>
                          </div>
                          {getStatusIcon(member.status)}
                        </div>

                        <div className="flex items-center justify-between">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium border ${config?.color || "bg-gray-100 text-gray-800"}`}
                          >
                            <RoleIcon className="w-3 h-3" />
                            {member.role}
                          </span>
                          <span className="text-sm text-gray-600 capitalize">
                            {member.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredMembers.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No team members found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-4 lg:p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Recent Activity
                </h2>
              </div>

              <div className="p-4 lg:p-6">
                <div className="space-y-4">
                  {activityFeed.slice(0, 8).map((log) => (
                    <div key={log.id} className="flex gap-3">
                      <div className="flex-shrink-0">
                        <img
                          src={log.user.avatarUrl || "/placeholder.svg"}
                          alt={log.user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{log.user.name}</span>{" "}
                          {formatActivityAction(log)}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(log.timestamp, {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                  ))}

                  {activityFeed.length === 0 && (
                    <div className="text-center py-8">
                      <Activity className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">
                        No recent activity
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showInviteModal && <InviteModal />}
    </div>
  );
};

export default TeamsPage;
