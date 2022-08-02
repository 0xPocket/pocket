import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CovalentReturn, UserChild } from '@lib/types/interfaces';
import axios from 'axios';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import TokenTable from './TokenTable';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import PieChartComp from './PieChart';

type TokenContentProps = {
  child: UserChild;
};

const fetchUsers = async (address: string) => {
  const APIKEY = 'ckey_d68ffbaf2bdf47b6b58e84fada7';
  const baseURL = 'https://api.covalenthq.com/v1';
  const blockchainChainId = '137';
  const res = axios.get<CovalentReturn>(
    `${baseURL}/${blockchainChainId}/address/${address}/balances_v2/?key=${APIKEY}`,
  );
  return res.then((res) => res.data.data);
};

function TokenContent({ child }: TokenContentProps) {
  const { isLoading, data } = useQuery(
    ['child.token-content', child.id],
    () => fetchUsers(child.address),
    {
      enabled: !!child,
      staleTime: 60 * 1000,
      onError: () => toast.error("Could not retrieve user's token"),
    },
  );

  return (
    <div className="space-y-8">
      <h2>Token Balance</h2>
      <div className="container-classic grid grid-cols-12 rounded-lg px-8 ">
        <div className="col-span-4 aspect-square">
          {!isLoading && data?.items ? (
            <PieChartComp tokenList={data.items} />
          ) : (
            <FontAwesomeIcon icon={faSpinner} spin />
          )}
        </div>
        <div className="col-span-8 flex items-start">
          {!isLoading && data?.items ? (
            <TokenTable tokenList={data.items} />
          ) : (
            <FontAwesomeIcon icon={faSpinner} spin />
          )}
        </div>
      </div>
    </div>
  );
}

export default TokenContent;
