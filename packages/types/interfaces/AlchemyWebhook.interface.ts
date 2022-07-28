export type WebhookType =
  | "MINED_TRANSACTION"
  | "DROPPED_TRANSACTION"
  | "ADDRESS_ACTIVITY";

export interface AlchemyWebhook {
  webhookId: string;
  id: string;
  createdAt: Date;
  type: WebhookType;
  event: {
    network: "MATIC_MAINNET" | "MATIC_MUMBAI" | "ETH_MAINNET";
    activity: unknown;
  };
}

export interface AddressActivityPayload {
  fromAddress: string;
  toAddress?: string;
  blockNum: string;
  hash: string;
  category: "external" | "internal" | "token";
  value: string;
  asset?: "ETH" | "MATIC";
  erc721TokenId?: string;
  rawContract?: {
    rawValue?: string;
    address?: string;
    decimal?: string;
  };
  log: unknown;
}

export interface AlchemyAddressActivity extends AlchemyWebhook {
  type: "ADDRESS_ACTIVITY";
  event: {
    network: "MATIC_MAINNET" | "MATIC_MUMBAI" | "ETH_MAINNET";
    activity: AddressActivityPayload[];
  };
}
