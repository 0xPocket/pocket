import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useAccount, useSigner } from 'wagmi';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { useQuery } from 'react-query';
import { useSmartContract } from '../../../contexts/contract';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CovalentItem, CovalentReturn } from '@lib/types/interfaces';
import useContractWrite from '../../../hooks/useContractWrite';
import { Button } from '@lib/ui';

const chainId = '137';
const apiBaseUrl = 'https://api.1inch.io/v4.0/' + chainId;

interface OneInchReturn {
  tokens: tokenId[];
}

const usdc: CovalentItem = {
  balance: 0,
  balance_24h: '0',
  contract_address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
  contract_decimals: 6,
  contract_name: 'USD Coin (PoS)',
  contract_ticker_symbol: 'USDC',
  last_transferred_at: '2022-08-03T10:48:32Z',
  logo_url:
    'https://logos.covalenthq.com/tokens/1/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png',
  nft_data: [],
  quote: 0,
  quote_24h: 0,
  quote_rate: 0.9997549,
  quote_rate_24h: 1.0002348,
  supports_erc: ['erc20'],
  type: 'cryptocurrency',
};

interface tokenId {
  address: string;
  decimals: number;
  logoURI: string;
  name: string;
  symbol: string;
  tags: string[];
}

const generateTx = async (
  fromTokenAddress: string,
  toTokenAddress: string,
  amount: BigNumberish,
  userAddress: string,
) => {
  if (fromTokenAddress === '0x0000000000000000000000000000000000001010')
    fromTokenAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

  const url =
    apiBaseUrl +
    '/swap?' +
    'fromTokenAddress=' +
    fromTokenAddress +
    '&toTokenAddress=' +
    toTokenAddress +
    '&amount=' +
    amount.toString() +
    '&fromAddress=' +
    userAddress +
    '&slippage=' + // TODO : decide a slippage, default config ?
    '1' +
    '&disableEstimate=true'; // TODO : take off, only usefull because of the forking

  const tx = (await axios.get(url)).data.tx;
  return tx;
};

const quote1Inch = async (
  fromTokenAddress: string,
  toTokenAddress: string,
  amount: BigNumberish,
) => {
  if (fromTokenAddress === '0x0000000000000000000000000000000000001010')
    fromTokenAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

  const url =
    apiBaseUrl +
    '/quote?' +
    'fromTokenAddress=' +
    fromTokenAddress +
    '&toTokenAddress=' +
    toTokenAddress +
    '&amount=' +
    amount.toString();

  const res = await axios.get(url);
  console.log(res.data.toToken.decimals);
  return ethers.utils.formatUnits(
    res.data.toTokenAmount,
    res.data.toToken.decimals,
  );
};

const Swapper: React.FC = () => {
  const [amountToSwap, setAmountToSwap] = useState('');
  const [toToken, setToToken] = useState<tokenId>();
  const [fromToken, setFromToken] = useState<CovalentItem>(usdc);
  const [quote, setQuote] = useState('');
  const { address } = useAccount();
  const { erc20 } = useSmartContract();
  const { data: signer } = useSigner();

  const { writeAsync: approve } = useContractWrite({
    contract: erc20.contract,
    functionName: 'approve',
  });

  const { writeAsync: allowance } = useContractWrite({
    contract: erc20.contract,
    functionName: 'allowance',
  });

  const swap = async () => {
    quote1Inch(
      fromToken?.contract_address!,
      toToken?.address!,
      ethers.utils.parseUnits(amountToSwap, fromToken?.contract_decimals),
    );

    const tx = await generateTx(
      fromToken?.contract_address!,
      toToken?.address!,
      ethers.utils.parseUnits(amountToSwap, fromToken?.contract_decimals),
      address!,
    );

    if (
      (
        await allowance({
          args: [address, '0x1111111254fb6c44bAC0beD2854e76F90643097d'],
        })
      ).toString() === '0'
    )
      await approve({
        args: [
          '0x1111111254fb6c44bAC0beD2854e76F90643097d',
          ethers.constants.MaxUint256,
        ],
      });
    else console.log('Allowance is ok');

    delete tx.gas;

    if (signer) await signer.sendTransaction(tx);
  };

  const handleAmount = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setAmountToSwap(event.target.value);
  };

  useEffect(() => {
    async function updateQuote() {
      if (amountToSwap && toToken && fromToken) {
        const queryQuote = quote1Inch(
          fromToken.contract_address,
          toToken.address,
          ethers.utils.parseUnits(amountToSwap, fromToken.contract_decimals),
        );
        setQuote(await queryQuote);
      }
    }
    updateQuote();
  }, [amountToSwap, fromToken, toToken]);

  const fetchUsers = async (address: string) => {
    const APIKEY = 'ckey_d68ffbaf2bdf47b6b58e84fada7';
    const baseURL = 'https://api.covalenthq.com/v1';
    const blockchainChainId = '137';
    const res = axios.get<CovalentReturn>(
      `${baseURL}/${blockchainChainId}/address/${address}/balances_v2/?key=${APIKEY}`,
    );
    return res.then((res) => res.data.data);
  };

  const fetch1InchTokens = async () => {
    const res = axios.get<OneInchReturn>(apiBaseUrl + '/tokens');
    return res.then((res) => res.data.tokens);
  };

  const { isLoading: isLoadingTokenChild, data: tokenInWallet } = useQuery(
    ['child.token-content'],
    () => fetchUsers(address!),
    {
      staleTime: 60 * 1000,
      onError: () => toast.error("Could not retrieve user's token"),
      select: (res) => {
        return res.items
          .map((token: CovalentItem) => ({
            value: token,
            label: token.contract_ticker_symbol,
          }))
          .concat({ value: usdc, label: usdc.contract_ticker_symbol });
      },
    },
  );

  const { isLoading, data: tokenList } = useQuery(
    ['swapper.token_list'],
    () => fetch1InchTokens(),
    {
      staleTime: 60 * 1000,
      onError: () => toast.error('Could not retrieve 1inch token list'),
      select: (res) => {
        return Object.values(res).map((token) => ({
          value: token,
          label: token.name,
        }));
      },
    },
  );

  return (
    <div className="container-classic flex flex-col rounded-lg">
      <p className="mx-auto my-4">Swapper</p>
      <form className="flex flex-col space-y-4 px-4">
        <div className="container-classic flex justify-between gap-2 rounded-md p-3">
          {!isLoadingTokenChild && (
            <Select
              className="basis-1/3 text-dark"
              isSearchable={true}
              options={tokenInWallet}
              defaultValue={{ label: usdc.contract_ticker_symbol, value: usdc }}
              onChange={(event) => {
                setFromToken(event?.value);
              }}
            />
          )}
          <input
            type="text"
            placeholder="Amount"
            value={amountToSwap}
            onChange={handleAmount}
            className="basis-2/3 rounded-md text-right text-dark"
          />
        </div>
        <div className="container-classic flex gap-2 rounded-md p-3">
          {!isLoading && (
            <Select
              className="basis-1/3 text-dark"
              isSearchable={true}
              options={tokenList}
              onChange={(event) => {
                setToToken(event?.value);
              }}
            />
          )}
          {quote ? (
            <p className="basis-2/3">
              You will get : {parseFloat(quote).toFixed(5)}
              {toToken!.name}
            </p>
          ) : (
            <p className="basis-2/3">choose an amount to swap</p>
          )}
        </div>
      </form>
      <Button className="m-4 mt-auto" action={swap}>
        SWAP
      </Button>
    </div>
  );
};

export default Swapper;
