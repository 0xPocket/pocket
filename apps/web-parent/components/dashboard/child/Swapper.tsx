import React, { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import {
  erc20ABI,
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  useNetwork,
  useSigner,
  useToken,
} from 'wagmi';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { useQuery } from 'react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CovalentItem, CovalentReturn } from '@lib/types/interfaces';
import { Button } from '@lib/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { constants } from 'buffer';

const fetchUsers = async (address: string) => {
  const APIKEY = 'ckey_d68ffbaf2bdf47b6b58e84fada7';
  const baseURL = 'https://api.covalenthq.com/v1';
  const blockchainChainId = '137';
  const res = axios.get<CovalentReturn>(
    `${baseURL}/${blockchainChainId}/address/${address}/balances_v2/?key=${APIKEY}`,
  );
  return res.then((res) => res.data.data);
};

const fetch1InchTokens = async (chainId: number) => {
  const res = axios.get<OneInchReturn>(
    apiBaseUrl + chainId.toString() + '/tokens',
  );
  return res.then((res) => res.data.tokens);
};

const generateTx = async (
  fromTokenAddress: string,
  toTokenAddress: string,
  amount: BigNumberish,
  userAddress: string,
  chainId: number,
) => {
  const url =
    apiBaseUrl +
    chainId.toString() +
    '/swap?' +
    'fromTokenAddress=' +
    fromTokenAddress +
    '&toTokenAddress=' +
    toTokenAddress +
    '&amount=' +
    amount.toString() +
    '&fromAddress=' +
    userAddress +
    '&slippage=' + // TODO : choose slippage, default config ?
    '1' +
    '&disableEstimate=true'; // TODO : take off, only usefull because of the forking

  const tx = (await axios.get(url)).data.tx;
  return tx;
};

const quote1Inch = async (
  fromTokenAddress: string,
  toTokenAddress: string,
  amount: BigNumberish,
  chainId: number,
) => {
  const url =
    apiBaseUrl +
    chainId.toString() +
    '/quote?' +
    'fromTokenAddress=' +
    fromTokenAddress +
    '&toTokenAddress=' +
    toTokenAddress +
    '&amount=' +
    amount.toString();

  try {
    const res = await axios.get(url);

    return ethers.utils.formatUnits(
      res.data.toTokenAmount,
      res.data.toToken.decimals,
    );
  } catch (error: any) {
    return error.response.data.description;
  }
};

const Swapper: React.FC = () => {
  const [amountToSwap, setAmountToSwap] = useState('');
  const [fromToken, setFromToken] = useState<CovalentItem>();
  const [toToken, setToToken] = useState<tokenId>();
  const [quote, setQuote] = useState('0');

  const { chain } = useNetwork();
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const { data: tokenInfo } = useToken({
    address: fromToken?.contract_address,
    enabled: fromToken?.contract_address !== maticAddress,
  });
  const { data: balanceTest } = useBalance({
    addressOrName: tokenInfo?.address,
    formatUnits: tokenInfo?.decimals,
  });
  const { data: allowance, refetch: callAllowance } = useContractRead({
    addressOrName: fromToken?.contract_address!,
    contractInterface: erc20ABI,
    functionName: 'allowance',
    args: [address, oneInchContract],
    enabled: false,
  });

  const { data: approve, writeAsync: callApprove } = useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: fromToken?.contract_address!,
    contractInterface: erc20ABI,
    functionName: 'approve',
    args: [oneInchContract, ethers.constants.MaxUint256],
  });

  const handleAllowance = async () => {
    await callAllowance();
    console.log(' allo ', allowance?.toString());
    console.log(
      ethers.utils
        .parseUnits(amountToSwap, fromToken?.contract_decimals)
        .toString(),
    );
    if (
      allowance?.lt(
        ethers.utils.parseUnits(amountToSwap, fromToken?.contract_decimals),
      )
    ) {
      await callApprove();
      await approve?.wait();
    } else console.log('Allowance is ok');
  };

  const swap = async () => {
    if (fromToken?.contract_address !== maticAddress) await handleAllowance();

    console.log(fromToken?.contract_address);

    const tx = await generateTx(
      fromToken?.contract_address!,
      toToken?.address!,
      ethers.utils.parseUnits(amountToSwap, fromToken?.contract_decimals),
      address!,
      chain?.id!,
    );

    delete tx.gas;

    if (signer) await signer.sendTransaction(tx);
  };

  const isValidConf: boolean = useMemo(() => {
    if (
      fromToken &&
      toToken &&
      amountToSwap &&
      fromToken.contract_address !== toToken.address
    )
      return true;
    else return false;
  }, [amountToSwap, fromToken, toToken]);

  const messageToDisplay: string = useMemo(() => {
    if (fromToken && toToken && amountToSwap) {
      if (fromToken.contract_address === toToken?.address)
        return 'Cannot swap for the same token';
      else {
        if (quote === '-1') return 'You cannot swap those tokens';
        else if (
          balanceTest?.value.lt(
            ethers.utils.parseUnits(amountToSwap, fromToken.contract_decimals),
          )
        ) {
          return 'Not enough fund';
        } else
          return (
            'you will have : ' +
            parseFloat(quote).toFixed(5) +
            ' ' +
            toToken.name
          );
      }
    } else return 'choose a token and a amount to swap';
  }, [fromToken, toToken, amountToSwap, balanceTest?.value, quote]);

  useEffect(() => {
    async function updateQuote() {
      if (amountToSwap && toToken && fromToken) {
        setQuote('');
        const queryQuote = await quote1Inch(
          fromToken.contract_address,
          toToken.address,
          ethers.utils.parseUnits(amountToSwap, fromToken.contract_decimals),
          chain?.id!,
        );
        if (parseFloat(queryQuote)) setQuote(queryQuote);
        else setQuote('-1');
      }
    }

    if (isValidConf) updateQuote();
  }, [amountToSwap, chain?.id, fromToken, isValidConf, toToken]);

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
    ['swapper.token-list'],
    () => fetch1InchTokens(chain?.id!),
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
              className="basis-1/2 text-dark"
              isSearchable={true}
              options={tokenInWallet}
              onChange={(event) => {
                if (
                  event?.value.contract_address ===
                  '0x0000000000000000000000000000000000001010'
                )
                  event.value.contract_address = maticAddress;
                setFromToken(event?.value!);
              }}
            />
          )}
          <input
            type="text"
            placeholder="Amount"
            value={amountToSwap}
            onChange={(event) => {
              setAmountToSwap(event.target.value);
            }}
            className="basis-1/2 rounded-md text-right text-dark"
          />
        </div>
        <div className="container-classic flex gap-2 rounded-md p-3">
          {!isLoading && (
            <Select
              className="basis-1/2 text-dark"
              isSearchable={true}
              options={tokenList}
              onChange={(event) => {
                setToToken(event?.value);
              }}
            />
          )}
          {quote ? (
            <p className="basis-1/2">{messageToDisplay}</p>
          ) : (
            <FontAwesomeIcon icon={faSpinner} spin />
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

const usdc: CovalentItem = {
  // TODO : only usefull for testing
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

interface OneInchReturn {
  tokens: tokenId[];
}

interface tokenId {
  address: string;
  decimals: number;
  logoURI: string;
  name: string;
  symbol: string;
  tags: string[];
}

const apiBaseUrl = 'https://api.1inch.io/v4.0/';
const oneInchContract = '0x1111111254fb6c44bAC0beD2854e76F90643097d';
const maticAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
