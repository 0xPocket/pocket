import TokenContent from '../common/token/TokenContent';
import NftContent from '../common/nft/NftContent';
import { UserChild } from '@lib/types/interfaces';
import ChildCard from '../../card/parent/ChildCard';
import ActivityContent from '../common/activity/ActivityContent';
import FormattedMessage from '../../common/FormattedMessage';
import { useAccount } from 'wagmi';
import AccountCard from '../../newcard/AccountCard';

type AccountDashboardProps = { child: UserChild };

function AccountDashboard({ child }: AccountDashboardProps) {
  const { address } = useAccount();

  return child.address ? (
    <div className="space-y-20">
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        <AccountCard child={child} />
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
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
