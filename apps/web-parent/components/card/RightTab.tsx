import { Tab } from '@headlessui/react';
import { UserChild } from '@lib/types/interfaces';
import { useState } from 'react';
import { erc20ABI, useAccount, useContractRead } from 'wagmi';
import { useSmartContract } from '../../contexts/contract';
import AddFundsForm from '../forms/AddFundsForm';
import ChildSettingsForm from '../forms/ChildSettingsForm';
import Balance from './Balance';
import TabAnimation from './TabAnimation';

type RightTabProps = {
  child: UserChild;
  config: any;
  hideActions?: boolean;
};

function RightTab({ child, config, hideActions = false }: RightTabProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { erc20Data } = useSmartContract();
  const { address } = useAccount();

  const { data: allowance } = useContractRead({
    addressOrName: erc20Data?.address!,
    functionName: 'allowance',
    contractInterface: erc20ABI,
    args: [address, process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!],
  });

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
            value={config?.[1]}
            setSelectedIndex={setSelectedIndex}
            hideActions={hideActions}
          />
          <AddFundsForm
            allowance={allowance}
            child={child}
            returnFn={() => setSelectedIndex(0)}
          />
          <ChildSettingsForm
            child={child}
            config={config}
            returnFn={() => setSelectedIndex(0)}
          />
        </TabAnimation>
      </Tab.Panels>
    </Tab.Group>
  );
}

export default RightTab;
