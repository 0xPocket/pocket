import type { OAuthProvider } from '@magic-ext/oauth';
import type { MagicSDKAdditionalConfiguration } from '@magic-sdk/provider';
import { normalizeChainId } from '@wagmi/core';
import { type Signer, providers } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import { Magic } from 'magic-sdk';
import { type Chain, Connector, UserRejectedRequestError } from 'wagmi';

const IS_SERVER = typeof window === 'undefined';

interface Options {
  apiKey: string;
  oauthOptions?: {
    providers: OAuthProvider[];
    callbackUrl?: string;
  };
  additionalMagicOptions?: MagicSDKAdditionalConfiguration<string>;
}

export class MagicConnector extends Connector {
  ready = !IS_SERVER;

  readonly id = 'magic';

  readonly name = 'Email';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  provider?: any;

  magicSDK: Magic | undefined;

  magicOptions: Options;

  oauthProviders: OAuthProvider[];

  oauthCallbackUrl: string | undefined;

  account: string | undefined;

  constructor(config: { chains?: Chain[] | undefined; options: Options }) {
    super(config);
    this.magicOptions = config.options;
    this.oauthProviders = config.options.oauthOptions?.providers || [];
    this.oauthCallbackUrl = config.options.oauthOptions?.callbackUrl;
  }

  async connect() {
    try {
      const provider = await this.getProvider();

      if (provider.on) {
        provider.on('accountsChanged', this.onAccountsChanged);
        provider.on('chainChanged', this.onChainChanged);
        provider.on('disconnect', this.onDisconnect);
      }

      console.log('testt');
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
    if (this.account) {
      return this.account;
    }

    const signer = await this.getSigner();
    const account = await signer.getAddress();

    if (!this.account) {
      this.account = account;
    }

    return this.account;
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
    const provider = new providers.Web3Provider(await this.getProvider());
    return provider.getSigner();
  }

  async isAuthorized() {
    try {
      const account = await this.getAccount();
      return !!account;
    } catch {
      return false;
    }
  }

  getMagicSDK(): Magic {
    if (!this.magicSDK) {
      this.magicSDK = new Magic(this.magicOptions.apiKey, {
        ...this.magicOptions.additionalMagicOptions,
      });
      this.magicSDK.preload();
      return this.magicSDK;
    }
    return this.magicSDK;
  }

  async getChainId(): Promise<number> {
    const networkOptions = this.magicOptions.additionalMagicOptions?.network;
    if (typeof networkOptions === 'object') {
      const chainID = networkOptions.chainId;
      if (chainID) {
        return normalizeChainId(chainID);
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
    this.account = undefined;
    await magic.user.logout();
  }
}
