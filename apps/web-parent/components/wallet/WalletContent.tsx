import { Tab } from '@headlessui/react';
import { useAuth } from '@lib/nest-auth/next';
import { UserParent } from '@lib/types/interfaces';
import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useSmartContract } from '../../contexts/contract';
import { roundBigNumbertoString } from '../../utils/reactQuery';
import SettingsTabPanel from './SettingsTabPanel';
import MainTabPanel from './MainTabPanel';
import { animated, useSpring } from 'react-spring';

type WalletContentProps = {
  open: boolean;
};

function WalletContent({ open }: WalletContentProps) {
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

  /**
   * ANIMATION
   */
  const [spring, api] = useSpring(() => ({}));
  useEffect(() => {
    api.start({
      from: { opacity: 0, scale: 0 },
      to: { opacity: 1, scale: 1 },
      config: {
        mass: 0.7,
        tension: 251,
        friction: 21,
        velocity: 0.021,
      },
    });
    console.log('ici');
  }, [open, api]);

  return (
    <animated.div
      className="w-[400px] rounded-lg bg-bright py-4 px-8 shadow-lg"
      style={spring}
    >
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
            <SettingsTabPanel setSelectedIndex={setSelectedIndex} user={user} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </animated.div>
  );
}

export default WalletContent;
