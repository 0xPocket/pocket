import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import axios from 'axios';
import NftLibrary from './NftLibrary';
import { Network, initializeAlchemy, getNftsForOwner } from '@alch/alchemy-sdk';

// Optional Config object, but defaults to demo api-key and eth-mainnet.

export interface covalentRet {
  address: string;
  updated_at: string;
  next_update_at: string;
  quote_currency: string;
  chain_id: number;
  items: covalentItem[];
}

export interface covalentItem {
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
  nft_data: nft_data[];
}

export interface nft_data {
  burned: string;
  external_data: string;
  original_owner: string;
  owner: string;
  owner_address: string;
  supports_erc: string;
  token_balance: string;
  token_id: string;
  token_price_wei: string;
  token_quote_rate_eth: string;
  token_url: string;
  contract_name: string;
}

type NftContentProps = {};

const fetchList = () => {
  const address = '0xb3E5A0060cb17FEBb7ecC339e4F2C4398D062f59';

  // const URL = 'https://eth-mainnet.alchemyapi.io/nft/v2/';
  // const key = 'NVAPHrqvSpvYDaVqrOICP3ari_vpCdRV/';
  // const method = 'getNFTs';
  // const owner = 'owner=' + address;
  // console.log(`${URL}${key}${method}?${owner}`);
  // const ret = axios.get(`${URL}${key}${method}?${owner}`);

  // ret.then((ret) => {
  //   console.log(ret);
  // });
  const settings = {
    apiKey: 'i25CEzZu6JD-2uH08tSkKRJKzGts26PE', // Replace with your Alchemy API Key.
    network: Network.ETH, // Replace with your network.
    maxRetries: 10,
  };

  const alchemy = initializeAlchemy(settings);

  getNftsForOwner(alchemy, address).then(console.log);
  const APIKEY = 'ckey_d68ffbaf2bdf47b6b58e84fada7';
  const baseURL = 'https://api.covalenthq.com/v1';
  const blockchainChainId = '1';
  const res = axios.get<{ data: covalentRet }>(
    `${baseURL}/${blockchainChainId}/address/${address}/balances_v2/?quote-currency=USD&format=JSON&nft=true&no-nft-fetch=true&key=${APIKEY}`,
  );

  return res.then((res) => {
    return res.data.data;
  });
};

function NftContent({}: NftContentProps) {
  const { isLoading, data: content } = useQuery<covalentRet>(
    'child-token-content',
    fetchList,
    {
      onError: () => toast.error("Could not retrieve user's token"),
    },
  );

  if (!content) {
    return <div>Loading..</div>;
  }

  return (
    <div>
      <p>Nft Library</p>
      <NftLibrary covalentList={content?.items} />
    </div>
  );
}

export default NftContent;
