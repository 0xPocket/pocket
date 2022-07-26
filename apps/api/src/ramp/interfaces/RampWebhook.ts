export interface PurchaseStatusWebhookEvent {
  type: 'CREATED' | 'RELEASED' | 'RETURNED' | 'ERROR';
  purchase: RampPurchase;
}

interface RampPurchase {
  id: string;
  endTime: string | null; // purchase validity time, ISO date-time string
  asset: AssetInfo; // description of the purchased asset (address, symbol, name, decimals)
  receiverAddress: string; // blockchain address of the buyer
  cryptoAmount: string; // number-string, in wei or token units
  fiatCurrency: string; // three-letter currency code
  fiatValue: number; // total value the user pays for the purchase, in fiatCurrency
  assetExchangeRate: number; // price of 1 whole token of purchased asset, in fiatCurrency
  assetExchangeRateEur: number; // price of 1 whole token of purchased asset, in EUR
  fiatExchangeRateEur: number; // price of fiatCurrency in EUR
  baseRampFee: number; // base Ramp fee before any modifications, in fiatCurrency
  networkFee: number; // network fee for transferring the purchased asset, in fiatCurrency
  appliedFee: number; // final fee the user pays (included in fiatValue), in fiatCurrency
  paymentMethodType: PaymentMethodType; // type of payment method used to pay for the swap - see values below
  finalTxHash?: string; // hash of the crypto transfer blockchain transaction, filled once available
  createdAt: string; // ISO date-time string
  updatedAt: string; // ISO date-time string
  status: PurchaseStatus; // See available values below
  purchaseViewToken: string; // secret API key that can be used to access info about this transaction via our API
}

type PurchaseStatus =
  | 'INITIALIZED'
  | 'PAYMENT_STARTED'
  | 'PAYMENT_IN_PROGRESS'
  | 'PAYMENT_FAILED'
  | 'PAYMENT_EXECUTED'
  | 'FIAT_SENT'
  | 'RELEASING'
  | 'RELEASED'
  | 'EXPIRED'
  | 'CANCELED';

type PaymentMethodType =
  | 'MANUAL_BANK_TRANSFER'
  | 'AUTO_BANK_TRANSFER'
  | 'CARD_PAYMENT'
  | 'APPLE_PAY';

interface AssetInfo {
  address: string | null; // token contract address for token assets, `null` for coins (e.g. ETH, BTC)
  symbol: string; // asset symbol, for example `ETH`, `DAI`, `USDC`
  chain: string; // asset chain, for example `ETH`, `BSC`, `POLKADOT`
  type: string; // NATIVE for native assets (e.g. ETH, BTC, ELROND), or a token standard (e.g. ERC20)
  name: string;
  decimals: number; // token decimals, e.g. 18 for ETH/DAI, 6 for USDC
}
