import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CovalentReturn } from '@lib/types/interfaces';
import axios from 'axios';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import TokenTable from './TokenTable';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import PieChartComp from './PieChart';
import { env } from 'config/env/client';
import { trpc } from '../../../../utils/trpc';
// import PieChartComp from './PieChart';

type TokenContentProps = {
  childAddress: string;
};

const fetchUserTokens = async (address: string) => {
  const res = axios.get<CovalentReturn>(
    `https://api.covalenthq.com/v1/${env.CHAIN_ID}/address/${address}/balances_v2/?key=${env.NEXT_PUBLIC_COVALENT_KEY}`,
  );
  return res.then((res) => res.data.data);
};

function TokenContent({ childAddress }: TokenContentProps) {
  const { data: blacklist, isSuccess } = trpc.useQuery(['token.blacklist']);

  const { isLoading, data } = useQuery(
    ['child.token-content', childAddress],
    () => fetchUserTokens(childAddress),
    {
      // enabled: !!child && !!child.address,
      staleTime: 60 * 1000,
      onError: () => toast.error("Could not retrieve user's token"),
      enabled: isSuccess,
      select: (data) => {
        return {
          ...data,
          items:
            data.items.filter((token) => {
              return !blacklist?.find(
                (el) =>
                  el.address.toLowerCase() ===
                  token.contract_address.toLowerCase(),
              );
            }) || undefined,
        };
      },
    },
  );

  return (
    <div className="space-y-8">
      <h2>Token Balance</h2>
      <div className="container-classic flex rounded-lg p-8">
        <div className="col-span-4 aspect-square w-1/5">
          {!isLoading && data?.items ? (
            <PieChartComp tokenList={data.items} />
          ) : (
            <FontAwesomeIcon icon={faSpinner} spin />
          )}
        </div>
        <div className="col-span-8 flex w-4/5 items-start">
          {!isLoading && data?.items ? (
            <TokenTable tokenList={data.items} />
          ) : (
            <FontAwesomeIcon icon={faSpinner} spin className="m-auto" />
          )}
        </div>
      </div>
    </div>
  );
}

export default TokenContent;
