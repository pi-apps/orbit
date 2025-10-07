import { useState, useEffect } from "react";
import ConnectSocialsModal from "../components/ConnectSocialsModal";
import ConnectBlueskyModal from "../components/ConnectBlueskyModal";
import { getSocialOauthUrl } from "../providers/SocialOauthProvider";
import { SupportedPlatforms, Workspace } from "../types";
import eventBus from "../utils/eventBus";
import {
  Plus,
  Settings,
  TrendingUp,
  TrendingDown,
  Users,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3,
  Zap,
  Search,
  Filter,
  MoreHorizontal,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Facebook,
  MessageCircle, // Using this for TikTok for now
  RefreshCw,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { selectUserGlobalData, updateWorkspaceData } from "../store/orbitSlice";
import { useLocation, useNavigate } from "react-router-dom";
import AccountAnalyticsPanel from "../components/AccountAnalyticsPanel";
import orbitProvider from "../backend/OrbitProvider";
import { AppDispatch } from "../store/store";
import { useNavigateToUrl } from "../utils/navigateToOutsideUrl";

// --- NEW MODAL COMPONENT ---
// This modal appears after the user selects a platform,
// confirming their action before navigating to the external OAuth page.
const AuthenticationConfirmationModal = ({
  isOpen,
  onClose,
  platform,
  onAuthenticate,
}: {
  isOpen: boolean;
  onClose: () => void;
  platform?: SupportedPlatforms;
  onAuthenticate: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm m-4 text-center transform transition-all"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <h2 className="text-xl font-bold text-slate-900">Ready to Connect?</h2>
        <p className="text-slate-600 mt-2 mb-6">
          You will be redirected to{" "}
          <span className="font-semibold text-slate-800">{platform}</span> to
          authorize your account.
        </p>
        <div className="flex justify-center space-x-3">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onAuthenticate}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-bold transition-colors shadow-sm"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
// --- END NEW MODAL COMPONENT ---

const AccountsPage = () => {
  const [selectedAccount, setSelectedAccount] = useState<any | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();
  const userGlobalData = useSelector(selectUserGlobalData);
  const workspaceData = userGlobalData?.workspace;
  const dashboardData = workspaceData?.dashboardData;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (location.state?.refresh && userGlobalData?.workspace?.id) {
      orbitProvider
        .refreshWorkspaceData(userGlobalData.workspace.id)
        .then((workspace) => {
          dispatch(updateWorkspaceData(workspace));
          // Clear the state to prevent re-fetching on subsequent renders
          navigate(location.pathname, { replace: true, state: {} });
        });
    }
  }, [location, userGlobalData?.workspace?.id, dispatch, navigate]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBlueskyModalOpen, setBlueskyModalOpen] = useState(false);
  const navigateToExt = useNavigateToUrl();

  // --- NEW STATE for the authentication confirmation flow ---
  const [authReadyData, setAuthReadyData] = useState<{
    platform: SupportedPlatforms;
    url: string;
  } | null>(null);

  // --- UPDATED handleSelectPlatform function ---
  const handleSelectPlatform = async (platform: SupportedPlatforms) => {
    if (platform === "Bluesky") {
      setIsModalOpen(false);
      setBlueskyModalOpen(true);
    } else {
      try {
        if (!userGlobalData?.userData?.uid) {
          alert("You need to be authenticated to connect an account.");
          navigate("/login");
          return;
        }

        // Fetch the URL from the server
        const url = await getSocialOauthUrl(
          platform,
          userGlobalData.userData.uid
        );

        // Close the platform selection modal
        setIsModalOpen(false);
        // Set the data needed for the confirmation modal, which will trigger it to open
        setAuthReadyData({ platform, url });
      } catch (error: any) {
        alert(error?.message || "Failed to get authentication URL.");
        console.error(error);
      }
    }
  };

  const handleConnectBluesky = async (handle: string, appPassword: string) => {
    if (userGlobalData?.user && userGlobalData.workspace) {
      try {
        await orbitProvider.connectBluesky(
          userGlobalData.user.uid,
          userGlobalData.workspace.id,
          handle,
          appPassword
        );
        setBlueskyModalOpen(false);
        window.location.reload();
      } catch (error) {
        console.error("Failed to connect Bluesky:", error);
        throw error;
      }
    }
  };

  const handleReauthenticate = async (platform: SupportedPlatforms) => {
    try {
      if (!userGlobalData?.userData?.uid) {
        alert("you need to auth !!");
        navigate("/login");
        return;
      }
      const url = await getSocialOauthUrl(
        platform,
        userGlobalData?.userData?.uid!
      );
      // For re-authentication, we can also use the new modal for consistency,
      // or open directly if context allows. Let's use the new modal.
      setAuthReadyData({ platform, url });
    } catch (error) {
      console.error("Reauthentication failed", error);
    }
  };

  const handlePostClick = (accountId: string) => {
    navigate("/create", { state: { selectedAccountId: accountId } });
  };

  const socialPlatforms = [
    {
      platform: "Threads",
      icon: MessageCircle,
      color: "bg-slate-800",
      accountKey: "threadsAccounts",
    },
    {
      platform: "Bluesky",
      icon: MessageCircle,
      color: "bg-blue-500",
      accountKey: "blueskyAccounts",
    },
    {
      platform: "Twitter",
      icon: Twitter,
      color: "bg-slate-800",
      accountKey: "twitterAccounts",
    },
    {
      platform: "Reddit",
      icon: MessageCircle,
      color: "bg-orange-600",
      accountKey: "redditAccounts",
    },
    {
      platform: "Instagram",
      icon: Instagram,
      color: "bg-gradient-to-br from-purple-600 to-pink-600",
      accountKey: "instagramAccounts",
    },
    {
      platform: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-700",
      accountKey: "linkedinAccounts",
    },
    {
      platform: "TikTok",
      icon: MessageCircle,
      color: "bg-slate-900",
      accountKey: "tiktokAccounts",
    },
    {
      platform: "YouTube",
      icon: Youtube,
      color: "bg-red-600",
      accountKey: "youtubeAccounts",
    },
    {
      platform: "Facebook",
      icon: Facebook,
      color: "bg-blue-800",
      accountKey: "facebookAccounts",
    },
  ];

  const accountsData = socialPlatforms
    .map((platform) => {
      const workspaceAccounts =
        workspaceData?.[platform.accountKey as keyof Workspace];
      if (Array.isArray(workspaceAccounts)) {
        return {
          ...platform,
          accounts: workspaceAccounts.map((acc: any) => ({
            ...acc,
            profileImage:
              acc.profilePicture || "/generic-social-media-profile.png",
            status: acc.needsReauthentication ? "needs-reauth" : "connected",
            workspace: workspaceData?.name || "Unknown",
          })),
        };
      }
      return {
        ...platform,
        accounts: [],
      };
    })
    .filter((p) => p !== null);

  const filteredAccountGroups = accountsData
    .map((platformGroup) => {
      const filtered = platformGroup.accounts.filter((account) => {
        const matchesSearch =
          platformGroup.platform
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          account.username.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
      });
      return { ...platformGroup, accounts: filtered };
    })
    .filter(
      (platformGroup) => platformGroup.accounts.length > 0 || searchTerm === ""
    );

  const AccountCard = ({
    platformGroup,
    onPostClick,
  }: {
    platformGroup: any;
    onPostClick: (accountId: string) => void;
  }) => {
    const IconComponent = platformGroup.icon;

    const SingleAccountRow = ({ account }: { account: any }) => (
      <div className="bg-slate-50/50 rounded-lg p-3 border border-slate-100">
        <div className="mb-4">
          <div className="flex items-start space-x-3">
            <div className="relative flex-shrink-0">
              <img
                src={account.profileImage}
                alt={account.username}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
              />
              <div className="absolute -bottom-1 -right-1">
                {account.status === "connected" ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500 bg-white rounded-full shadow-sm" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500 bg-white rounded-full shadow-sm" />
                )}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-slate-900 text-base truncate">
                {account.username}
              </h4>
              <p className="text-xs text-slate-500 mt-1">{account.workspace}</p>
            </div>
          </div>
        </div>
        {account.status === "needs-reauth" ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
            <p className="text-sm font-medium text-red-800 mb-2">
              Re-authentication needed
            </p>
            <button
              onClick={() =>
                handleReauthenticate(
                  platformGroup.platform as SupportedPlatforms
                )
              }
              className="bg-red-600 text-white py-1.5 px-3 rounded-md text-xs font-semibold hover:bg-red-700 transition-colors flex items-center justify-center space-x-1.5 mx-auto"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Re-authenticate</span>
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="text-center">
                <p className="text-base font-bold text-slate-900">
                  {account.followersCount >= 1000
                    ? `${(account.followersCount / 1000).toFixed(1)}k`
                    : account.followersCount?.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  Followers
                </p>
              </div>
              <div className="text-center">
                <p className="text-base font-bold text-slate-900">
                  {account.engagementRate || 0}%
                </p>
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  Engagement
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  {account.growth > 0 ? (
                    <TrendingUp className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span
                    className={`text-base font-bold ${
                      account.growth > 0 ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {account.growth > 0 ? "+" : ""}
                    {account.growth || 0}%
                  </span>
                </div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  Growth
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-1 mb-3 text-xs text-slate-500">
              <Clock className="w-3 h-3" />
              <span>
                Last post{" "}
                {new Date(account.lastTimePosted * 1000).toLocaleDateString()}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  eventBus.emit("fullscreen:enter");
                  setSelectedAccount(account);
                }}
                className="bg-white border border-slate-200 text-slate-700 py-2 px-2.5 rounded-lg text-xs font-medium hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center space-x-1"
              >
                <BarChart3 className="w-3 h-3" />
                <span>Analytics</span>
              </button>
              <button
                onClick={() => onPostClick(account.id)}
                className="bg-blue-600 text-white py-2 px-2.5 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
              >
                <Send className="w-3 h-3" />
                <span>Post</span>
              </button>
              <button className="bg-white border border-slate-200 text-slate-700 p-2 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center">
                <Settings className="w-3 h-3" />
              </button>
            </div>
          </>
        )}
      </div>
    );

    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300">
        <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 px-4 py-3 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-lg ${platformGroup.color} flex items-center justify-center text-white shadow-md`}
              >
                <IconComponent size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {platformGroup.platform}
                </h3>
                <p className="text-xs text-slate-600">
                  {platformGroup.accounts.length}{" "}
                  {platformGroup.accounts.length === 1 ? "account" : "accounts"}
                </p>
              </div>
            </div>
            <button className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all">
              <MoreHorizontal className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {platformGroup.accounts.length > 0 ? (
            platformGroup.accounts.map((account: any) => (
              <SingleAccountRow key={account.id} account={account} />
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-slate-500 text-sm">No accounts connected.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className=" mx-auto px-2 sm:px-3 lg:px-6">
          <div className="flex items-center justify-between h-12 lg:h-14">
            <div>
              <h1 className="text-lg lg:text-xl font-bold text-slate-900">
                Accounts
              </h1>
              <p className="text-xs text-slate-500">Your Social Command Hub</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-slate-800 text-white px-3 py-1.5 rounded-md font-medium hover:bg-slate-700 transition-colors flex items-center space-x-1.5"
            >
              <Plus className="w-3 h-3" />
              <span className="text-xs lg:text-sm">Connect</span>
            </button>
          </div>
        </div>
      </div>

      <ConnectSocialsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectPlatform={handleSelectPlatform}
      />
      <ConnectBlueskyModal
        isOpen={isBlueskyModalOpen}
        onClose={() => setBlueskyModalOpen(false)}
        onConnect={handleConnectBluesky}
      />

      {/* --- ADD THE NEW MODAL TO THE RENDER OUTPUT --- */}
      <AuthenticationConfirmationModal
        isOpen={!!authReadyData}
        onClose={() => setAuthReadyData(null)}
        platform={authReadyData?.platform}
        onAuthenticate={() => {
          if (authReadyData?.url) {
            navigateToExt(authReadyData.url);
            setAuthReadyData(null); // Close modal after clicking
          }
        }}
      />

      <div className=" mx-auto px-1 py-1 lg:py-1">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-1 lg:gap-2 mb-1 lg:mb-2">
          <div className="bg-white rounded-lg border border-slate-200 p-2 lg:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Connected</p>
                <p className="text-xl lg:text-2xl font-bold text-slate-900">
                  {dashboardData?.connectedAccounts || 0}
                </p>
              </div>
              <div className="bg-emerald-100 p-1.5 lg:p-2 rounded-md">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-2 lg:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Followers</p>
                <p className="text-xl lg:text-2xl font-bold text-slate-900">
                  {dashboardData?.totalFollowers.toLocaleString() || 0}
                </p>
              </div>
              <div className="bg-blue-100 p-1.5 lg:p-2 rounded-md">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-2 lg:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Engagement</p>
                <p className="text-xl lg:text-2xl font-bold text-slate-900">
                  {dashboardData?.avgEngagement?.toFixed(1) || 0}%
                </p>
              </div>
              <div className="bg-purple-100 p-1.5 lg:p-2 rounded-md">
                <Zap className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 lg:mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3 h-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-transparent w-full sm:w-auto"
              />
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md">
              <Filter className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="grid gap-2 lg:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredAccountGroups.map((platformGroup) => (
            <AccountCard
              key={platformGroup.platform}
              platformGroup={platformGroup}
              onPostClick={handlePostClick}
            />
          ))}
        </div>

        {filteredAccountGroups.length === 0 && (
          <div className="text-center py-6 lg:py-10">
            <div className="bg-slate-100 w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-5 h-5 lg:w-6 lg:h-6 text-slate-400" />
            </div>
            <h3 className="text-sm lg:text-base font-medium text-slate-900 mb-1">
              No accounts found
            </h3>
            <p className="text-slate-500 mb-3 text-xs lg:text-sm">
              Try adjusting your filters or connect a new account.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-slate-800 text-white px-3 py-1.5 rounded-md font-medium hover:bg-slate-700 transition-colors text-xs lg:text-sm"
            >
              Connect Account
            </button>
          </div>
        )}
      </div>
      {selectedAccount && (
        <AccountAnalyticsPanel
          account={selectedAccount}
          onClose={() => {
            setSelectedAccount(null);
            eventBus.emit("fullscreen:exit");
          }}
        />
      )}
    </div>
  );
};

export default AccountsPage;
