type TransakSDKOptions = {
  apiKey: string;
  environment: environments;
  cryptoCurrencyCode?: string;
  fiatCurrencyCode?: string;
  themeColor?: string;
  defaultCryptoCurrency?: string;
  defaultFiatCurrency?: string;
  walletAddress?: string;
  fiatAmount?: number;
  defaultFiatAmount?: number;
  defaultCryptoAmount?: number;
  fiatCurrency?: string;
  countryCode?: string;
  paymentMethod?: string;
  defaultPaymentMethod?: string;
  isAutoFillUserData?: boolean;
  isFeeCalculationHidden?: boolean;
  email?: string;
  disablePaymentMethods?: string;
  partnerOrderId?: string;
  partnerCustomerId?: string;
  exchangeScreenTitle?: string;
  hideMenu?: boolean;
  accessToken?: string;
  hideExchangeScreen?: boolean;
  isDisableCrypto?: boolean;
  redirectURL?: string;
  disableWalletAddressForm?: boolean;
  defaultNetwork?: string;
  network?: string;
  widgetWidth?: string | number;
  widgetHeight?: string | number;
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
