import React, { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import { ethers } from 'ethers';
import { useQuery } from 'react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CovalentItem, CovalentReturn } from '@lib/types/interfaces';
import { Button } from '@lib/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faSpinner } from '@fortawesome/free-solid-svg-icons';
import {
  Chain,
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
import { Tooltip } from '@mui/material';
// import { from } from 'form-data';

const fetchWalletContent = async (address: string, chain: Chain) => {
  const APIKEY = 'ckey_d68ffbaf2bdf47b6b58e84fada7';
  const baseURL = 'https://api.covalenthq.com/v1';
  // TODO : hackaton
  // const res = axios.get<CovalentReturn>(
  //   `${baseURL}/${chain.id.toString()}/address/${address}/balances_v2/?key=${APIKEY}`,
  // );
  const res = axios.get<CovalentReturn>(
    `${baseURL}/137/address/${address}/balances_v2/?key=${APIKEY}`,
  );
  return res.then((res) => res.data.data);
};

// const customStyles = {
//   option: (provided: any, state: any) => ({
//     ...provided,
//     borderBottom: '1px dotted grey',
//     // color: state.isSelected ? '' : 'blue',
//     backgroundColor: '@apply bg-dark',
//   }),

//   singleValue: (provided: any, state: any) => {
//     const opacity = state.isDisabled ? 0.5 : 1;
//     const transition = 'opacity 300ms';

//     return { ...provided, opacity, transition };
//   },
// };

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

type SwapperProps = {
  className?: string;
};

const Swapper: React.FC = ({ className }: SwapperProps) => {
  // const { chains } = useNetwork();
  const [amountToSwap, setAmountToSwap] = useState('0');
  const [fromToken, setFromToken] = useState<CovalentItem>();
  const [toToken, setToToken] = useState<tokenId>();
  const [quote, setQuote] = useState('');
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
      amountToSwap != '0' &&
      fromToken.contract_address !== toToken.address
    )
      return true;
    else return false;
  }, [amountToSwap, fromToken, toToken]);

  // const messageToDisplay: string = useMemo(() => {
  //   if (fromToken && toToken && amountToSwap != '0') {
  //     if (fromToken.contract_address === toToken?.address)
  //       return 'Cannot swap for the same token';
  //     else {
  //       let balance;
  //       fromToken.contract_address === maticAddress
  //         ? (balance = balanceMatic)
  //         : (balance = balanceToken);
  //       if (quote === '-1')
  //         return 'You cannot swap those tokens'; // TODO : handle all error
  //       else if (
  //         balance?.value.lt(
  //           ethers.utils.parseUnits(amountToSwap, fromToken.contract_decimals),
  //         )
  //       ) {
  //         return 'Not enough fund';
  //       } else
  //         return (
  //           'you will have : ' +
  //           parseFloat(quote).toFixed(5) +
  //           ' ' +
  //           toToken.name
  //         );
  //     }
  //   } else return '';
  // }, [fromToken, toToken, amountToSwap, balanceMatic, balanceToken, quote]);

  useEffect(() => {
    async function updateQuote() {
      if (
        parseFloat(amountToSwap) &&
        amountToSwap != '' &&
        toToken &&
        fromToken
      ) {
        setQuote('0');
        const queryQuote = await quote1Inch(
          fromToken.contract_address,
          toToken.address,
          ethers.utils.parseUnits(amountToSwap, fromToken.contract_decimals),
          137,
          // TODO : hackaton
          // chain?.id!,
        );
        if (queryQuote === '-1') setAmountToSwap(amountToSwap);
        else if (parseFloat(queryQuote)) setQuote(queryQuote);
        // else setQuote('0');
      }
    }
    if (isValidConf) updateQuote();
    else setQuote('0');
  }, [amountToSwap, chain?.id, fromToken, isValidConf, toToken]);

  const { isLoading: isLoadingTokenChild, data: tokenInWallet } = useQuery(
    ['child.token-content'],
    () => fetchWalletContent(address!, chain!),
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

  const { isLoading: isLoading1inch, data: tokenList } = useQuery(
    ['swapper.token-list'],
    () => fetch1InchTokens(137),
    // TODO : hackaton
    // () => fetch1InchTokens(chain?.id!),
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
    <div className=" space-y-4   ">
      <h2>Swapper</h2>
      <form
        className={`container-classic flex h-4/5 min-h-[260px] flex-col justify-between space-y-4 rounded-lg p-5`}
      >
        <div className="container-classic flex  gap-2 rounded-2xl p-1">
          <input
            className="container-classic text-large w-3/5 appearance-none rounded-2xl border-0 text-left"
            type="number"
            placeholder="0.0"
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
          />

          <Button
            light
            className="ml-0 w-1/5 pb-0 text-right dark:text-gray"
            action={() => {
              let balance;
              fromToken?.contract_address === maticAddress
                ? (balance = balanceMatic)
                : (balance = balanceToken);
              if (fromToken?.contract_address === undefined)
                balance!.formatted = '0';
              setAmountToSwap(balance?.formatted!);
            }}
          >
            Max
          </Button>
          {!isLoadingTokenChild ? (
            <Select
              className="m-auto  w-4/5 rounded-2xl text-dark"
              // styles={customStyles}
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
          ) : (
            <FontAwesomeIcon icon={faSpinner} spin className="m-auto w-4/5" />
          )}
        </div>
        <FontAwesomeIcon icon={faArrowDown} />
        {!isLoading1inch ? (
          <Select
            className="text-dark"
            isSearchable={true}
            options={tokenList}
            onChange={(event) => {
              setToToken(event?.value);
            }}
          />
        ) : (
          <p>Loading...</p>
        )}
        <Button
          // disabled={!fromToken || !toToken || parseInt(amountToSwap) == 0}
          disabled={true}
          className="text-s m-auto my-4"
          action={swap}
        >
          <Tooltip title={title}>
            <p>
              {fromToken && toToken && parseFloat(amountToSwap) ? (
                parseFloat(quote) !== 0 ? (
                  `Get ${parseFloat(quote).toFixed(3)} ${toToken.symbol}`
                ) : fromToken.contract_address !== toToken.address ? (
                  <>
                    {'Loading '}
                    <FontAwesomeIcon icon={faSpinner} spin />
                  </>
                ) : (
                  <>{"You can't swap a token with itself"}</>
                )
              ) : !parseFloat(amountToSwap) ? (
                'Select an amount'
              ) : (
                'Select a token'
              )}
            </p>
          </Tooltip>
        </Button>
      </form>
    </div>
  );
};

export default Swapper;

// TODO : only for the hackaton version
const title = 'The swapper only works for polygon mainnet, not mumbai.';
