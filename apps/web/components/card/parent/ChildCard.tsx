import Link from 'next/link';
import AccountStatus from './AccountStatus';
import RightTab from './RightTab';
import { UserChild } from '@lib/types/interfaces';
import FormattedMessage from '../../common/FormattedMessage';
import LinkPolygonScan from '../common/LinkPolygonScan';
import EmailStatus from './EmailStatus';

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
          <div className="flex space-x-4">
            <h1>{child?.name}</h1>
            <AccountStatus child={child} />
          </div>
        </div>
        {child?.child?.status !== 'ACTIVE' && <EmailStatus child={child} />}
        {child?.child?.status === 'ACTIVE' &&
          (polygonscanLink ? (
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
          ))}
      </div>
      {child?.child?.status === 'ACTIVE' && <RightTab child={child} />}
    </div>
  );
}

export default ChildCard;
