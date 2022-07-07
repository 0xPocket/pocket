import { CovalentReturn } from '@lib/types/interfaces';
import axios from 'axios';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import TokenTable from './TokenTable';

type TokenContentProps = {};

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
  const { isLoading, data: content } = useQuery<CovalentReturn>(
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
