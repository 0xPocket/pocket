import {
  faArrowUpRightFromSquare,
  faCopy,
  faPlusCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/future/image';
import Link from 'next/link';
import type { FC } from 'react';
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';
import { useSmartContract } from '../../contexts/contract';
import FormattedMessage from '../common/FormattedMessage';
import Tooltip from '../common/Tooltip';

const TokenInfo: FC = () => {
  const { erc20 } = useSmartContract();
  const { connector } = useAccount();

  const addToken = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { ethereum } = window as any;
    if (ethereum) {
      try {
        await ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: erc20.data?.address,
              symbol: erc20.data?.symbol,
              decimals: erc20.data?.decimals,
              image:
                'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/usdc-coin-icon.png',
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <span>Token</span>
      <div className="mb-2 flex gap-2">
        <Image
          src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/usdc-coin-icon.png"
          width={25}
          height={25}
          alt="USDC"
        />
        <h2 className="flex items-center text-base font-normal">
          {erc20.data?.symbol}
        </h2>
        <div className="ml-2 flex items-center gap-4 text-gray-light">
          <button
            onClick={() => {
              if (erc20.data) {
                navigator.clipboard.writeText(erc20.data?.address);
                toast.success(<FormattedMessage id="wallet.clipboard" />);
              }
            }}
          >
            <Tooltip icon={faCopy} placement="top">
              <FormattedMessage id="wallet.token-clipboard" />
            </Tooltip>
          </button>
          <Link href={`https://polygonscan.com/address/${erc20.data?.address}`}>
            <a className="text-gray-light" target="_blank">
              <Tooltip icon={faArrowUpRightFromSquare} placement="top">
                <FormattedMessage id="wallet.polygonscan" />
              </Tooltip>
            </a>
          </Link>
          {connector?.id !== 'magic' && (
            <button onClick={() => addToken()}>
              <Tooltip icon={faPlusCircle} placement="top">
                <FormattedMessage id="wallet.add-token" />
              </Tooltip>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenInfo;
