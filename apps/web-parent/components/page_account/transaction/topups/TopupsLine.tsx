import { AssetTransfersResultWithMetadata } from '@lib/types/interfaces';
import { ethers } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import moment from 'moment';
import { useToken, useTransaction } from 'wagmi';
import { useSmartContract } from '../../../../contexts/contract';

type TopupsLineProps = {
  log: ethers.utils.LogDescription;
};

function TopupsLine({ log }: TopupsLineProps) {
  const { erc20 } = useSmartContract();

  const date = log.args[3].toNumber();
  const value = formatUnits(
    log.args[1].toString(),
    erc20.data?.decimals,
  ).toString();

  const symbol = erc20.data?.symbol;
  return (
    <tr className="grid grid-cols-2 gap-4">
      <td>{moment(date).format('D/MM')}</td>
      <td>
        {value} {symbol}
      </td>
    </tr>
  );
}

export default TopupsLine;
