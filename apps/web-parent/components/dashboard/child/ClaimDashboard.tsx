import React, { useMemo, useState } from 'react';
import Select from 'react-select';
import { useAccount } from 'wagmi';
import ClaimButton from './ClaimButton';
import ERC20Balance from './ERC20Balance';
import { BigNumber, ethers } from 'ethers';
import moment from 'moment';
import { useQuery } from 'react-query';
import useContractRead from '../../../hooks/useContractRead';
import { useSmartContract } from '../../../contexts/contract';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CovalentItem, CovalentReturn } from '@lib/types/interfaces';

const chainId = '137';
const apiBaseUrl = 'https://api.1inch.io/v4.0/' + chainId;

const fetchUsers = async (address: string) => {
  const APIKEY = 'ckey_d68ffbaf2bdf47b6b58e84fada7';
  const baseURL = 'https://api.covalenthq.com/v1';
  const blockchainChainId = '137';
  const res = axios.get<CovalentReturn>(
    `${baseURL}/${blockchainChainId}/address/${address}/balances_v2/?key=${APIKEY}`,
  );
  return res.then((res) => res.data.data);
};

const ClaimDashboard: React.FC = () => {
  const [value, setValue] = useState('');
  const { address } = useAccount();
  const { pocketContract, erc20 } = useSmartContract();
  const { data: now } = useQuery('now', () => moment(), {
    refetchInterval: 100000,
  });

  const handleChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setValue(event.target.value);
  };

  const { data } = useContractRead({
    contract: pocketContract,
    functionName: 'childToConfig',
    args: [address!],
    watch: true,
  });

  const nextClaim = useMemo(() => {
    if (!data) {
      return;
    }
    const lastClaim = data[3];
    const periodicity = data[4];
    return moment(lastClaim.toNumber() * 1000).add(
      periodicity.toNumber(),
      'seconds',
    );
  }, [data]);

  const canClaim = useMemo(() => {
    if (!now) return false;
    return moment(nextClaim) < now;
  }, [now, nextClaim]);

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
  ////////////////////////
  // tokenList.map((token: any) => console.log(token));
  // console.log(value);
  return (
    <div>
      {data && (
        <div className="flex flex-col">
          <div>
            Balance :{' '}
            {ethers.utils.formatUnits(data[1], erc20.data?.decimals).toString()}
          </div>
          <div>
            Ceiling :{' '}
            {ethers.utils.formatUnits(data[2], erc20.data?.decimals).toString()}
          </div>
          <div>Periodicity : {(data[4] as BigNumber).toString()}</div>
          <div>-</div>
          <div>Last Claim : {(data[3] as BigNumber).toString()}</div>
          <div>
            Last Claim at :{' '}
            {moment((data[3] as BigNumber).toNumber() * 1000).toLocaleString()}
          </div>
          <div>-</div>

          <div>Now : {now?.unix()}</div>
          <div>Now : {now?.toLocaleString()}</div>
          <div>-</div>

          <div>Next Claim : {nextClaim?.unix()}</div>
          <div>Next Claim at {nextClaim?.toLocaleString()}</div>
          <div>-</div>
        </div>
      )}
      {data && (
        <ClaimButton disabled={!canClaim || data[1].toNumber() === 0}>
          {!canClaim || data[1].toNumber() === 0
            ? data[1].toNumber() === 0
              ? 'No Balance...'
              : 'Next claim in ' +
                moment.duration(moment().diff(nextClaim)).humanize() +
                '...'
            : 'Claim your money !'}
        </ClaimButton>
      )}
      <ERC20Balance />
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
          />
        )}
      </div>
    </div>
  );
};

export default ClaimDashboard;
