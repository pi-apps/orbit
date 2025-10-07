export function createCombinedId(userId: string, withUserId: string): string {
  // Create an array of the user IDs
  const ids = [userId, withUserId];

  // Sort the array to ensure consistent ordering regardless of input order
  ids.sort();

  // Join the sorted IDs with a delimiter to create a single string
  return ids.join("-");
}
