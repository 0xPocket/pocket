import type { UserChild } from '@lib/types/interfaces';
import { Tab } from '@headlessui/react';
import { useState } from 'react';
import { useContractRead } from 'wagmi';
import { useAddFundsForm } from '../../../hooks/useAddFundsForm';
import { useChildSettingsForm } from '../../../hooks/useChildSettingsForm';
import FormattedMessage from '../../common/FormattedMessage';
import AddFundsForm from './AddFundsForm';
import ChildSettingsForm from './ChildSettingsForm';
import MainPanel from './MainPanel';
import { PocketFaucetAbi } from 'pocket-contract/abi';
import { env } from 'config/env/client';

type ChildCardProps = {
  child: UserChild;
  polygonscanLink?: boolean;
  className?: string;
};

function ChildCard({
  child,
  polygonscanLink = false,
  className,
}: ChildCardProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [ceiling, setCeiling] = useState('0');
  const [periodicity, setPeriodicity] = useState('0');

  const { data: config, refetch: refetchConfig } = useContractRead({
    address: env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi: PocketFaucetAbi,
    functionName: 'childToConfig',
    args: [child.address!],
    enabled: !!child.address,
    onError(err) {
      console.error(err);
    },
    watch: true,
  });

  const { approveAndAddChild, isLoading: isLoadingAddFunds } = useAddFundsForm(
    child.address,
    !!config?.periodicity.isZero(),
    ceiling,
    periodicity,
    () => {
      refetchConfig();
      setSelectedIndex(0);
    },
  );

  const { changeConfig, isLoading: isLoadingChildSetting } =
    useChildSettingsForm(child.address, !!config?.periodicity.isZero(), () => {
      refetchConfig();
      setSelectedIndex(0);
    });

  // const { config: withdrawFundsFromChildConfig } = usePrepareContractWrite({
  //   address: env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  //   abi: PocketFaucetAbi,
  //   functionName: 'withdrawFundsFromChild',
  //   args: config && [config.balance, child.address],
  // });

  // const withdrawFundsFromChild = useContractWrite(withdrawFundsFromChildConfig);

  return (
    <div
      className={`${className} container-classic min-h-[260px] rounded-lg p-8`}
    >
      <Tab.Group
        defaultIndex={1}
        selectedIndex={selectedIndex}
        as="div"
        className="h-full"
      >
        <Tab.List className="hidden">
          <Tab>
            <FormattedMessage id="balance" />
          </Tab>

          <Tab>
            <FormattedMessage id="card.parent.piggyBank.addFunds" />
          </Tab>

          <Tab>
            <FormattedMessage id="settings" />
          </Tab>
        </Tab.List>
        <Tab.Panels as="div" className="h-full">
          <Tab.Panel as={'div'} className="h-full">
            <div className="flex h-full flex-col  justify-between">
              <MainPanel
                child={child}
                value={config?.balance}
                setSelectedIndex={setSelectedIndex}
                polygonScanLink={polygonscanLink}
              />
            </div>
          </Tab.Panel>
          <Tab.Panel as={'div'} className="h-full">
            <div className="flex h-full flex-col items-end justify-between">
              {config && (
                <AddFundsForm
                  child={child}
                  addFunds={approveAndAddChild}
                  isLoading={isLoadingAddFunds}
                  config={config}
                  periodicity={periodicity}
                  setCeiling={setCeiling}
                  setPeriodicity={setPeriodicity}
                  returnFn={() => {
                    setSelectedIndex(0);
                  }}
                />
              )}
            </div>
          </Tab.Panel>
          <Tab.Panel as={'div'} className="h-full">
            <div className="flex h-full flex-col items-end justify-between">
              {config && (
                <ChildSettingsForm
                  changeConfig={changeConfig}
                  config={config}
                  isLoading={isLoadingChildSetting}
                  returnFn={() => {
                    setSelectedIndex(0);
                  }}
                />
              )}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export default ChildCard;
