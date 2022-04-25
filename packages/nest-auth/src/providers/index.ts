export type ProviderType = "oauth" | "credentials";

export interface CommonProviderOptions {
  id: string;
  name: string;
  type: ProviderType;
  options?: Record<string, unknown>;
}

export interface OAuthConfig<P> extends CommonProviderOptions {
  authorization?: string;
  type: "oauth";
  clientId?: string;

  /**
   * The options provided by the user.
   * We will perform a deep-merge of these values
   * with the default configuration.
   */
  options?: OAuthUserConfig<P>;
}

export interface CredentialsConfig {
  id: string;
  name: string;
}

export type OAuthUserConfig<P> = Omit<
  Partial<OAuthConfig<P>>,
  "options" | "type"
> &
  Required<Pick<OAuthConfig<P>, "clientId">>;

export type Provider = OAuthConfig<any>;

export type AppProviders = Array<Provider>;
