import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useAccount, useSigner } from 'wagmi';
import { BigNumberish, ethers } from 'ethers';
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

// const usdc: tokenId

interface tokenId {
  address: string;
  decimals: number;
  logoURI: string;
  name: string;
  symbol: string;
  tags: string[];
}

const generateTx = async (
  fromToken: string,
  toToken: string,
  amount: BigNumberish,
  address: string,
) => {
  const url =
    apiBaseUrl +
    '/swap?' +
    'fromTokenAddress=' +
    fromToken +
    '&toTokenAddress=' +
    toToken +
    '&amount=' +
    amount.toString() +
    '&fromAddress=' +
    address +
    '&slippage=' +
    '1' +
    '&disableEstimate=true';

  const tx = (await axios.get(url)).data.tx;
  return tx;
};
const quote1Inch = async (
  fromToken: string,
  toTokenAddress: string,
  amount: BigNumberish,
) => {
  const url =
    apiBaseUrl +
    '/quote?' +
    'fromTokenAddress=' +
    fromToken +
    '&toTokenAddress=' +
    toTokenAddress +
    '&amount=' +
    amount.toString();

  const res = await axios.get(url);
  return ethers.utils.formatUnits(res.data.toTokenAmount, res.data.decimals);
};

const Swapper: React.FC = () => {
  const [amountToSwap, setAmountToSwap] = useState('');
  const [toToken, setToToken] = useState<tokenId>();
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

  const swapUSDC = async () => {
    quote1Inch(
      erc20.data?.address!,
      toToken?.address!,
      ethers.utils.parseUnits(amountToSwap, erc20.data?.decimals),
    );

    const tx = await generateTx(
      erc20.data?.address!,
      toToken?.address!,
      ethers.utils.parseUnits(amountToSwap, erc20.data?.decimals),
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

  const swap = () => {
    console.log('swappaaah');
  };

  const handleChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setAmountToSwap(event.target.value);
  };

  async function updateQuote() {
    if (amountToSwap && toToken) {
      const queryQuote = quote1Inch(
        erc20.data?.address!,
        toToken.address,
        ethers.utils.parseUnits(amountToSwap, erc20.data?.decimals),
      );
      setQuote(await queryQuote);
    }
  }

  useEffect(() => {
    updateQuote();
  }, [amountToSwap, toToken]);

  const handleToToken = async (event) => {
    setToToken(event.value);
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
        return res.items.map((token: CovalentItem) => ({
          value: token,
          label: token.contract_ticker_symbol,
        }));
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
    <div className="flex flex-row space-x-2">
      <div>welcome to THE swapper :</div>
      <div className="flex flex-col space-y-2">
        <input
          type="text"
          placeholder="Amount"
          value={amountToSwap}
          onChange={handleChange}
          className="text-dark"
        />
        {!isLoadingTokenChild && (
          <Select
            className="text-dark"
            isSearchable={true}
            options={tokenInWallet}
          />
        )}{' '}
        to
        {!isLoading && (
          <Select
            className="text-dark"
            isSearchable={true}
            options={tokenList}
            onChange={handleToToken}
          />
        )}
        {quote ? (
          <div>
            You will get : {quote.slice(0, 6)} {toToken!.name}
          </div>
        ) : (
          <div>loading</div>
        )}
        <Button className="bg-blue-700" action={swap}>
          Swappah
        </Button>
        <Button className="bg-black" action={swapUSDC}>
          Swap USDC
        </Button>
      </div>
    </div>
  );
};

export default Swapper;
