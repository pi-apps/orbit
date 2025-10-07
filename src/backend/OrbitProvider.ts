async function fileOrBlobToBase64(fileOrBlob: File | Blob): Promise<string> {}

class OrbitProvider {
  private _basePath: string;
  private AxiosInstance: any; // Simplified for definition
  private app: FirebaseApp;
  private db: Firestore;
  private auth: Auth;

  constructor() {}

  async signInWithPi(
    demo?: boolean
  ): Promise<UserGlobalData & { isNewUser: boolean }> {}

  async createWorkspace(
    workspaceData: Omit<
      Workspace,
      | "id"
      | "imageUrl"
      | "createdAt"
      | "adminId"
      | "teamList"
      | "teamListWithRoles"
      | "connectedAccountsCount"
      | "totalFollowersCount"
      | "totalPostsCount"
      | "engagementRate"
      | "instagramAccounts"
      | "facebookAccounts"
      | "twitterAccounts"
      | "redditAccounts"
      | "threadsAccounts"
    > & { image: File }
  ): Promise<Workspace> {}

  async updateActiveWorkspace(userId: string, workspaceId: string): Promise<void> {}

  async getWorkspacesForUser(userId: string): Promise<Workspace[]> {}

  static async getTwitterAccountInfos(id: string): Promise<SocialAccountData> {}

  static async getFacebookAccountInfos(id: string): Promise<SocialAccountData> {}

  static async getInstagramAccountInfos(id: string): Promise<SocialAccountData> {}

  static async getRedditAccountInfos(id: string): Promise<SocialAccountData> {}

  static async getThreadsAccountInfos(id: string): Promise<SocialAccountData> {}

  async createTemplate(
    templateData: Omit<
      Template,
      "id" | "createdAt" | "updatedAt" | "mediaUrls"
    > & {
      mediaFiles?: File[];
    }
  ): Promise<Template> {}

  async updateTemplate(
    templateId: string,
    templateData: Partial<Omit<Template, "id" | "createdAt">> & {
      mediaFiles?: File[];
    }
  ): Promise<void> {}

  async getTemplates(
    userId: string,
    lastVisible?: QueryDocumentSnapshot
  ): Promise<{
    templates: Template[];
    lastVisible: QueryDocumentSnapshot | null;
  }> {}

  async getThreadsOauthUrl(userId: string): Promise<string> {}

  async getInteractionsGrowth(
    workspaceId: string,
    interval: "7" | "15" | "30" | "365"
  ): Promise<any> {}

  async getRedditOauthUrl(userId: string): Promise<string> {}

  async getTemplate(templateId: string): Promise<Template | null> {}

  async getTwitterOauthUrl(userId: string): Promise<string> {}

  async postContent(postData: {
    workspaceId: string;
    userId: string;
    accounts: { accountId: string; platformId?: string }[];
    content: { [key: string]: string };
    images: string[];
    reddit: { title: string; subreddit: string } | null;
    scheduledTime?: number;
  }): Promise<any> {}

  async getUserByUsername(username: string): Promise<UserData | null> {}

  async inviteUserToWorkspace(
    workspaceId: string,
    inviteeUsername: string,
    inviterId: string
  ): Promise<void> {}

  async getInvitesForUser(userId: string): Promise<any[]> {}

  async acceptInvite(inviteId: string, userId: string): Promise<void> {}

  async declineInvite(inviteId: string, userId: string): Promise<void> {}

  async getWorkspaceTeam(workspaceId: string): Promise<TeamMember[]> {}

  async logActivity(
    workspaceId: string,
    userId: string,
    action: string,
    details: object = {}
  ): Promise<void> {}

  async getWorkspaceActivity(
    workspaceId: string,
    count: number = 10
  ): Promise<ActivityLog[]> {}

  async getPosts(workspaceId: string, lastVisible?: string): Promise<any> {}

  async getPost(postId: string): Promise<any> {}

  async getDashboardData(workspaceId: string, userId: string): Promise<any> {}

