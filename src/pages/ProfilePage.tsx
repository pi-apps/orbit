import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUserGlobalData, setUserData } from "../store/orbitSlice";
import orbitProvider from "../backend/OrbitProvider";
import { Invite } from "../types";
import {
  FaCopy,
  FaCheck,
  FaWallet,
  FaCrown,
  FaUsers,
  FaUserPlus,
} from "react-icons/fa";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userGlobalData = useSelector(selectUserGlobalData);
  const userData = userGlobalData?.userData;

  const [invites, setInvites] = useState<Invite[]>([]);
  const [loadingInvites, setLoadingInvites] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (userData) {
      fetchInvites();
    }
  }, [userData]);

  const fetchInvites = async () => {
    if (!userData) return;
    setLoadingInvites(true);
    try {
      const userInvites = await orbitProvider.getInvitesForUser(userData.uid);
      setInvites(userInvites);
    } catch (error) {
      console.error("Error fetching invites:", error);
    } finally {
      setLoadingInvites(false);
    }
  };

  const handleAcceptInvite = async (inviteId: string) => {
    if (!userData) return;
    try {
      await orbitProvider.acceptInvite(inviteId, userData.uid);
      fetchInvites(); // Refresh invites list
    } catch (error) {
      console.error("Error accepting invite:", error);
    }
  };

  const handleDeclineInvite = async (inviteId: string) => {
    if (!userData) return;
    try {
      await orbitProvider.declineInvite(inviteId, userData.uid);
      fetchInvites(); // Refresh invites list
    } catch (error) {
      console.error("Error declining invite:", error);
    }
  };

  const handleCopyToClipboard = () => {
    const appUrl = "https://app.orbit.com/invite?ref=" + userData?.username;
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
        {/* Profile Header - Compact Business Style */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 lg:p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="relative">
              <img
                src={userData.avatarUrl || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-16 h-16 lg:w-20 lg:h-20 rounded-full object-cover border-2 border-blue-200"
              />
              {userData.pro?.isSubscribed && (
                <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                  {(FaCrown as any)({ className: "w-3 h-3 text-white" })}
                </div>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-slate-900">
                    {userData.username}
                  </h1>
                  <p className="text-sm text-slate-600">
                    {userData.email?.split("@orbit.com")[0]}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                    <img
                      src="https://cdn.worldvectorlogo.com/logos/pi-network-lvquy.svg"
                      alt="Pi"
                      className="w-3 h-3"
                    />
                    {userData.piBalance?.toFixed(2) || "0.00"} Pi
                  </span>
                  {userData.pro?.isSubscribed && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-700 text-sm font-medium rounded-full">
                      {(FaCrown as any)({ className: "w-3 h-3" })}
                      PRO
                    </span>
                  )}
                </div>
              </div>
              {userData.bio && (
                <p className="text-sm text-slate-600 mt-2 max-w-2xl">
                  {userData.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid - Mobile: Stack, Desktop: Horizontal with wrap */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Primary Actions - Mobile: Full width, Desktop: Spans 8 columns */}
          <div className="lg:col-span-8 space-y-6">
            {/* Quick Actions Row - Mobile: Stack, Desktop: Horizontal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pi Balance Card */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 relative overflow-hidden">
                {/* Background Pi Logo */}
                <div className="absolute top-2 right-2 opacity-5">
                  <img
                    src="https://cdn.worldvectorlogo.com/logos/pi-network-lvquy.svg"
                    alt="Pi Network"
                    className="w-16 h-16"
                  />
                </div>
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <img
                        src="https://cdn.worldvectorlogo.com/logos/pi-network-lvquy.svg"
                        alt="Pi"
                        className="w-4 h-4"
                      />
                      <p className="text-sm font-medium text-slate-600">
                        Pi Balance
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-slate-900">
                        {userData.piBalance?.toFixed(2) || "0.00"}
                      </p>
                      <img
                        src="https://cdn.worldvectorlogo.com/logos/pi-network-lvquy.svg"
                        alt="Pi"
                        className="w-5 h-5"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/wallet")}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 text-sm"
                  >
                    {(FaWallet as any)({ className: "w-4 h-4" })}
                    Add Pi
                  </button>
                </div>
              </div>

              {/* Subscription Status Card */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">
                      Subscription
                    </p>
                    {userData.pro?.isSubscribed ? (
                      <div>
                        <p className="text-lg font-bold text-green-600">
                          PRO Member
                        </p>
                        <p className="text-xs text-slate-500">
                          Until{" "}
                          {new Date(
                            (userData.pro.endDate as any)?.seconds * 1000
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    ) : (
                      <p className="text-lg font-bold text-slate-400">
                        Free Plan
                      </p>
                    )}
                  </div>
                  {!userData.pro?.isSubscribed && (
                    <button
                      onClick={() => navigate("/pro")}
                      className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 text-sm"
                    >
                      {(FaCrown as any)({ className: "w-4 h-4" })}
                      Upgrade
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Team Invitations */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 lg:p-6">
              <div className="flex items-center gap-2 mb-4">
                {(FaUsers as any)({ className: "w-5 h-5 text-slate-600" })}
                <h2 className="text-lg font-semibold text-slate-900">
                  Team Invitations
                </h2>
                {invites.length > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
                    {invites.length}
                  </span>
                )}
              </div>

              {loadingInvites ? (
                <div className="flex items-center gap-3 py-4">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <p className="text-sm text-slate-600">Loading invites...</p>
                </div>
              ) : invites.length > 0 ? (
                <div className="space-y-3">
                  {invites.map((invite) => (
                    <div
                      key={invite.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100"
                    >
                      <div>
                        <p className="font-medium text-slate-900 text-sm">
                          Invite to{" "}
                          <span className="text-blue-600">
                            {invite.workspaceName}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAcceptInvite(invite.id)}
                          className="flex-1 sm:flex-initial bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded-md text-xs transition-all duration-200"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleDeclineInvite(invite.id)}
                          className="flex-1 sm:flex-initial bg-slate-400 hover:bg-slate-500 text-white font-medium py-2 px-3 rounded-md text-xs transition-all duration-200"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  {(FaUsers as any)({
                    className: "w-12 h-12 text-slate-300 mx-auto mb-3",
                  })}
                  <p className="text-slate-500 text-sm">
                    No pending invitations
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Mobile: Full width below, Desktop: 4 columns right */}
          <div className="lg:col-span-4">
            {/* Refer a Friend Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 lg:p-6 relative overflow-hidden">
              {/* Background Pi Logo */}
              <div className="absolute top-2 right-2 opacity-5">
                <img
                  src="https://cdn.worldvectorlogo.com/logos/pi-network-lvquy.svg"
                  alt="Pi Network"
                  className="w-20 h-20"
                />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  {(FaUserPlus as any)({ className: "w-5 h-5 text-slate-600" })}
                  <h2 className="text-lg font-semibold text-slate-900">
                    Refer Friends
                  </h2>
                </div>

                <p className="text-sm text-slate-600 mb-4">
                  Share your referral link to invite friends and earn Pi rewards
                  together.
                </p>

                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={
                        "https://app.orbit.com/invite?ref=" + userData.username
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 pr-12 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleCopyToClipboard}
                      className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                    >
                      {copied
                        ? (FaCheck as any)({
                            className: "w-4 h-4 text-green-500",
                          })
                        : (FaCopy as any)({ className: "w-4 h-4" })}
                    </button>
                  </div>

                  <button
                    onClick={() => navigate("/refer")}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 text-sm"
                  >
                    View Referral Dashboard
                  </button>

                  {/* Pi Rewards Info */}
                  <div className="bg-blue-50 rounded-lg p-3 mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <img
                        src="https://cdn.worldvectorlogo.com/logos/pi-network-lvquy.svg"
                        alt="Pi"
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-semibold text-blue-900">
                        Earn Pi Rewards
                      </span>
                    </div>
                    <p className="text-xs text-blue-800">
                      Get 5 Pi for each successful referral when your friends
                      sign up and complete their first action!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
