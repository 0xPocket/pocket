import TokenContent from './token/TokenContent';
import NftContent from './nft/NftContent';
import ActivityContentParent from './activity/ActivityContentParent';
import { UserChild } from '@lib/types/interfaces';
import ChildCard from '../card/ChildCard';

type AccountDashboardProps = { child: UserChild };

function AccountDashboard({ child }: AccountDashboardProps) {
  return child.address ? (
    <div className="space-y-20">
      <div className="grid grid-cols-6 gap-8">
        <ChildCard child={child} className="col-span-3" />
      </div>
      <div className="grid grid-cols-2 gap-8">
        <NftContent childAddress={child.address} fill_nbr={9} />
        <ActivityContentParent childAddress={child.address} />
      </div>

      <TokenContent childAddress={child.address} />
    </div>
  ) : (
    <>You child has not validated his account ! He should check his email...</>
  );
}

export default AccountDashboard;
