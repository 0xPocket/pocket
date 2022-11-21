import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PendingChild } from '@lib/prisma';
import type { FC } from 'react';
import MetaMaskProfilePicture from '../card/common/MetaMaskProfilePicture';
import EmailStatus from '../card/parent/EmailStatus';

type PendingCardProps = {
  pendingChild: PendingChild;
};

const PendingCard: FC<PendingCardProps> = ({ pendingChild }) => {
  return (
    <div
      className={`container-classic flex h-[190px] flex-col justify-between rounded-lg p-4  xl:h-[220px]`}
    >
      <div className="flex w-full justify-between">
        <div className="flex items-center gap-4">
          <MetaMaskProfilePicture size={50} />
          <div>
            <p className="font-bold tracking-wide text-[#A3A8AE]">
              {pendingChild.name}
            </p>
            <p className="">
              <FontAwesomeIcon icon={faEnvelope} />
            </p>
          </div>
        </div>
      </div>

      <div className="gap-4">
        <EmailStatus child={pendingChild} />
      </div>
    </div>
  );
};

export default PendingCard;
