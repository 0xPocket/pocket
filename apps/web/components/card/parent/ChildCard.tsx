import type { UserChild } from '@lib/types/interfaces';
import { Tab } from '@headlessui/react';
import { useMemo, useState } from 'react';
import { useContractWrite } from 'wagmi';
import { useSmartContract } from '../../../contexts/contract';
import { useAddFundsForm } from '../../../hooks/useAddFundsForm';
import { useChildSettingsForm } from '../../../hooks/useChildSettingsForm';
import FormattedMessage from '../../common/FormattedMessage';
import AddFundsForm from './AddFundsForm';
import ChildSettingsForm from './ChildSettingsForm';
import { parseUnits } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';
import MainPanel from './MainPanel';
import useContractRead from '../../../hooks/useContractRead';

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

  const { pocketContract, erc20 } = useSmartContract();

  const { data: config, refetch: refetchConfig } = useContractRead({
    contract: pocketContract,
    functionName: 'childToConfig',
    args: [child.address!],
    enabled: !!child.address,
    onError(err) {
      console.error(err);
    },
    watch: true,
  });

  const { approveAndAddChild, isLoading: isLoadingAddFunds } = useAddFundsForm(
    child,
    !!config?.periodicity.isZero(),
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

  const { write: withdrawFundsFromChild } = useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: pocketContract.address,
    functionName: 'withdrawFundsFromChild',
    contractInterface: pocketContract.interface,
    args: [config?.balance, child.address],
  });

  const initialConfig = useMemo(() => {
    return {
      periodicity:
        config && !config.periodicity.isZero()
          ? config.periodicity
          : BigNumber.from(child.child?.initialPeriodicity),
      ceiling:
        config && !config.ceiling.isZero()
          ? config.ceiling
          : parseUnits(
              child.child!.initialCeiling!.toString(),
              erc20.data?.decimals,
            ),
    };
  }, [config, erc20, child]);

  if (!config) {
    return null;
  }

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
              <AddFundsForm
                child={child}
                addFunds={approveAndAddChild}
                isLoading={isLoadingAddFunds}
                returnFn={() => {
                  setSelectedIndex(0);
                }}
              />
            </div>
          </Tab.Panel>
          <Tab.Panel as={'div'} className="h-full">
            <div className="flex h-full flex-col items-end justify-between">
              <ChildSettingsForm
                changeConfig={changeConfig}
                initialConfig={initialConfig}
                config={config}
                withdrawFundsFromChild={withdrawFundsFromChild}
                isLoading={isLoadingChildSetting}
                returnFn={() => {
                  setSelectedIndex(0);
                }}
              />
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export default ChildCard;
