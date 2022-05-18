import { Tab } from '@headlessui/react';
import { useAuth } from '@lib/nest-auth/next';
import { UserParent } from '@lib/types/interfaces';
import { BigNumber } from 'ethers';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useSmartContract } from '../../contexts/contract';
import { roundBigNumbertoString } from '../../utils/reactQuery';
import SettingsTabPanel from './SettingsTabPanel';
import MainTabPanel from './MainTabPanel';
import WalletAnimation from '../animations/WalletAnimation';

type WalletContentProps = {};

function WalletContent({}: WalletContentProps) {
  const { user } = useAuth<UserParent>();
  const { provider } = useSmartContract();
  const balanceQuery = useQuery(
    'balance',
    async () => await provider?.getBalance(user?.wallet.publicKey!),
    {
      select: (data: BigNumber | undefined) => roundBigNumbertoString(data, 2),
    },
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <WalletAnimation>
      <div className="w-[400px] rounded-lg bg-bright py-4 px-8 shadow-lg dark:bg-dark-light">
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List className="hidden">
            <Tab>My Wallet</Tab>
            <Tab>Settings</Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <MainTabPanel
                user={user}
                balanceQuery={balanceQuery}
                setSelectedIndex={setSelectedIndex}
              />
            </Tab.Panel>
            <Tab.Panel>
              <SettingsTabPanel
                setSelectedIndex={setSelectedIndex}
                user={user}
              />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </WalletAnimation>
  );
}

export default WalletContent;
