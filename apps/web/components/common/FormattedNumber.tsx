import type { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils.js';
import { FC, useMemo } from 'react';
import { useSmartContract } from '../../contexts/contract';

type FormattedNumberProps = {
  value?: BigNumber;
};

const FormattedNumber: FC<FormattedNumberProps> = ({ value }) => {
  const { erc20 } = useSmartContract();

  const formattedValue = useMemo(() => {
    if (!value) return '0.00';
    return Number(formatUnits(value, erc20?.decimals)).toFixed(2);
  }, [value, erc20?.decimals]);

  return <>{formattedValue}</>;
};

export default FormattedNumber;
