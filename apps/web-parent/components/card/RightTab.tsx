import { Tab } from '@headlessui/react';
import { UserChild } from '@lib/types/interfaces';
import { ethers } from 'ethers';
import { useState } from 'react';
import AddfundsForm from '../forms/AddfundsForm';
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
          <AddfundsForm child={child} returnFn={() => setSelectedIndex(0)} />
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
