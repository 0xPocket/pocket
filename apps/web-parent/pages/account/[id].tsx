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
import { SetStateAction, useState } from 'react';

// const settings = {
//   apiKey: 'qcLb8E-5A9d7k9XN6LK7XC-N2Ppaqp9D',
//   network: Network.MATIC_MAINNET,
//   maxRetries: 10,
// };

// async function testMoralis() {
//   // const options = {
//   //   chain: 'polygon',
//   //   address: '0xbD1F4D80c3098A3B1154245F1CD23495ac2125F3',
//   // };
//   await Moralis.start({
//     serverUrl: 'https://y37vqeiurdc8.usemoralis.com:2053/server',
//     appId: '42DLDWUkmuk4aoDrAR5zG6bLnYw3snTPw6KX8B6R',
//     moralisSecret: 'BNEJmi1vramtbx58o8aqqaHtsCc4htxY9vobEOg8',
//   });

//   const balances = await Moralis.Web3API.account.getTokenBalances({
//     chain: 'polygon',
//     address: '0xbD1F4D80c3098A3B1154245F1CD23495ac2125F3',
//   });

//   console.log(balances);
// }

function calculateTotal() {
  let tot = 0;
  tokens.items.forEach((token) => {
    if (token.contract_name.slice(-2) !== 'io') tot += token.quote;
  });
  return tot;
}

function parseRes(token: {
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
  nft_data: null;
}) {
  if (token.quote !== 0 && token.contract_name.slice(-2) !== 'io') {
    return (
      <li>
        {token.contract_name} : {token.quote}
      </li>
    );
  }
}

