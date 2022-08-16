import TokenContent from '../common/token/TokenContent';
import NftContent from '../common/nft/NftContent';
import { UserChild } from '@lib/types/interfaces';
import ChildCard from '../../card/parent/ChildCard';
import ActivityContent from '../common/activity/ActivityContent';
import { useSmartContract } from '../../../contexts/contract';
import { useAccount } from 'wagmi';

type AccountDashboardProps = { child: UserChild };

function AccountDashboard({ child }: AccountDashboardProps) {
  const { pocketContract } = useSmartContract();
  const { address } = useAccount();

  const eventFilter = pocketContract.filters[
    'FundsAdded(uint256,address,uint256,address)'
  ](null, address, null, child.address);

  return child.address ? (
    <div className="space-y-20">
      <div className="grid grid-cols-6 gap-8">
        <ChildCard child={child} className="col-span-3" cursor={false}/>
      </div>
      <div className="grid grid-cols-2 gap-8">
        <NftContent childAddress={child.address} fill_nbr={9} />

        <ActivityContent
          childAddress={child.address!}
          eventFilter={eventFilter}
          rightHeader="Your Topups"
        />
      </div>

      <TokenContent childAddress={child.address} />
    </div>
  ) : (
    <>You child has not validated his account ! He should check his email...</>
  );
}

export default AccountDashboard;
