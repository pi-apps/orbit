export interface TokenData {
  accessToken: string;
  expiresAt: number;
}

export class TokenRefreshError extends Error {
  public accountId: string;
  public platform: string;

  constructor(message: string, platform: string, accountId: string) {
    super(message);
    this.platform = platform;
    this.accountId = accountId;
  }
}

export abstract class TokenManager {
  protected accountId: string | undefined;
  protected platform: string | undefined;

  constructor(accountId: string, platform: string) {}

  async getValidToken(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  protected isTokenExpired(tokenData: TokenData): boolean {    throw new Error('Method not implemented.');
}

  protected async storeToken(tokenData: TokenData): Promise<void> {}

  protected async handleTokenError(): Promise<void> {}

  abstract refreshToken(tokenData: TokenData): Promise<TokenData>;
}

export class TwitterTokenManager extends TokenManager {
  constructor(accountId: string) {
    super(accountId, 'twitter');
  }

  async refreshToken(tokenData: TokenData): Promise<TokenData> {    throw new Error('Method not implemented.');
}
}

export class RedditTokenManager extends TokenManager {
  constructor(accountId: string) {
    super(accountId, 'reddit');
  }

  async refreshToken(tokenData: TokenData): Promise<TokenData> {    throw new Error('Method not implemented.');
}
}

export class ThreadsTokenManager extends TokenManager {
  constructor(accountId: string) {
    super(accountId, 'threads');
  }

  async refreshToken(tokenData: TokenData): Promise<TokenData> {    throw new Error('Method not implemented.');
}
}

export class BlueskyTokenManager extends TokenManager {
  constructor(accountId: string) {
    super(accountId, 'bluesky');
  }

  async refreshToken(tokenData: TokenData): Promise<TokenData> {    throw new Error('Method not implemented.');
}

  protected isTokenExpired(tokenData: TokenData): boolean {    throw new Error('Method not implemented.');
}
}

export const getTokenManager = (
  platform: string,
  accountId: string
): TokenManager => {
  switch (platform) {
    case 'twitter':
      return new TwitterTokenManager(accountId);
    case 'reddit':
      return new RedditTokenManager(accountId);
    case 'threads':
      return new ThreadsTokenManager(accountId);
    case 'bluesky':
      return new BlueskyTokenManager(accountId);
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
};