  async getCalendarPosts(
    workspaceId: string,
    startDate: string,
    endDate: string,
    filter: "all" | "posted" | "scheduled" = "posted",
    cursor?: string | null
  ): Promise<any> {}

  async getAnalyticsDashboardData(workspaceId: string): Promise<any> {}

  async getAiTextResponse(prompt: string): Promise<string> {}

  async getHashtagsFromAI(prompt: string): Promise<string[]> {}

  async getImagesFromAI(
    prompt: string,
    numberOfImages: number = 1,
    aspectRatio: "1:1" | "16:9" | "9:16" | "4:3" | "3:4" = "1:1",
    style: string = "Photorealistic"
  ): Promise<File[]> {}

  async getVideosFromAI(
    prompt: string,
    inputImageFile?: File,
    style: string = "Cinematic"
  ): Promise<File[]> {}

  async editImageWithAI(
    originalImageFile: File,
    prompt: string,
    style: string = "Photorealistic"
  ): Promise<File> {}

  async saveDraft(
    draftData: Omit<Draft, "id" | "createdAt" | "lastEdited">
  ): Promise<Draft> {}

  async updateDraft(draftId: string, draftData: Partial<Draft>): Promise<void> {}

  async deleteDraft(draftId: string): Promise<void> {}

  async getUserData(userId: string): Promise<UserData | null> {}

  async updateUserData(userId: string, data: Partial<UserData>): Promise<void> {}

  async deductPi(userId: string, amount: number): Promise<number> {}

  async addPi(userId: string, amount: number): Promise<number> {}

  async getDrafts(
    workspaceId: string,
    lastVisible?: QueryDocumentSnapshot
  ): Promise<{
    drafts: DraftCompleteData[];
    lastVisible: QueryDocumentSnapshot | null;
  }> {}

  async deleteScheduledPost(postId: string): Promise<void> {}

  async getScheduledPosts(
    workspaceId: string,
    lastVisible?: QueryDocumentSnapshot
  ): Promise<{
    posts: ScheduledPostCompleteData[];
    lastVisible: QueryDocumentSnapshot | null;
  }> {}

  async postScheduledPostNow(postId: string): Promise<any> {}

  async subscribeToPro(
    userId: string,
    plan: "monthly" | "yearly",
    amount: number
  ): Promise<void> {}

  async uploadMedia(
    userId: string,
    workspaceId: string,
    file: File
  ): Promise<void> {}

  async getMedia(
    workspaceId: string,
    lastVisible?: QueryDocumentSnapshot | null
  ): Promise<{
    media: any[];
    lastVisible: QueryDocumentSnapshot | null;
  }> {}

  async refreshWorkspaceData(workspaceId: string): Promise<Workspace> {}

  async connectBluesky(
    userId: string,
    workspaceId: string,
    handle: string,
    appPassword: string
  ): Promise<any> {}

  calculateAutomationCost(
    automationData: Omit<
      Automation,
      "id" | "createdAt" | "lastRun" | "status" | "totalCost"
    >
  ): number {}

  async createAutomation(
    automationData: Omit<
      Automation,
      "id" | "createdAt" | "lastRun" | "status" | "totalCost"
    >
  ): Promise<Automation> {}

  async getAutomations(workspaceId: string): Promise<Automation[]> {}

  async getAutomationById(automationId: string): Promise<Automation | null> {}

  async stopAutomation(automationId: string): Promise<void> {}

  async pauseAutomation(automationId: string): Promise<void> {}

  async updateAutomation(
    automationId: string,
    data: Partial<Automation>
  ): Promise<void> {}

  async resumeAutomation(automationId: string, userId: string): Promise<void> {}

  async getPostsByAutomationId(automationId: string): Promise<any[]> {}

  async getAccountsForWorkspace(workspaceId: string): Promise<any[]> {}

  async getNotifications(
    userId: string,
    lastVisible?: QueryDocumentSnapshot | null
  ): Promise<{
    notifications: any[];
    lastVisible: QueryDocumentSnapshot | null;
  }> {}}