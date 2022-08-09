import React, { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import { ethers } from 'ethers';
import { useQuery } from 'react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CovalentItem, CovalentReturn } from '@lib/types/interfaces';
import { Button } from '@lib/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import {
  erc20ABI,
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  useNetwork,
  useSigner,
} from 'wagmi';
import {
  fetch1InchTokens,
  generateTx,
  quote1Inch,
} from '../../../utils/1InchHelper';
import { tokenId } from '@lib/types/interfaces/1inch.interface';

const fetchWalletContent = async (address: string) => {
  const APIKEY = 'ckey_d68ffbaf2bdf47b6b58e84fada7';
  const baseURL = 'https://api.covalenthq.com/v1';
  const blockchainChainId = '137';
  const res = axios.get<CovalentReturn>(
    `${baseURL}/${blockchainChainId}/address/${address}/balances_v2/?key=${APIKEY}`,
  );
  return res.then((res) => res.data.data);
};

const Swapper: React.FC = () => {
  const [amountToSwap, setAmountToSwap] = useState('');
  const [fromToken, setFromToken] = useState<CovalentItem>();
  const [toToken, setToToken] = useState<tokenId>();
  const [quote, setQuote] = useState('0');
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { data: signer } = useSigner();

  const { data: balanceToken } = useBalance({
    addressOrName: address,
    token: fromToken?.contract_address,
    enabled: fromToken?.contract_address !== maticAddress,
  });
  const { data: balanceMatic } = useBalance({
    addressOrName: address,
    enabled: fromToken?.contract_address === maticAddress,
  });
  const { data: allowance } = useContractRead({
    addressOrName: fromToken?.contract_address!,
    contractInterface: erc20ABI,
    functionName: 'allowance',
    args: [address, oneInchContract],
    enabled: fromToken?.contract_address !== maticAddress,
  });
  const { writeAsync: callApprove } = useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: fromToken?.contract_address!,
    contractInterface: erc20ABI,
    functionName: 'approve',
    args: [oneInchContract, ethers.constants.MaxUint256],
  });

  const handleAllowance = async () => {
    if (
      allowance?.lt(
        ethers.utils.parseUnits(amountToSwap, fromToken?.contract_decimals),
      )
    ) {
      await callApprove();
    } else console.log('Allowance is ok');
  };

  const swap = async () => {
    if (fromToken?.contract_address !== maticAddress) await handleAllowance();

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
        let balance;
        fromToken.contract_address === maticAddress
          ? (balance = balanceMatic)
          : (balance = balanceToken);
        if (quote === '-1')
          return 'You cannot swap those tokens'; // TODO : handle all error
        else if (
          balance?.value.lt(
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
    } else return 'choose a token and an amount to swap';
  }, [fromToken, toToken, amountToSwap, balanceMatic, balanceToken, quote]);

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
    () => fetchWalletContent(address!),
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
              className="basis-2/5 text-dark"
              isSearchable={true}
              options={tokenInWallet}
              onChange={(event) => {
                setAmountToSwap('1');
                if (
                  event?.value.contract_address ===
                  '0x0000000000000000000000000000000000001010'
                )
                  event.value.contract_address = maticAddress;
                setFromToken(event?.value!);
              }}
            />
          )}
          <Button
            className="basis-1/5"
            action={() => {
              let balance;
              fromToken?.contract_address === maticAddress
                ? (balance = balanceMatic)
                : (balance = balanceToken);
              setAmountToSwap(balance?.formatted!);
            }}
          >
            MAX
          </Button>
          <input
            type="number"
            placeholder="Amount"
            value={amountToSwap}
            onChange={(event) => {
              const point = event.target.value.indexOf('.');
              if (point === -1) setAmountToSwap(event.target.value);
              else
                setAmountToSwap(
                  event.target.value.slice(
                    0,
                    point + fromToken?.contract_decimals! + 1,
                  ),
                );
            }}
            className="basis-2/5 rounded-md text-right text-dark"
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

// TODO : take off, only usefull for testing
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

const oneInchContract = '0x1111111254fb6c44bAC0beD2854e76F90643097d';
const maticAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
