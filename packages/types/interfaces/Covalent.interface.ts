export interface CovalentReturn {
  data: CovalentData;
}
export interface CovalentData {
  address: string;
  updated_at: string;
  next_update_at: string;
  quote_currency: string;
  chain_id: number;
  items: CovalentItem[];
}

export interface CovalentItem {
  contract_decimals: number;
  contract_name: string;
  contract_ticker_symbol: string;
  contract_address: string;
  supports_erc: string[];
  logo_url: string;
  last_transferred_at: string;
  type: string;
  balance: string;
  balance_24h: string;
  quote_rate: number;
  quote_rate_24h: number;
  quote: number;
  quote_24h: number;
  nft_data: string[];
}
