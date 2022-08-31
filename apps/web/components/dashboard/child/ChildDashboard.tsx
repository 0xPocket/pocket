import React from 'react';
import { useAccount } from 'wagmi';
import NftContent from '../common/nft/NftContent';
import TokenContent from '../common/token/TokenContent';
import ActivityContent from '../common/activity/ActivityContent';
import ChildCard from '../../card/child/ChildCard';
import dynamic from 'next/dynamic';
import { SwapWidgetProps, Theme } from '@uniswap/widgets';
import { useTheme } from '@lib/ui/src/Theme/ThemeContext';
import Swapper from './Swapper';

const ChildDashboard: React.FC = () => {
  const { address } = useAccount();

  return address ? (
    <div className="space-y-20">
      <div className="grid grid-cols-2 gap-8">
        <ChildCard childAddress={address} className="col-span-1" />
        <div className="flex justify-center">
          <Swapper />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8">
        <NftContent childAddress={address!} fill_nbr={6} />
        <ActivityContent childAddress={address!} userType="Child" />
      </div>
      <TokenContent childAddress={address!} />
    </div>
  ) : (
    <div></div>
  );
};

export default ChildDashboard;
