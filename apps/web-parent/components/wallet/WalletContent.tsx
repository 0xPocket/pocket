import { Tab } from '@headlessui/react';
import { BigNumber } from 'ethers';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useSmartContract } from '../../contexts/contract';
import { roundBigNumbertoString } from '../../utils/reactQuery';
import SettingsTabPanel from './SettingsTabPanel';
import MainTabPanel from './MainTabPanel';
import { useWallet } from '../../contexts/wallet';
import { WalletAnimation } from '@lib/ui';
import { formatEther, formatUnits, parseUnits } from 'ethers/lib/utils';

type WalletContentProps = {};

function WalletContent({}: WalletContentProps) {
  const { provider, USDTContract, erc20Decimals } = useSmartContract();
  const { wallet } = useWallet();
  const balanceQuery = useQuery(
    'balance',
    async () => {
      const balance = await USDTContract!.balanceOf(wallet?.publicKey!);
      return balance;
    },
    {
      select: (data: BigNumber) => formatUnits(data, erc20Decimals),
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
                balanceQuery={balanceQuery}
                setSelectedIndex={setSelectedIndex}
              />
            </Tab.Panel>
            <Tab.Panel>
              <SettingsTabPanel setSelectedIndex={setSelectedIndex} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </WalletAnimation>
  );
}

export default WalletContent;
