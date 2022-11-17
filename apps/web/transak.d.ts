type TransakSDKOptions = {
  apiKey: string;
  environment: 'PRODUCTION' | 'STAGING';
  widgetHeight: string;
  widgetWidth: string;
  fiatAmount?: number;
  defaultPaymentMethod?: string;
  defaultCryptoAmount?: number;
  disableWalletAddressForm?: boolean;
  cryptoCurrencyCode?: string;
  network: 'ethereum' | 'polygon';
  walletAddress?: string;
  themeColor: string;
  fiatCurrency: string;
  email?: string;
  redirectURL?: string;
};

const TransakEvents = {
  TRANSAK_WIDGET_INITIALISED: 'TRANSAK_WIDGET_INITIALISED',
  TRANSAK_WIDGET_OPEN: 'TRANSAK_WIDGET_OPEN',
  TRANSAK_WIDGET_CLOSE_REQUEST: 'TRANSAK_WIDGET_CLOSE_REQUEST',
  TRANSAK_WIDGET_CLOSE: 'TRANSAK_WIDGET_CLOSE',
  TRANSAK_ORDER_CANCELLED: 'TRANSAK_ORDER_CANCELLED',
  TRANSAK_ORDER_FAILED: 'TRANSAK_ORDER_FAILED',
  TRANSAK_ORDER_CREATED: 'TRANSAK_ORDER_CREATED',
  TRANSAK_ORDER_SUCCESSFUL: 'TRANSAK_ORDER_SUCCESSFUL',
} as const;

type AType<T, U> = T extends U ? (U extends T ? T : [T, U]) : [T, U];

type TransakEvents = typeof TransakEvents[keyof typeof TransakEvents];

type TransakEventData = {
  TRANSAK_ORDER_SUCCESSFUL: {
    eventName: 'TRANSAK_ORDER_SUCCESSFUL';
    status: {
      id: string;
      status: 'PROCESSING' | 'COMPLETED';
    };
  };
};

declare module '@transak/transak-sdk' {
  export default class TransakSDK {
    EVENTS: typeof TransakEvents;

    constructor(options: TransakSDKOptions);
    on(event: TransakEvents, callback: () => void): void;
    on(
      event: 'TRANSAK_ORDER_SUCCESSFUL',
      callback: (data: TransakEventData['TRANSAK_ORDER_SUCCESSFUL']) => void,
    ): void;
    init(): void;
    modal(): void;
    close(): void;
    closeRequest(): void;
  }
}
