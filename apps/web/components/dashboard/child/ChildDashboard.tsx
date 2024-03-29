import React from 'react';
import { useAccount } from 'wagmi';
import NftContent from '../common/nft/NftContent';
import TokenContent from '../common/token/TokenContent';
import ActivityContent from '../common/activity/ActivityContent';
import ChildCard from '../../card/child/ChildCard';
import Swapper from './Swapper';
import { Spinner } from '../../common/Spinner';
import { trpc } from '../../../utils/trpc';
import InviteParentForm from './InviteParentForm';

const ChildDashboard: React.FC = () => {
  const { address } = useAccount();

  const { data, isLoading } = trpc.child.getParent.useQuery();

  if (!address || isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!data) {
    return <InviteParentForm />;
  }

  return (
    <div className="space-y-20">
      <div className="grid grid-cols-6 gap-8">
        <ChildCard
          childAddress={address}
          className="col-span-6 lg:col-span-3"
        />
        <Swapper />
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <NftContent childAddress={address!} fill_nbr={6} />

        <ActivityContent
          childAddress={address!}
          parentAddress={data?.address}
        />
      </div>
      <TokenContent childAddress={address!} />
    </div>
  );
};

export default ChildDashboard;
