import React from 'react';
import { useAccount } from 'wagmi';
import NftContent from '../common/nft/NftContent';
import TokenContent from '../common/token/TokenContent';
import ActivityContent from '../common/activity/ActivityContent';
import ChildCard from '../../card/child/ChildCard';
import dynamic from 'next/dynamic';
import { SwapWidgetProps } from '@uniswap/widgets';

const SwapWidget = dynamic<SwapWidgetProps>(
  () => import('@uniswap/widgets').then((mod) => mod.SwapWidget),
  { ssr: false },
);
const ChildDashboard: React.FC = () => {
  const { address } = useAccount();

  return address ? (
    <div className="space-y-20">
      <div className="grid grid-cols-2 gap-8">
        <ChildCard childAddress={address} className="col-span-1" />
        <SwapWidget />
      </div>
      <div className="grid grid-cols-2 gap-8">
        <NftContent childAddress={address!} fill_nbr={9} />
        <ActivityContent childAddress={address!} userType="Child" />
      </div>
      <TokenContent childAddress={address!} />
    </div>
  ) : (
    <div></div>
  );
};

export default ChildDashboard;
