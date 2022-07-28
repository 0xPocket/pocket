import TokenContent from './token/TokenContent';
import NftContent from './nft/NftContent';
import TransactionContent from './transaction/TransactionContent';
import { UserChild } from '@lib/types/interfaces';
import ChildCard from '../card/ChildCard';

type AccountDashboardProps = { child: UserChild };

function AccountDashboard({ child }: AccountDashboardProps) {
  return (
    <div className="space-y-20">
      <div className="grid grid-cols-6 gap-8">
        <ChildCard child={child} className="col-span-3" />
      </div>
      <div className="grid grid-cols-2 gap-8">
        <NftContent child={child} fill_nbr={9} />
        <TransactionContent />
      </div>
      <TokenContent child={child} />
    </div>
  );
}

export default AccountDashboard;
