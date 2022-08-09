export interface OneInchReturn {
  tokens: tokenId[];
}

export interface tokenId {
  address: string;
  decimals: number;
  logoURI: string;
  name: string;
  symbol: string;
  tags: string[];
}
