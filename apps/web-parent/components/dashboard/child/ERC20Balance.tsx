import React from 'react';
import { useAccount, useBalance } from 'wagmi';
import { useSmartContract } from '../../../contexts/contract';

const ERC20Balance: React.FC = () => {
  const { address } = useAccount();
  const { erc20 } = useSmartContract();

  const { data } = useBalance({
    addressOrName: address,
    token: erc20.data?.address,
    formatUnits: erc20.data?.decimals,
    watch: true,
  });

  if (!data) {
    return <div>Loading..</div>;
  }

  return (
    <div>
      USDC Balance : {data.formatted} {erc20.data?.symbol}
    </div>
  );
};

export default ERC20Balance;
