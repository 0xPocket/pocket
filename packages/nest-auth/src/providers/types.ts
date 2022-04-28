import { NestAuthUser } from "../";

interface CommonProviderOptions {
  type: "oauth" | "credentials";
  id: string;
  name: string;
  params?: {
    [key: string]: string;
  };
}

export interface OAuth2Provider<T = unknown> extends CommonProviderOptions {
  type: "oauth";
  endpoints: {
    authorization: string;
    token: string;
    userInfo: string;
  };
  scope: string[];
  clientId: string;
  secretId?: string;
  redirectUri?: string;
  profile?: (profile: T) => NestAuthUser;
}

export interface CredentialsProvider extends CommonProviderOptions {
  type: "credentials";
  endpoints: {
    token: string;
  };
}

export interface NestOAuth2UserConfig extends Partial<OAuth2Provider> {
  clientId: string;
  secretId: string;
}

export type NestAuthProvider = OAuth2Provider | CredentialsProvider;

export type NestAuthProviders = Array<OAuth2Provider | CredentialsProvider>;
