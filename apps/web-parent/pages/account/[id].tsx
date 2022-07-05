import { UserChild } from '@lib/types/interfaces';
import { useQuery } from 'react-query';
import { useAxios } from '../../hooks/axios.hook';
import MainWrapper from '../../components/wrappers/MainWrapper';
import { SectionContainer } from '@lib/ui';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import ChildSettingsForm from '../../components/forms/ChildSettingsForm';
import AddfundsForm from '../../components/forms/AddfundsForm';
import { useSmartContract } from '../../contexts/contract';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

function totalAmountUsd(data: covalentRet) {
  let tot = 0;
  data.items.forEach((token) => {
    if (token.contract_name.slice(-2) !== 'io') tot += token.quote;
  });
  return tot;
}

function ParseData(token) {
  if (token.token.quote !== 0 && token.token.contract_name.slice(-2) !== 'io') {
    return (
      <li>
        {token.token.contract_name} : {token.token.quote}
      </li>
    );
  }
  return null;
}

async function queryTokenInfos() {
  const APIKEY = 'ckey_d68ffbaf2bdf47b6b58e84fada7';
  const baseURL = 'https://api.covalenthq.com/v1';
  // TODO : get chainId from mm
  const blockchainChainId = '137';
  // TODO : get addr from obj
  const address = '0xD408c5DdcBf297dcAa745009277007429719E205';

  const url = new URL(
    `${baseURL}/${blockchainChainId}/address/${address}/balances_v2/?key=${APIKEY}`,
  );
  return fetch(url);
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.query.id;

  return {
    props: {
      id: id,
    },
  };
}

function Account({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const axios = useAxios();
  const { contract } = useSmartContract();

  const [data, setData] = useState<covalentRet>();

  const { isLoading, data: child } = useQuery<UserChild>(
    'child',
    () =>
      axios
        .get<UserChild>('http://localhost:3000/api/users/children/' + id)
        .then((res) => {
          return res.data;
        }),
    {
      staleTime: 60 * 1000,
      retry: false,
    },
  );

  useEffect(() => {
    queryTokenInfos().then(async (res) => {
      const result = await res.json();
      setData(result.data as covalentRet);
    });
  }, []);

  const { data: childConfig } = useQuery(
    'config',
    async () => await contract?.childToConfig(child!.web3Account.address),
    {
      enabled: !!child,
    },
  );

  return (
    <MainWrapper authProtected>
      <SectionContainer>
        {isLoading ? (
          <>Loading</>
        ) : child ? (
          <div>
            <div className="mb-8 flex justify-between">
              <div>
                <h1 className="mb-4">{child?.firstName}</h1>
                <h3>{child.email}</h3>
                <p>Status: {child.status}</p>
              </div>
              <div className="flex max-w-md flex-col items-end rounded-md bg-dark-light p-4">
                <span className="max-w-xs rounded-md bg-bright px-2 text-sm text-dark-light">
                  {child.web3Account?.address}
                </span>
                <p>Balance</p>
                <span className=" text-4xl">
                  {childConfig?.[1] &&
                    ethers.utils.formatUnits(childConfig?.[1], 6).toString()}
                  $
                </span>
                <span>usdc</span>
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <AddfundsForm child={child} />
              <ChildSettingsForm child={child} config={childConfig} />
            </div>
            <div>
              <h2 className="mt-16  p-4">Overview</h2>
              <div className="grid  grid-cols-2 gap-8">
                <div className="h-60 bg-dark p-4 text-bright">
                  Wallet Content
                  {!data ? (
                    <> Loading</>
                  ) : (
                    <p>
                      {data!.items.map((token) => (
                        <ParseData token={token} />
                      ))}
                      Total in USD : {totalAmountUsd(data!)}
                    </p>
                  )}
                </div>
                <div className="h-60 bg-dark p-4 text-bright">History</div>
              </div>
            </div>
          </div>
        ) : (
          <div>User not found</div>
        )}
      </SectionContainer>
    </MainWrapper>
  );
}

export default Account;

interface covalentRet {
  address: string;
  updated_at: string;
  next_update_at: string;
  quote_currency: string;
  chain_id: number;
  items: covalentItem[];
}

interface covalentItem {
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
