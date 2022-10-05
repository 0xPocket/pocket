import Link from 'next/link';
import AccountStatus from './AccountStatus';
import RightTab from './RightTab';
import type { UserChild } from '@lib/types/interfaces';
import FormattedMessage from '../../common/FormattedMessage';
import LinkPolygonScan from '../common/LinkPolygonScan';
import MetaMaskProfilePicture from '../common/MetaMaskProfilePicture';

type ChildCardProps = {
  child: UserChild;
  polygonscanLink?: boolean;
  className?: string;
};

function ChildCard({
  child,
  polygonscanLink = false,
  className,
}: ChildCardProps) {
  return (
    <div
      className={`${className} container-classic grid min-h-[260px] grid-cols-2 rounded-lg p-8`}
    >
      <div className="flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-4">
            <MetaMaskProfilePicture address={child.address} />
            <div className="flex items-end space-x-4">
              <h1 className="max-w-fit whitespace-nowrap">{child.name}</h1>
              <AccountStatus status="ACTIVE" />
            </div>
          </div>
        </div>
        {polygonscanLink ? (
          <LinkPolygonScan address={child.address!} />
        ) : (
          <Link href={`/account/${child.address}`}>
            <a className="py-3">
              {
                <FormattedMessage
                  id="dashboard.parent.card.go-to"
                  values={{
                    name: child.name,
                  }}
                />
              }
            </a>
          </Link>
        )}
      </div>
      <RightTab child={child} />
    </div>
  );
}

export default ChildCard;
