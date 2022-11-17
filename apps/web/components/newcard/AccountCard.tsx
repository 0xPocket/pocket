import { UserChild } from '@lib/types/interfaces';
import type { FC } from 'react';
import MetaMaskProfilePicture from '../card/common/MetaMaskProfilePicture';

type AccountCardProps = {
  child: UserChild;
};

const AccountCard: FC<AccountCardProps> = ({ child }) => {
  return (
    <div
      className={`container-classic flex h-[190px] flex-col justify-between rounded-lg p-4 xl:h-[220px] `}
    >
      <div className="flex w-full justify-between">
        <div className="flex items-center gap-4">
          <MetaMaskProfilePicture address={child.address} size={50} />
          <div>
            <p className="font-bold tracking-wide text-[#A3A8AE]">
              {child.name}
            </p>
            <p className="">
              <span className="font-['IBM Plex Sans'] text-3xl">$20</span>
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <div className={``}>Dans sa tirelire</div>
          <p className="text-pink">
            $<span className="font-number text-3xl">15</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button className="action-btn">Envoyer</button>
        <a className="flex items-center justify-center px-4 py-2 ">
          Voir son profile
        </a>
      </div>
    </div>
  );
};

export default AccountCard;
