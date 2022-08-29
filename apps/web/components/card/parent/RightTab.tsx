import { Tab } from '@headlessui/react';
import { UserChild } from '@lib/types/interfaces';
import { Result } from 'ethers/lib/utils';
import { PocketFaucet } from 'pocket-contract/typechain-types';
import { useState } from 'react';
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from 'react-query/types/core/types';
import { useAccount } from 'wagmi';
import { useSmartContract } from '../../../contexts/contract';
import useContractRead, {
  ContractMethodReturn,
} from '../../../hooks/useContractRead';
import AddFundsForm from '../../forms/AddFundsForm';
import ChildSettingsForm from '../../forms/ChildSettingsForm';
import Balance from './Balance';
import TabAnimation from './TabAnimation';

type RightTabProps = {
  child: UserChild;
  config: ContractMethodReturn<PocketFaucet, 'childToConfig'> | undefined;
  hideActions?: boolean;
  refetchConfig: (
    options?: (RefetchOptions & RefetchQueryFilters) | undefined,
  ) => Promise<QueryObserverResult<Result, Error>>;
};

function RightTab({
  child,
  config,
  hideActions = false,
  refetchConfig,
}: RightTabProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { erc20 } = useSmartContract();
  const { address } = useAccount();

  const { data: allowance } = useContractRead({
    contract: erc20.contract,
    functionName: 'allowance',
    args: [address!, process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!],
    enabled: !!address,
  });

  const { data: balanceParent } = useContractRead({
    contract: erc20.contract,
    functionName: 'balanceOf',
    args: [address!],
    enabled: !!address,
    // cacheOnBlock: true,
  });

  console.log(config?.balance);
  console.log(child);
  console.log(config?.balance.toString());

  return (
    <Tab.Group
      defaultIndex={1}
      selectedIndex={selectedIndex}
      as="div"
      className="h-full"
    >
      <Tab.List className="hidden">
        <Tab>Balance</Tab>
        <Tab>Add Funds</Tab>
        <Tab>Settings</Tab>
      </Tab.List>
      <Tab.Panels as="div" className="h-full">
        <TabAnimation>
          <Balance
            value={config?.balance}
            setSelectedIndex={setSelectedIndex}
            hideActions={hideActions}
          />
          <AddFundsForm
            allowance={allowance}
            child={child}
            config={config}
            returnFn={() => {
              refetchConfig();
              setSelectedIndex(0);
            }}
            balance={balanceParent}
          />
          <ChildSettingsForm
            child={child}
            config={config}
            returnFn={() => {
              // refetch();
              setSelectedIndex(0);
            }}
          />
        </TabAnimation>
      </Tab.Panels>
    </Tab.Group>
  );
}

export default RightTab;
