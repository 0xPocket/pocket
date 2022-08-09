import { OneInchReturn } from '@lib/types/interfaces/1inch.interface';
import { BigNumberish, ethers } from 'ethers';
import axios from 'axios';
const apiBaseUrl = 'https://api.1inch.io/v4.0/';

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
    '2' +
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

export { fetch1InchTokens, generateTx, quote1Inch };
