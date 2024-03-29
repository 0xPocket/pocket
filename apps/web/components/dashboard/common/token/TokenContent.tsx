import { CovalentReturn } from '@lib/types/interfaces';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import TokenTable from './TokenTable';
import PieChartComp from './PieChart';
import { env } from 'config/env/client';
import { trpc } from '../../../../utils/trpc';
import TokenReportPopup from './TokenReportPopup';
import FormattedMessage from '../../../common/FormattedMessage';
import { BigNumber, ethers } from 'ethers';
import { Spinner } from '../../../common/Spinner';
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
  const { data: blacklist, isSuccess } = trpc.token.blacklist.useQuery();

  const { isLoading, data } = useQuery(
    ['child.token-content', childAddress],
    () => fetchUserTokens(childAddress),
    {
      staleTime: 60 * 1000,
      onError: () =>
        toast.error(<FormattedMessage id="dashboard.common.token.fail" />),
      enabled: isSuccess,
      select: (data) => {
        return {
          ...data,
          items:
            data.items.filter((token) => {
              return (
                BigNumber.from(token.balance).gt(
                  ethers.utils.parseUnits('1', 6),
                ) &&
                !blacklist?.find(
                  (el) =>
                    el.address.toLowerCase() ===
                    token.contract_address.toLowerCase(),
                )
              );
            }) || undefined,
        };
      },
    },
  );

  return (
    <div className="space-y-8">
      <h2>
        <FormattedMessage id="dashboard.common.token.balance" />
      </h2>
      <div className="container-classic flex flex-col rounded-lg p-8">
        {isLoading && <Spinner />}
        {!isLoading && data?.items && data?.items.length === 0 && (
          <p className="my-8 w-full text-center text-xl">
            <FormattedMessage id="dashboard.common.token.empty" />
          </p>
        )}
        {data?.items && data?.items.length > 0 && (
          <>
            <div className="relative flex w-full flex-col md:flex-row">
              <div className="aspect-square md:w-1/5">
                <PieChartComp tokenList={data.items} />
              </div>
              <div className="flex min-h-[300px] items-start overflow-y-auto md:w-4/5">
                <TokenTable tokenList={data.items} />
              </div>
            </div>
            <TokenReportPopup items={data.items} />
          </>
        )}
      </div>
    </div>
  );
}

export default TokenContent;
