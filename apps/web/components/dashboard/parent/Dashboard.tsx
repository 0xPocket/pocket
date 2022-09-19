import TokenContent from '../common/token/TokenContent';
import NftContent from '../common/nft/NftContent';
import { UserChild } from '@lib/types/interfaces';
import ChildCard from '../../card/parent/ChildCard';
import ActivityContent from '../common/activity/ActivityContent';
import FormattedMessage from '../../common/FormattedMessage';
import { useAccount } from 'wagmi';

type AccountDashboardProps = { child: UserChild };

function AccountDashboard({ child }: AccountDashboardProps) {
  const { address } = useAccount();

  return child.address ? (
    <div className="space-y-20">
      <div className="grid grid-cols-6 gap-8">
        <ChildCard child={child} className="col-span-3" />
      </div>
      <div className="grid grid-cols-2 gap-8">
        <NftContent childAddress={child.address} fill_nbr={6} />
        {address && (
          <ActivityContent
            childAddress={child.address}
            parentAddress={address}
          />
        )}
      </div>
      <TokenContent childAddress={child.address} />
    </div>
  ) : (
    <>
      <FormattedMessage id="dashboard.parent.childAccountStatus" />
    </>
  );
}

export default AccountDashboard;
