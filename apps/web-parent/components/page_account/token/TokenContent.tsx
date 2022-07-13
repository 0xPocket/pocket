import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CovalentReturn, UserChild } from '@lib/types/interfaces';
import axios from 'axios';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import TokenTable from './TokenTable';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

type TokenContentProps = {
  child: UserChild;
};

const fetchUsers = (address: string) => {
  const APIKEY = 'ckey_d68ffbaf2bdf47b6b58e84fada7';
  const baseURL = 'https://api.covalenthq.com/v1';
  const blockchainChainId = '137';
  const res = axios.get<CovalentReturn>(
    `${baseURL}/${blockchainChainId}/address/${address}/balances_v2/?key=${APIKEY}`,
  );
  return res.then((res) => res.data.data);
};

function TokenContent({ child }: TokenContentProps) {
  console.log(child);

  const { isLoading, data: content } = useQuery(
    ['child-token-content', child.id],
    () => fetchUsers(child.web3Account.address),
    {
      enabled: !!child,
      onError: () => toast.error("Could not retrieve user's token"),
    },
  );

  return (
    <div className="space-y-8">
      <h2>Token Balance</h2>
      {!isLoading && content?.items ? (
        <TokenTable tokenList={content.items} />
      ) : (
        <FontAwesomeIcon icon={faSpinner} spin />
      )}
    </div>
  );
}

export default TokenContent;
