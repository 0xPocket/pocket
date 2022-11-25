import { UserChild } from '@lib/types/interfaces';
import Link from 'next/link';
import type { FC } from 'react';
import { useChildBalance } from '../../hooks/useChildBalance';
import { useChildConfig } from '../../hooks/useChildConfig';
import MetaMaskProfilePicture from '../card/common/MetaMaskProfilePicture';
import FormattedMessage from '../common/FormattedMessage';
import FormattedNumber from '../common/FormattedNumber';

type AccountCardProps = {
  child: UserChild;
  viewProfile?: boolean;
};

const AccountCard: FC<AccountCardProps> = ({ child, viewProfile = false }) => {
  const { data: childConfig } = useChildConfig({ address: child.address });
  const { data: childBalance } = useChildBalance({ address: child.address });

  return (
    <div
      className={`container-classic  flex h-[190px] flex-col justify-between rounded-lg p-4  xl:h-[220px] `}
    >
      <div className="flex w-full justify-between">
        <div className="flex items-center gap-4">
          <MetaMaskProfilePicture address={child.address} size={50} />
          <div>
            <p className="font-bold tracking-wide text-[#A3A8AE]">
              {child.name}
            </p>
            <p className="">
              <span className="font-['IBM Plex Sans'] text-3xl">
                $<FormattedNumber value={childBalance?.value} />
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <FormattedMessage id="in_piggybank" />
          </div>
          <p className="text-pink">
            $
            <span className="font-number text-3xl">
              <FormattedNumber value={childConfig?.balance} />
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link href={`/account/${child.address}/send`} passHref>
          <button className="action-btn">
            <FormattedMessage id="send" />
          </button>
        </Link>
        {viewProfile && (
          <Link href={`/account/${child.address}`}>
            <a className="flex items-center justify-center px-4 py-2 ">
              <FormattedMessage id="view_profile" />
            </a>
          </Link>
        )}
      </div>
    </div>
  );
};

export default AccountCard;
