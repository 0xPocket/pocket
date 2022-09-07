import React from 'react';
import { useAccount, useBalance } from 'wagmi';
import { useSmartContract } from '../../contexts/contract';

const BaseTokenBalance: React.FC = () => {
  const { address } = useAccount();
  const { erc20 } = useSmartContract();
  const { data } = useBalance({
    addressOrName: address,
    token: erc20.data?.address,
    formatUnits: erc20.data?.decimals,
    enabled: !!erc20.data,
    watch: true,
  });
  const { data: maticBalance } = useBalance({
    addressOrName: address,
  });

  if (!data) {
    return <div>Loading..</div>;
  }

  return (
    <div>
      <p>Balance</p>
      <span className="text-4xl"> {data.formatted} $</span>
      <p className="mt-2 text-xs opacity-50">
        {maticBalance?.formatted.slice(0, 6)} {maticBalance?.symbol}
      </p>
    </div>
  );
};

export default BaseTokenBalance;
