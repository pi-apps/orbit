export interface SocialAccountData {
  username: string;
  name: string;
  followersCount: number;
  lastTimePosted: number;
  engagementRate: number;
  growth: number;
  profileImage: string;
}

export interface AccountsDashboardData {
  totalFollowers: number;
  avgEngagement: number;
  connectedAccounts: number;
}
export interface Workspace {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  creatorId: string;
  teamList: string[];
  teamListWithRoles: {
    [key: string]: "admin" | "editor" | "viewer" | "watcher";
  };
  invitations?: {
    email: string;
    role: "admin" | "editor" | "viewer" | "watcher";
    invitedBy: string;
    createdAt: number;
  }[];
  createdAt: number;
  connectedAccountsCount: number;
  totalFollowersCount: number;
  totalPostsCount: number;
  engagementRate: number;
  instagramAccounts: AccountData[];
  facebookAccounts: AccountData[];
  twitterAccounts: AccountData[];
  redditAccounts: AccountData[];
  threadsAccounts: AccountData[];
  blueskyAccounts?: AccountData[];
  dashboardData?: AccountsDashboardData;
}
export interface AccountData {
  accessSecret: string;
  accessToken: string;
  id: string;
  username: string;
  followersCount: number;
}
export type SupportedPlatforms =
  | "Facebook"
  | "Twitter"
  | "Reddit"
  | "Threads"
  | "Instagram"
  | "Linkedin"
  | "Youtube"
  | "Bluesky";

export interface PostData {
  platformPostUrl: string | null;
  platformProfileData: {
    username: string;
    profilePicture: string;
  };
  id: string;
  text: string;
  authorId?: string;
  createdAt?: string;
  platformPostId: string | null;
  accountId: string;
  platformId: SupportedPlatforms;
  isScheduled?: boolean;

  publicMetrics?: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  images?: string[];
  scheduled?: boolean;
  scheduleDate?: number;
  scheduledPostPosted?: boolean;
}

export interface AnalyticsDashboardData {
  overview: {
    totalReach: number;
    totalEngagement: number;
    totalPosts: number;
    avgEngagementRate: number;
  };
  platformStats: {
    platform: string;
    icon?: any; // Consider using a more specific type if you have one for icons
    followers: number;
    reach: number;
    impressions: number;
    engagement: number;
    avgEngagementRate: number;
    posts: number;
    color: string;
    storyViews?: number;
    storyCompletionRate?: number;
    saves?: number;
    comments?: number;
    retweets?: number;
    replies?: number;
    likes?: number;
    newFollowers?: number;
    shares?: number;
  }[];
}
export interface DashboardData {
  workspacesCount: number;
  accountsCount: number;
  totalPosts: number;
  todayPostsCount: number;
  noPostTodayAccounts: {
    username: string;
    platform: string;
  }[];
  engagementAnalytics: {
    likes: number;
    comments: number;
    shares: number;
  };
  lastFetchedDate: string | null;
  connectedPlatforms: {
    [key: string]: {
      count: number;
      icon: string;
      color: string;
    };
  };
}

export interface PostContent {
  [key: string]: string;
}

export interface Draft {
  id: string;
  workspaceId: string;
  userId: string;
  content: PostContent;
  selectedAccounts: { accountId: string; platformId: string }[];
  createdAt: number;
  lastEdited: number;
}

export interface ScheduledPost {
  id: string;
  workspaceId: string;
  userId: string;
  content: PostContent;
  selectedAccounts: { accountId: string; platformId: string }[];
  scheduledTime: number; // Unix timestamp
  createdAt: number;
}

export interface UserData {
  bio?: string;
  avatarUrl?: string;
  backImageUrl?: string;
  uid: string;
  username: string;
  email: string;
  createdAt: number;
  piBalance: number;
  activeWorkspaceId?: string;
  pro?: {
    isSubscribed: boolean;
    plan: "monthly" | "yearly";
    amount: number;
    subscribedAt: Date;
    endDate: Date;
  };
}

export interface DraftCompleteData extends Draft {
  user: UserData;
}

export interface ScheduledPostCompleteData extends ScheduledPost {
  user: UserData;
}

export interface Template {
  id: string;
  userId: string;
  name: string;
  description: string;
  defaultText: string;
  mediaUrls?: string[];
  platformOverrides?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    reddit?: string;
  };
  placeholders?: string[];
  createdAt: number;
  updatedAt: number;
}

export interface ActivityLog {
  id: string;
  workspaceId: string;
  userId: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  action: string;
  details?: {
    [key: string]: any;
  };
  timestamp: number;
}

export interface TeamMember extends UserData {
  role: "admin" | "editor" | "viewer" | "watcher";
  status: "active" | "invited";
}

export interface Invite {
  id: string;
  workspaceId: string;
  workspaceName: string;
  inviterId: string;
  inviteeId: string;
  status: "pending" | "accepted" | "declined";
  createdAt: number;
}

export interface Automation {
  pauseReason?: any;
  id: string;
  userId: string;
  workspaceId: string;
  name: string;
  description: string;
  goal: string;
  contentType: "text" | "image" | "text-image";
  brandRefImages?: string[];
  selectedAccounts: { accountId: string; platformId: string }[];
  frequency:
    | "hourly"
    | "5-hours"
    | "10-hours"
    | "15-hours"
    | "daily"
    | "weekly";
  aiBoost: {
    internetBrowsing: boolean;
  };
  duplicateControl: 0 | 10 | 20 | 100;
  model: "basic" | "premium";
  endDate: "infinite" | number; // "infinite" or a timestamp
  status: "running" | "paused" | "completed" | "stopped";
  createdAt: number;
  lastRun?: number;
  totalCost: number;
}
