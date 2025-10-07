async function getThreadsPostDetails(postId: string, accessToken: string) {}

export const publishPost = async (postData: {
  workspaceId: string;
  userId: string;
  accounts: { accountId: string; platformId: string }[];
  content: { [key: string]: string };
  images: string[];
  reddit: { title: string; subreddit: string } | null;
}) => {};