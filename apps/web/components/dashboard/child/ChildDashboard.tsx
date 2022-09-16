import React from 'react';
import { useAccount } from 'wagmi';
import NftContent from '../common/nft/NftContent';
import TokenContent from '../common/token/TokenContent';
import ActivityContent from '../common/activity/ActivityContent';
import ChildCard from '../../card/child/ChildCard';
import Swapper from './Swapper';
import ClaimMaticModal from './ClaimMaticModal';
import { trpc } from '../../../utils/trpc';

const ChildDashboard: React.FC = () => {
  const { address } = useAccount();
  const { data } = trpc.useQuery(['auth.me']);

  return address ? (
    <div className="space-y-20">
      <div className="grid grid-cols-2 gap-8">
        <ChildCard childAddress={address} className="col-span-1" />
        <Swapper />
      </div>
      <div className="grid grid-cols-2 gap-8">
        <NftContent childAddress={address!} fill_nbr={6} />
        {data?.child?.parent?.user.address && (
          <ActivityContent
            childAddress={address!}
            parentAddress={data?.child?.parent?.user.address}
          />
        )}
      </div>
      <TokenContent childAddress={address!} />
      <ClaimMaticModal />
    </div>
  ) : (
    <div></div>
  );
};

export default ChildDashboard;
