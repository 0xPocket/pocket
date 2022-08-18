import React from 'react';
import { useAccount } from 'wagmi';
import { useSmartContract } from '../../../contexts/contract';
import NftContent from '../common/nft/NftContent';
import TokenContent from '../common/token/TokenContent';
import ActivityContent from '../common/activity/ActivityContent';
import ChildCard from '../../card/child/ChildCard';
import Swapper from './Swapper';


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
