import React from 'react';
import { useAccount, useBalance } from 'wagmi';
import { useSmartContract } from '../../contexts/contract';
import FormattedMessage from './FormattedMessage';

const BaseTokenBalance: React.FC = () => {
  const { address } = useAccount();
  const { erc20 } = useSmartContract();
  const { data } = useBalance({
    address,
    token: erc20?.address,
    formatUnits: erc20?.decimals,
    enabled: !!erc20 && !!address,
    watch: true,
  });
  const { data: maticBalance } = useBalance({
    address,
  });

  if (!data) {
    return <div>Loading..</div>;
  }

  return (
    <div>
      <p>
        <FormattedMessage id="balance" />
      </p>
      <span className="text-4xl"> {data.formatted} $</span>
      <p className="mt-2 text-xs opacity-50">
        {maticBalance?.formatted.slice(0, 6)} {maticBalance?.symbol}
      </p>
    </div>
  );
};

export default BaseTokenBalance;
