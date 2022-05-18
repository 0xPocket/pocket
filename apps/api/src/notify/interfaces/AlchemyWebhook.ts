export type WebhookType =
  | 'MINED_TRANSACTION'
  | 'DROPPED_TRANSACTION'
  | 'ADDRESS_ACTIVITY';

export interface AlchemyWebhookCommon {
  webhookId: string;
  id: string;
  createdAt: Date;
  type: WebhookType;
  event: object;
}

export interface AddressActivityEvent {
  network: 'MATIC_MAINNET' | 'ETH_MAINNET';
  activity: {
    fromAddress: string;
    toAddress?: string;
    blockNum: string;
    hash: string;
    category: 'external' | 'internal' | 'token';
    value: number;
    asset?: 'ETH' | 'MATIC';
    erc721TokenId?: string;
    rawContract?: {
      rawValue?: string;
      address?: string;
      decimal?: string;
    };
    log: unknown;
  }[];
}

export interface AlchemyAddressActivity extends AlchemyWebhookCommon {
  type: 'ADDRESS_ACTIVITY';
  event: AddressActivityEvent;
}
