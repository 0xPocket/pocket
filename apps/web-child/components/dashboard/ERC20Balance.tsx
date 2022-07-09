import React from 'react';
import { useAccount, useBalance, useToken } from 'wagmi';

const ERC20Balance: React.FC = () => {
  const { address } = useAccount();
  const {
    data: erc20data,
    isError,
    isLoading,
  } = useToken({
    address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
  });

  const { data } = useBalance({
    addressOrName: address,
    token: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    formatUnits: erc20data?.decimals,
    watch: true,
  });

  if (!data) {
    return <div>Loading..</div>;
  }

  return (
    <div>
      {data.formatted} {erc20data?.symbol}
    </div>
  );
};

export default ERC20Balance;
