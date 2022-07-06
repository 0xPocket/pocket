import { ColumnDef } from '@tanstack/react-table';
import axios from 'axios';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import TokenTable from './TokenTable';

type TokenContentProps = {};

// function totalAmountUsd(data: covalentRet) {
//   let tot = 0;
//   data.items.forEach((token) => {
//     if (token.contract_name.slice(-2) !== 'io') tot += token.quote;
//   });
//   return tot;
// }

// function ParseData(token) {
//   if (token.token.quote !== 0 && token.token.contract_name.slice(-2) !== 'io') {
//     return (
//       <li>
//         {token.token.contract_name} : {token.token.quote}
//       </li>
//     );
//   }
//   return null;
// }

const fetchUsers = () => {
  const APIKEY = 'ckey_d68ffbaf2bdf47b6b58e84fada7';
  const baseURL = 'https://api.covalenthq.com/v1';
  const blockchainChainId = '137';
  const address = '0xD408c5DdcBf297dcAa745009277007429719E205';
  const res = axios.get(
    `${baseURL}/${blockchainChainId}/address/${address}/balances_v2/?key=${APIKEY}`,
  );
  return res.then((res) => res.data.data);
};

function TokenContent({}: TokenContentProps) {
  // TODO add child id for no request conflicts
  const { isLoading, data: content } = useQuery<covalentRet>(
    'child-token-content',
    fetchUsers,
    {
      onError: () => toast.error("Could not retrieve user's token"),
    },
  );

  return (
    <div>
      {!isLoading && content?.items && <TokenTable tokenList={content.items} />}
    </div>
  );
}

export default TokenContent;

interface covalentRet {
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
  nft_data: string[];
}
