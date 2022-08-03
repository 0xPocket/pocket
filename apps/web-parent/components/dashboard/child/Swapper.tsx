import React, { useState } from 'react';
import Select from 'react-select';
import { useAccount, useSigner } from 'wagmi';
import ERC20Balance from './ERC20Balance';
import { BigNumberish, ethers } from 'ethers';
import moment from 'moment';
import { useQuery } from 'react-query';
import { useSmartContract } from '../../../contexts/contract';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CovalentItem, CovalentReturn } from '@lib/types/interfaces';
import useContractWrite from '../../../hooks/useContractWrite';

const chainId = '137';
const apiBaseUrl = 'https://api.1inch.io/v4.0/' + chainId;

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
  toToken: string,
  amount: BigNumberish,
) => {
  const url =
    apiBaseUrl +
    '/quote?' +
    'fromTokenAddress=' +
    fromToken +
    '&toTokenAddress=' +
    toToken +
    '&amount=' +
    amount.toString();

  const res = await axios.get(url);

  console.log(
    'you will get',
    ethers.utils.formatUnits(res.data.toTokenAmount, res.data.decimals),
    res.data.toToken.name,
  );
};

const Swapper: React.FC = () => {
  const [value, setValue] = useState('');
  const [toToken, setToToken] = useState('');
  const { address } = useAccount();
  const { erc20 } = useSmartContract();
  const { data: signer } = useSigner();

  const { writeAsync: approve } = useContractWrite({
    contract: erc20.contract,
    functionName: 'approve',
  });

  const swapUSDC = async () => {
    quote1Inch(
      erc20.data?.address!,
      toToken,
      ethers.utils.parseUnits(value, erc20.data?.decimals),
    );

    const tx = await generateTx(
      erc20.data?.address!,
      toToken,
      ethers.utils.parseUnits(value, erc20.data?.decimals),
      address!,
    );
    console.log(tx);
    // setSwapTx(tx);
    // sendTransaction(tx);

    await approve({
      args: [
        '0x1111111254fb6c44bAC0beD2854e76F90643097d',
        ethers.constants.MaxUint256,
      ],
    });

    delete tx.gas;

    if (signer) await signer.sendTransaction(tx);
  };

  const swap = () => {
    console.log('swappaaah');
  };

  const handleChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setValue(event.target.value);
  };

  const handleToToken = (event: {
    value: { address: React.SetStateAction<string> };
  }) => {
    setToToken(event.value.address);
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
    () => axios.get(apiBaseUrl + '/tokens'),
    {
      staleTime: 60 * 1000,
      onError: () => toast.error('Could not retrieve 1inch token list'),
      select: (res) => {
        return Object.values(res.data.tokens).map((token: any) => ({
          value: token,
          label: token.name,
        }));
      },
    },
  );

  return (
    <div>
      {' '}
      <div className="flex">
        <input
          type="text"
          placeholder="This is a test"
          value={value}
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
            value={toToken}
            onChange={handleToToken}
          />
        )}
        <button onClick={swap}>Swap plzzz</button>
      </div>
      <div>
        <button onClick={swapUSDC}>Swap USDC</button>
      </div>
    </div>
  );
};

export default Swapper;
