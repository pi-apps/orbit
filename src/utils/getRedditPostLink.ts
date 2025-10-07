export function getRedditPostLink(postId: string): string {
  // Strip the "t3_" prefix if present
  const cleanId = postId.startsWith("t3_") ? postId.slice(3) : postId;
  return `https://www.reddit.com/comments/${cleanId}`;
}