async function testCovalent(setDone: (arg0: boolean) => void) {
  const APIKEY = 'ckey_d68ffbaf2bdf47b6b58e84fada7';
  const baseURL = 'https://api.covalenthq.com/v1';
  const blockchainChainId = '137';
  const address = '0xbD1F4D80c3098A3B1154245F1CD23495ac2125F3';

  const url = new URL(
    `${baseURL}/${blockchainChainId}/address/${address}/balances_v2/?key=${APIKEY}`,
  );
  const response = await fetch(url);
  const result = await response.json();
  const data = result.data;
  console.log(data);
  setDone(true);
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

  const [done, setDone] = useState(false);

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

  //take off
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  // if (done === false) testCovalent(setDone);
  // else {
  //   console.log('DONE !');
  // }

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
                  <ul>{tokens.items.map((token) => parseRes(token))}</ul>
                  <p>Total in USD : {calculateTotal()}</p>
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

const tokens = {
  address: '0xbd1f4d80c3098a3b1154245f1cd23495ac2125f3',
  updated_at: '2022-07-04T15:19:43.603661480Z',
  next_update_at: '2022-07-04T15:24:43.603661520Z',
  quote_currency: 'USD',
  chain_id: 137,
  items: [
    {
      contract_decimals: 18,
      contract_name: 'Draf.io',
      contract_ticker_symbol: 'Draf.io',
      contract_address: '0xdc8fa3fab8421ff44cc6ca7f966673ff6c0b3b58',
      supports_erc: ['erc20'],
      logo_url:
        'https://logos.covalenthq.com/tokens/137/0xdc8fa3fab8421ff44cc6ca7f966673ff6c0b3b58.png',
      last_transferred_at: '2022-05-09T14:55:52Z',
      type: 'cryptocurrency',
      balance: '288101000000000000000000',
      balance_24h: '288101000000000000000000',
      quote_rate: 0.038423184,
      quote_rate_24h: 0.039738838,
      quote: 11069.758,
      quote_24h: 11448.799,
      nft_data: null,
    },
    {
      contract_decimals: 8,
      contract_name: '(PoS) Wrapped BTC',
      contract_ticker_symbol: 'WBTC',
      contract_address: '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
      supports_erc: ['erc20'],
      logo_url:
        'https://logos.covalenthq.com/tokens/1/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png',
      last_transferred_at: '2022-05-17T21:28:34Z',
      type: 'cryptocurrency',
      balance: '2093175',
      balance_24h: '2093175',
      quote_rate: 19472.797,
      quote_rate_24h: 19250.809,
      quote: 407.5997,
      quote_24h: 402.95312,
      nft_data: null,
    },
    {
      contract_decimals: 18,
      contract_name: 'Wrapped Ether',
      contract_ticker_symbol: 'WETH',
      contract_address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
      supports_erc: ['erc20'],
      logo_url:
        'https://logos.covalenthq.com/tokens/1/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png',
      last_transferred_at: '2022-05-17T21:26:44Z',
      type: 'cryptocurrency',
      balance: '326380006908361110',
      balance_24h: '326380006908361110',
      quote_rate: 1114.296,
      quote_rate_24h: 1072.009,
      quote: 363.68393,
      quote_24h: 349.88232,
      nft_data: null,
    },
    {
      contract_decimals: 18,
      contract_name: 'Matic Token',
      contract_ticker_symbol: 'MATIC',
      contract_address: '0x0000000000000000000000000000000000001010',
      supports_erc: ['erc20'],
      logo_url:
        'https://logos.covalenthq.com/tokens/1/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0.png',
      last_transferred_at: null,
      type: 'cryptocurrency',
      balance: '549996972813344877652',
      balance_24h: '549996972813344877652',
      quote_rate: 0.47761077,
      quote_rate_24h: 0.46012527,
      quote: 262.68448,
      quote_24h: 253.0675,
      nft_data: null,
    },
    {
      contract_decimals: 18,
      contract_name: 'Staked MATIC (PoS)',
      contract_ticker_symbol: 'stMATIC',
      contract_address: '0x3a58a54c066fdc0f2d55fc9c89f0415c92ebf3c4',
      supports_erc: ['erc20'],
      logo_url:
        'https://logos.covalenthq.com/tokens/1/0x9ee91f9f426fa633d227f7a9b000e28b9dfd8599.png',
      last_transferred_at: '2022-06-16T15:02:57Z',
      type: 'cryptocurrency',
      balance: '499175360876559020187',
      balance_24h: '499175360876559020187',
      quote_rate: 0.49453318,
      quote_rate_24h: 0.47650322,
      quote: 246.85878,
      quote_24h: 237.85867,
      nft_data: null,
    },
    {
      contract_decimals: 8,
      contract_name: '0Bets.io',
      contract_ticker_symbol: '0Bets.io',
      contract_address: '0xf31cdb090d1d4b86a7af42b62dc5144be8e42906',
      supports_erc: ['erc20'],
      logo_url:
        'https://logos.covalenthq.com/tokens/137/0xf31cdb090d1d4b86a7af42b62dc5144be8e42906.png',
      last_transferred_at: '2022-05-26T19:37:38Z',
      type: 'cryptocurrency',
      balance: '300000000000000',
      balance_24h: '300000000000000',
      quote_rate: 0.00003485997,
      quote_rate_24h: 0.000036053618,
      quote: 104.57992,
      quote_24h: 108.16085,
      nft_data: null,
    },
    {
      contract_decimals: 18,
      contract_name: 'APWine Token (PoS)',
      contract_ticker_symbol: 'APW',
      contract_address: '0x6c0ab120dbd11ba701aff6748568311668f63fe0',
      supports_erc: ['erc20'],
      logo_url:
        'https://logos.covalenthq.com/tokens/1/0x4104b135dbc9609fc1a9490e61369036497660c8.png',
      last_transferred_at: '2022-06-10T14:42:16Z',
      type: 'cryptocurrency',
      balance: '30263692855834959872',
      balance_24h: '30263692855834959872',
      quote_rate: 0.12423056,
      quote_rate_24h: 0.11800092,
      quote: 3.7596755,
      quote_24h: 3.5711436,
      nft_data: null,
    },
    {
      contract_decimals: 18,
      contract_name: 'Lido DAO Token (PoS)',
      contract_ticker_symbol: 'LDO',
      contract_address: '0xc3c7d422809852031b44ab29eec9f1eff2a58756',
      supports_erc: ['erc20'],
      logo_url:
        'https://logos.covalenthq.com/tokens/1/0x5a98fcbea516cf06857215779fd812ca3bef1b32.png',
      last_transferred_at: '2022-06-08T12:45:44Z',
      type: 'cryptocurrency',
      balance: '828263285030940417',
      balance_24h: '828263285030940417',
      quote_rate: 0.5074739,
      quote_rate_24h: 0.50039583,
      quote: 0.420322,
      quote_24h: 0.4144595,
      nft_data: null,
    },
    {
      contract_decimals: 18,
      contract_name: 'Pikatic',
      contract_ticker_symbol: 'PKT',
      contract_address: '0xfae400bf04f88e47d899cfe7e7c16bf8c8ae919b',
      supports_erc: ['erc20'],
      logo_url:
        'https://logos.covalenthq.com/tokens/137/0xfae400bf04f88e47d899cfe7e7c16bf8c8ae919b.png',
      last_transferred_at: '2022-04-29T16:05:59Z',
      type: 'cryptocurrency',
      balance: '220000000000000000000000',
      balance_24h: '220000000000000000000000',
      quote_rate: 7.8760127e-7,
      quote_rate_24h: 9.626123e-7,
      quote: 0.17327228,
      quote_24h: 0.21177469,
      nft_data: null,
    },
    {
      contract_decimals: 18,
      contract_name: 'PolygonDrops.com',
      contract_ticker_symbol: '$PD',
      contract_address: '0x439a06e69f1302f3f94f265d32ca4511e882b5cd',
      supports_erc: ['erc20'],
      logo_url:
        'https://logos.covalenthq.com/tokens/137/0x439a06e69f1302f3f94f265d32ca4511e882b5cd.png',
      last_transferred_at: '2022-05-28T12:07:06Z',
      type: 'cryptocurrency',
      balance: '3250000000000000000000',
      balance_24h: '3250000000000000000000',
      quote_rate: 0.00003317207,
      quote_rate_24h: 0.00003430792,
      quote: 0.10780922,
      quote_24h: 0.11150074,
      nft_data: null,
    },
    {
      contract_decimals: 18,
      contract_name: 'Wrapped Matic',
      contract_ticker_symbol: 'WMATIC',
      contract_address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
      supports_erc: ['erc20'],
      logo_url:
        'https://logos.covalenthq.com/tokens/137/0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270.png',
      last_transferred_at: '2022-06-08T14:45:15Z',
      type: 'cryptocurrency',
      balance: '60454896930729769',
      balance_24h: '60454896930729769',
      quote_rate: 0.47422627,
      quote_rate_24h: 0.45993257,
      quote: 0.0286693,
      quote_24h: 0.027805176,
      nft_data: null,
    },
    {
      contract_decimals: 18,
      contract_name: 'iFARM (PoS)',
      contract_ticker_symbol: 'iFARM',
      contract_address: '0xab0b2ddb9c7e440fac8e140a89c0dbcbf2d7bbff',
      supports_erc: ['erc20'],
      logo_url:
        'https://logos.covalenthq.com/tokens/1/0x1571ed0bed4d987fe2b498ddbae7dfa19519f651.png',
      last_transferred_at: '2022-06-20T16:42:41Z',
      type: 'cryptocurrency',
      balance: '324262065100872',
      balance_24h: '324262065100872',
      quote_rate: 58.423603,
      quote_rate_24h: 56.6114,
      quote: 0.018944558,
      quote_24h: 0.01835693,
      nft_data: null,
    },
    {
      contract_decimals: 18,
      contract_name: '90D-Beefy-mooCurveATriCrypto3-1',
      contract_ticker_symbol: '90D-Beefy-mooCurveATriCrypto3-1',
      contract_address: '0x1c2bca80c0e9f994448c300a4153ccb8a99bcc9c',
      supports_erc: ['erc20'],
      logo_url:
        'https://logos.covalenthq.com/tokens/137/0x1c2bca80c0e9f994448c300a4153ccb8a99bcc9c.png',
      last_transferred_at: '2022-06-08T14:39:29Z',
      type: 'dust',
      balance: '0',
      balance_24h: '0',
      quote_rate: null,
      quote_rate_24h: null,
      quote: 0,
      quote_24h: null,
      nft_data: null,
    },
    {
      contract_decimals: 18,
      contract_name: 'pbfDMM-LP agEURjEUR-f-agDEN-JUL22',
      contract_ticker_symbol: 'pbfDMM-LP agEURjEUR-f-agDEN-JUL22',
      contract_address: '0x1dfde6e4c9852bb8c593b72631257eac6a827e09',
      supports_erc: ['erc20'],
      logo_url:
        'https://logos.covalenthq.com/tokens/137/0x1dfde6e4c9852bb8c593b72631257eac6a827e09.png',
      last_transferred_at: '2022-06-20T16:51:35Z',
      type: 'cryptocurrency',
      balance: '39852015018227104',
      balance_24h: '39852015018227104',
      quote_rate: null,
      quote_rate_24h: null,
      quote: 0,
      quote_24h: null,
      nft_data: null,
    },
    {
      contract_decimals: 18,
      contract_name: 'Curve.fi Factory Plain Pool: agEUR-jEUR',
      contract_ticker_symbol: 'agEURjEUR-f',
      contract_address: '0x2ffbce9099cbed86984286a54e5932414af4b717',
      supports_erc: ['erc20'],
      logo_url:
        'https://logos.covalenthq.com/tokens/137/0x2ffbce9099cbed86984286a54e5932414af4b717.png',
      last_transferred_at: '2022-06-10T14:42:44Z',
      type: 'dust',
      balance: '0',
      balance_24h: '0',
      quote_rate: null,
      quote_rate_24h: null,
      quote: 0,
      quote_24h: null,
      nft_data: null,
    },
    {
      contract_decimals: 18,
      contract_name: 'miFARM_DMM-LP agEURjEUR-f-agDEN-JUL22',
      contract_ticker_symbol: 'bfDMM-LP agEURjEUR-f-agDEN-JUL22',
      contract_address: '0x48795326fba34e07076038cc8f03f88a80e71214',
      supports_erc: ['erc20'],
      logo_url:
        'https://logos.covalenthq.com/tokens/137/0x48795326fba34e07076038cc8f03f88a80e71214.png',
      last_transferred_at: '2022-06-20T16:51:35Z',
      type: 'dust',
      balance: '0',
      balance_24h: '0',
      quote_rate: null,
      quote_rate_24h: null,
      quote: 0,
      quote_24h: null,
      nft_data: null,
    },
    {
      contract_decimals: 18,
      contract_name: 'Jarvis Synthetic Euro',
      contract_ticker_symbol: 'jEUR',
      contract_address: '0x4e3decbb3645551b8a19f0ea1678079fcb33fb4c',
      supports_erc: ['erc20'],
      logo_url:
        'https://logos.covalenthq.com/tokens/137/0x4e3decbb3645551b8a19f0ea1678079fcb33fb4c.png',
      last_transferred_at: '2022-06-10T14:38:48Z',
      type: 'dust',
      balance: '7181211299381888',
      balance_24h: '7181211299381888',
      quote_rate: 1.0617334,
      quote_rate_24h: 1.0350891,
      quote: 0,
      quote_24h: 0.0074331937,
      nft_data: null,
    },
    {
      contract_decimals: 18,
      contract_name: 'Moo Curve aTriCrypto3',
      contract_ticker_symbol: 'mooCurveATriCrypto3',
      contract_address: '0x5a0801bad20b6c62d86c566ca90688a6b9ea1d3f',
      supports_erc: ['erc20'],
      logo_url:
        'https://logos.covalenthq.com/tokens/137/0x5a0801bad20b6c62d86c566ca90688a6b9ea1d3f.png',
      last_transferred_at: '2022-06-22T16:07:37Z',
      type: 'cryptocurrency',
      balance: '615065946408795948',
      balance_24h: '615065946408795948',
      quote_rate: null,
      quote_rate_24h: null,
      quote: 0,
      quote_24h: null,
      nft_data: null,
    },
    {
      contract_decimals: 18,
      contract_name: 'Moo Jarvis 2eur',
      contract_ticker_symbol: 'mooJarvis2eur',
      contract_address: '0x5f1b5714f30baac4cb1ee95e1d0cf6d5694c2204',
      supports_erc: ['erc20'],
      logo_url:
        'https://logos.covalenthq.com/tokens/137/0x5f1b5714f30baac4cb1ee95e1d0cf6d5694c2204.png',
      last_transferred_at: '2022-05-25T09:18:05Z',
      type: 'cryptocurrency',
      balance: '1962546796135382291382',
      balance_24h: '1962546796135382291382',
      quote_rate: null,
      quote_rate_24h: null,
      quote: 0,
      quote_24h: null,
      nft_data: null,
    },
    {
      contract_decimals: 18,
      contract_name: 'Uniswap V2',
      contract_ticker_symbol: 'UNI-V2',
      contract_address: '0x65752c54d9102bdfd69d351e1838a1be83c924c6',
      supports_erc: ['erc20'],
      logo_url:
        'https://logos.covalenthq.com/tokens/137/0x65752c54d9102bdfd69d351e1838a1be83c924c6.png',
      last_transferred_at: '2022-06-16T15:02:57Z',
      type: 'dust',
      balance: '0',
      balance_24h: '0',
      quote_rate: 0.97465026,
      quote_rate_24h: 0.94329315,
      quote: 0,
      quote_24h: 0,
      nft_data: null,
    },
    {
      contract_decimals: 18,
      contract_name: 'Moo Jarvis 4eur',
      contract_ticker_symbol: 'mooJarvis4eur',
      contract_address: '0x80dad30b61b6110ab4112e440988da2d9aa85329',
      supports_erc: ['erc20'],
      logo_url:
        'https://logos.covalenthq.com/tokens/137/0x80dad30b61b6110ab4112e440988da2d9aa85329.png',
      last_transferred_at: '2022-05-17T19:18:59Z',
      type: 'dust',
      balance: '0',
      balance_24h: '0',
      quote_rate: null,
      quote_rate_24h: null,
      quote: 0,
      quote_24h: null,
      nft_data: null,
    },
    {
      contract_decimals: 18,
      contract_name: 'Moo QuickSwap stMATIC-MATIC',
      contract_ticker_symbol: 'mooQuickSwapstMATIC-MATIC',
      contract_address: '0x8829adf1a9a7face44c8fab3bc454f93f330e492',
      supports_erc: ['erc20'],
      logo_url:
        'https://logos.covalenthq.com/tokens/137/0x8829adf1a9a7face44c8fab3bc454f93f330e492.png',
      last_transferred_at: '2022-06-16T14:43:39Z',
      type: 'dust',
      balance: '0',
      balance_24h: '0',
      quote_rate: null,
      quote_rate_24h: null,
      quote: 0,
      quote_24h: null,
      nft_data: null,
    },
    {
      contract_decimals: 18,
      contract_name: '90D-Beefy-mooCurveATriCrypto3',
      contract_ticker_symbol: '90D-Beefy-mooCurveATriCrypto3',
      contract_address: '0x8bf0c51b31ec0469600dd7fbaa75e1344986b819',
      supports_erc: ['erc20'],
      logo_url:
        'https://logos.covalenthq.com/tokens/137/0x8bf0c51b31ec0469600dd7fbaa75e1344986b819.png',
      last_transferred_at: '2022-06-22T16:07:37Z',
      type: 'dust',
      balance: '0',
      balance_24h: '0',
      quote_rate: null,
      quote_rate_24h: null,
      quote: 0,
      quote_24h: null,
      nft_data: null,
    },
    {
      contract_decimals: 18,
      contract_name: 'pbfagEURjEUR-f',
      contract_ticker_symbol: 'pbfagEURjEUR-f',
      contract_address: '0x9c55488f8adc23544b8571757169ae17865abfc8',
      supports_erc: ['erc20'],
      logo_url:
        'https://logos.covalenthq.com/tokens/137/0x9c55488f8adc23544b8571757169ae17865abfc8.png',
      last_transferred_at: '2022-06-10T14:49:36Z',
      type: 'cryptocurrency',
      balance: '823224934647078121209',
      balance_24h: '823224934647078121209',
      quote_rate: null,
      quote_rate_24h: null,
      quote: 0,
      quote_24h: null,
      nft_data: null,
    },
    {
      contract_decimals: 18,
      contract_name: 'Curve.fi Factory Plain Pool: 4eur',
      contract_ticker_symbol: '4eur-f',
      contract_address: '0xad326c253a84e9805559b73a08724e11e49ca651',
      supports_erc: ['erc20'],
      logo_url:
        'https://logos.covalenthq.com/tokens/137/0xad326c253a84e9805559b73a08724e11e49ca651.png',
      last_transferred_at: '2022-05-17T19:19:43Z',
      type: 'dust',
      balance: '0',
      balance_24h: '0',
      quote_rate: null,
      quote_rate_24h: null,
      quote: 0,
      quote_24h: null,
      nft_data: null,
    },
    {
      contract_decimals: 6,
      contract_name: '(PoS) Tether USD',
      contract_ticker_symbol: 'USDT',
      contract_address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
      supports_erc: ['erc20'],
      logo_url:
        'https://logos.covalenthq.com/tokens/1/0xdac17f958d2ee523a2206206994597c13d831ec7.png',
      last_transferred_at: '2022-04-29T15:12:48Z',
      type: 'dust',
      balance: '0',
      balance_24h: '0',
      quote_rate: 1.0151469,
      quote_rate_24h: 0.99693805,
      quote: 0,
      quote_24h: 0,
      nft_data: null,
    },
    {
      contract_decimals: 18,
      contract_name: 'Curve USD-BTC-ETH',
      contract_ticker_symbol: 'crvUSDBTCETH',
      contract_address: '0xdad97f7713ae9437fa9249920ec8507e5fbb23d3',
      supports_erc: ['erc20'],
      logo_url:
        'https://logos.covalenthq.com/tokens/137/0xdad97f7713ae9437fa9249920ec8507e5fbb23d3.png',
      last_transferred_at: '2022-06-08T14:45:15Z',
      type: 'dust',
      balance: '0',
      balance_24h: '0',
      quote_rate: 1588.2491,
      quote_rate_24h: 1537.1509,
      quote: 0,
      quote_24h: 0,
      nft_data: null,
    },
    {
      contract_decimals: 18,
      contract_name: 'miFARM_agEURjEUR-f',
      contract_ticker_symbol: 'bfagEURjEUR-f',
      contract_address: '0xe4e6055a7eb29f2fa507ba7f8c4facc0c5ef9a2a',
      supports_erc: ['erc20'],
      logo_url:
        'https://logos.covalenthq.com/tokens/137/0xe4e6055a7eb29f2fa507ba7f8c4facc0c5ef9a2a.png',
      last_transferred_at: '2022-06-10T14:49:36Z',
      type: 'dust',
      balance: '0',
      balance_24h: '0',
      quote_rate: null,
      quote_rate_24h: null,
      quote: 0,
      quote_24h: null,
      nft_data: null,
    },
    {
      contract_decimals: 18,
      contract_name: 'Denarius',
      contract_ticker_symbol: 'agDEN-JUL22',
      contract_address: '0xeeff5d27e40a5239f6f28d4b0fbe20acf6432717',
      supports_erc: ['erc20'],
      logo_url:
        'https://logos.covalenthq.com/tokens/137/0xeeff5d27e40a5239f6f28d4b0fbe20acf6432717.png',
      last_transferred_at: '2022-05-25T09:16:29Z',
      type: 'dust',
      balance: '0',
      balance_24h: '0',
      quote_rate: null,
      quote_rate_24h: null,
      quote: 0,
      quote_24h: null,
      nft_data: null,
    },
  ],
  pagination: null,
};
