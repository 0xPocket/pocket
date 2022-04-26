interface CommonProviderOptions {
  type: "oauth" | "credentials";
  id: string;
  name: string;
}

export interface OAuth2Provider extends CommonProviderOptions {
  type: "oauth";
  endpoints: {
    authorization: string;
    token?: string;
    userInfo: string;
  };
  scope: string[];
  clientId: string;
  secretId?: string;
  redirectUri?: string;
}

export interface CredentialsProvider extends CommonProviderOptions {
  type: "credentials";
  endpoints: {
    token: string;
  };
}

export type NestAuthProvider = OAuth2Provider | CredentialsProvider;

export type NestAuthProviders = Array<OAuth2Provider | CredentialsProvider>;
