import { Tab } from '@headlessui/react';
import { ethers } from 'ethers';
import { useState } from 'react';

type RightTabProps = {
  config: any;
};

function RightTab({ config }: RightTabProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <Tab.Group defaultIndex={1} selectedIndex={selectedIndex}>
      <Tab.List className="hidden">
        <Tab>Tab 1</Tab>
        <Tab>Tab 2</Tab>
        <Tab>Tab 3</Tab>
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel>
          <div className="flex flex-col items-end justify-between space-y-4">
            <div className="flex flex-col items-end">
              <p>Balance</p>
              <span className="text-4xl">
                {config?.[1]
                  ? ethers.utils.formatUnits(config?.[1], 6).toString()
                  : 0}
                $
              </span>
              <p>usdc</p>
            </div>
            <div className="space-x-4">
              <button
                onClick={() => setSelectedIndex(1)}
                className="text-success"
              >
                add funds
              </button>
              <button onClick={() => setSelectedIndex(2)}>settings</button>
            </div>
          </div>
        </Tab.Panel>
        <Tab.Panel>
          <div className="flex flex-col items-end justify-between">
            <h1>Add funds</h1>
            <div>
              <button onClick={() => setSelectedIndex(0)}>return</button>
            </div>
          </div>
        </Tab.Panel>
        <Tab.Panel>
          <div className="flex flex-col items-end justify-between">
            <h1>Settings</h1>
            <div>
              <button onClick={() => setSelectedIndex(0)}>return</button>
            </div>
          </div>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}

export default RightTab;
