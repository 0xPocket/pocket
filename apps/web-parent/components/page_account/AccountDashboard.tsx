import TokenContent from '../../components/page_account/token/TokenContent';
import NftContent from '../../components/page_account/nft/NftContent';
import TransactionContent from '../../components/page_account/transaction/TransactionContent';
import { UserChild } from '@lib/types/interfaces';

import ChildCard from '../card/ChildCard';
type AccountDashboardProps = { child: UserChild };

function AccountDashboard({ child }: AccountDashboardProps) {
  return (
    <div className="space-y-20">
      <div className="grid grid-cols-2 gap-8">
        <ChildCard child={child} />
        <div className="flex flex-col justify-center gap-4">
          {/* <AddfundsForm child={child} />
          <ChildSettingsForm child={child} config={childConfig} /> */}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8">
        <NftContent child={child} />
        <TransactionContent />
      </div>
      <TokenContent child={child} />
    </div>
  );
}

export default AccountDashboard;
