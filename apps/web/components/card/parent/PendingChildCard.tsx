import AccountStatus from './AccountStatus';
import EmailStatus from './EmailStatus';
import MetaMaskProfilePicture from '../common/MetaMaskProfilePicture';
import type { PendingChild } from '@lib/prisma';

type PendingChildCardProps = {
  child: PendingChild;
  className?: string;
};

function PendingChildCard({ child, className }: PendingChildCardProps) {
  return (
    <div
      className={`${className} container-classic grid min-h-[260px] grid-cols-2 rounded-lg p-8`}
    >
      <div className="flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-4">
            <MetaMaskProfilePicture />
            <div className="flex items-end space-x-4">
              <h1 className="max-w-fit whitespace-nowrap">{child.name}</h1>
              <AccountStatus email={child.email} status="INVITED" />
            </div>
          </div>
        </div>
        <EmailStatus child={child} />
      </div>
    </div>
  );
}

export default PendingChildCard;
