import TokenContent from '../common/token/TokenContent';
import NftContent from '../common/nft/NftContent';
import { UserChild } from '@lib/types/interfaces';
import ChildCard from '../../card/parent/ChildCard';
import ActivityContent from '../common/activity/ActivityContent';

type AccountDashboardProps = { child: UserChild };

function AccountDashboard({ child }: AccountDashboardProps) {
  return child.address ? (
    <div className="space-y-20">
      <div className="grid grid-cols-6 gap-8">
        <ChildCard child={child} className="col-span-3" />
      </div>
      <div className="grid grid-cols-2 gap-8">
        <NftContent childAddress={child.address} fill_nbr={6} />

        <ActivityContent
          childAddress={child.address!}
          rightHeader="Your Topups"
        />
      </div>

      <TokenContent childAddress={child.address} />
    </div>
  ) : (
    <>Your child has not validated his account ! He should check his email...</>
  );
}

export default AccountDashboard;
