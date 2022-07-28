import { OAuthExtension, OAuthProvider } from '@magic-ext/oauth';
import {
  InstanceWithExtensions,
  MagicSDKAdditionalConfiguration,
  SDKBase,
} from '@magic-sdk/provider';
import { normalizeChainId } from '@wagmi/core';
import { ethers, Signer } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import { Magic } from 'magic-sdk';
import { Chain, Connector, UserRejectedRequestError } from 'wagmi';

const IS_SERVER = typeof window === 'undefined';

interface Options {
  apiKey: string;
  oauthOptions?: {
    providers: OAuthProvider[];
    callbackUrl?: string;
  };
  additionalMagicOptions?: MagicSDKAdditionalConfiguration<
    string,
    OAuthExtension[]
  >;
}

interface UserDetailsEmail {
  email: string;
  oauthProvider?: OAuthProvider;
}

interface UserDetailsOAuth {
  oauthProvider: OAuthProvider;
  email?: string;
}

type UserDetails = UserDetailsEmail | UserDetailsOAuth;

export class MagicConnector extends Connector {
  ready = !IS_SERVER;

  readonly id = 'magic';

  readonly name = 'Magic';

  provider?: any;

  magicSDK: InstanceWithExtensions<SDKBase, OAuthExtension[]> | undefined;

  magicOptions: Options;

  userDetails: UserDetails | undefined;

  oauthProviders: OAuthProvider[];

  oauthCallbackUrl: string | undefined;

  constructor(config: { chains?: Chain[] | undefined; options: Options }) {
    super(config);
    this.magicOptions = config.options;
    this.oauthProviders = config.options.oauthOptions?.providers || [];
    this.oauthCallbackUrl = config.options.oauthOptions?.callbackUrl;
  }

  setUserDetails(details: UserDetails) {
    this.userDetails = details;
  }

  clearUserDetails() {
    this.userDetails = undefined;
  }

  async connect() {
    try {
      const provider = await this.getProvider();

      if (provider.on) {
        provider.on('accountsChanged', this.onAccountsChanged);
        provider.on('chainChanged', this.onChainChanged);
        provider.on('disconnect', this.onDisconnect);
      }

      // Check if there is a user logged in
      const isAuthenticated = await this.isAuthorized();

      // if there is a user logged in, return the user
      if (isAuthenticated) {
        return {
          provider,
          chain: {
            id: await this.getChainId(),
            unsupported: false,
          },
          account: await this.getAccount(),
        };
      }

      console.log('conenctor !');
      if (!this.userDetails) {
        throw new UserRejectedRequestError('Something went wrong');
      }

      const userDetails = { ...this.userDetails };

      console.log(userDetails);
      this.clearUserDetails();

      if (userDetails) {
        const magic = this.getMagicSDK();

        if (userDetails.email) {
          await magic.auth.loginWithMagicLink({
            email: userDetails.email,
          });
        }

        const signer = await this.getSigner();
        const account = await signer.getAddress();

        return {
          account,
          chain: {
            id: 0,
            unsupported: false,
          },
          provider,
        };
      }

      throw new UserRejectedRequestError('Something went wrong');
    } catch (error) {
      console.log(error);
      throw new UserRejectedRequestError('Something went wrong');
    }
  }

  getDidToken() {
    const magic = this.getMagicSDK();
    return magic.user.getIdToken();
  }

  async getAccount(): Promise<string> {
    const provider = new ethers.providers.Web3Provider(
      await this.getProvider(),
    );
    const signer = provider.getSigner();
    const account = await signer.getAddress();
    return account;
  }

  async getProvider() {
    if (this.provider) {
      return this.provider;
    }
    const magic = this.getMagicSDK();
    this.provider = magic.rpcProvider;
    return this.provider;
  }

  async getSigner(): Promise<Signer> {
    const provider = new ethers.providers.Web3Provider(
      await this.getProvider(),
    );
    const signer = await provider.getSigner();
    return signer;
  }

  async isAuthorized() {
    try {
      const account = await this.getAccount();
      return !!account;
    } catch {
      return false;
    }
  }

  getMagicSDK(): InstanceWithExtensions<SDKBase, OAuthExtension[]> {
    if (!this.magicSDK) {
      this.magicSDK = new Magic(this.magicOptions.apiKey, {
        ...this.magicOptions.additionalMagicOptions,
        extensions: [new OAuthExtension()],
      });
      this.magicSDK.preload();
      return this.magicSDK;
    }
    return this.magicSDK;
  }

  async getChainId(): Promise<any> {
    const networkOptions = this.magicOptions.additionalMagicOptions?.network;
    if (typeof networkOptions === 'object') {
      const chainID = networkOptions.chainId;
      if (chainID) {
        return String(normalizeChainId(chainID));
      }
    }
    throw new Error('Chain ID is not defined');
  }

  protected onAccountsChanged(accounts: string[]): void {
    if (accounts.length === 0) this.emit('disconnect');
    else this.emit('change', { account: getAddress(accounts[0]) });
  }

  protected onChainChanged(chainId: string | number): void {
    const id = normalizeChainId(chainId);
    const unsupported = this.isChainUnsupported(id);
    this.emit('change', { chain: { id, unsupported } });
  }

  protected onDisconnect(): void {
    this.emit('disconnect');
  }

  async disconnect(): Promise<void> {
    const magic = this.getMagicSDK();
    await magic.user.logout();
  }
}
