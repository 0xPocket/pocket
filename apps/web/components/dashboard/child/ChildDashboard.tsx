import React from 'react';
import { useAccount } from 'wagmi';
import Swapper from './Swapper';
import { useSmartContract } from 'web/contexts/contract';
// import NftContent from 'web/components/dashboard/common/nft/NftContent';
// import TokenContent from 'web/components/dashboard/common/token/TokenContent';
import ActivityContent from 'web/components/dashboard/common/activity/ActivityContent';
import ChildCard from 'web/components/card/child/ChildCard';

const ChildDashboard: React.FC = () => {
  const { address } = useAccount();
  const { pocketContract } = useSmartContract();

  const eventFilter = pocketContract.filters[
    'FundsClaimed(uint256,address,uint256)'
  ](null, address, null);

  return address ? (
    <div className="space-y-20">
      <div className="grid grid-cols-2 gap-8">
        <ChildCard childAddress={address} className="col-span-1" />
        <Swapper />
        {/* <ChildCard childAddress={address} className="col-span-1" /> */}
      </div>
      <div className="grid grid-cols-2 gap-8">
        {/* <TokenContent childAddress={address!} /> */}
        {/* <NftContent childAddress={address!} fill_nbr={9} /> */}
        <ActivityContent
          childAddress={address!}
          eventFilter={eventFilter}
          rightHeader="Your claims"
        />
      </div>
    </div>
  ) : (
    <div></div>
  );
};

export default ChildDashboard;
