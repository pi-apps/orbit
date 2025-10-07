import orbitProvider from "../backend/OrbitProvider";
import { SupportedPlatforms } from "../types";

export const getSocialOauthUrl = async (
  platform: SupportedPlatforms,
  userId: string
): Promise<string> => {
  if (!userId) {
    throw new Error("User not authenticated.");
  }

  switch (platform) {
    case "Twitter":
      return await orbitProvider.getTwitterOauthUrl(userId);
    case "Reddit":
      return await orbitProvider.getRedditOauthUrl(userId);
    case "Threads":
      return await orbitProvider.getThreadsOauthUrl(userId);
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
};
