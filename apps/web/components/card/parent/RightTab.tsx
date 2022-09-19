import { Tab } from '@headlessui/react';
import { UserChild } from '@lib/types/interfaces';
import { useMemo, useState } from 'react';
import { useContractWrite } from 'wagmi';
import { useSmartContract } from '../../../contexts/contract';
import { useAddFundsForm } from '../../../hooks/useAddFundsForm';
import { useChildSettingsForm } from '../../../hooks/useChildSettingsForm';
import FormattedMessage from '../../common/FormattedMessage';
import useContractRead from '../../../hooks/useContractRead';
import AddFundsForm from '../../forms/AddFundsForm';
import ChildSettingsForm from '../../forms/ChildSettingsForm';
import Balance from './Balance';
import { parseUnits } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';

type RightTabProps = {
  child: UserChild;
};

function RightTab({ child }: RightTabProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { pocketContract, erc20 } = useSmartContract();

  const { data: config, refetch: refetchConfig } = useContractRead({
    contract: pocketContract,
    functionName: 'childToConfig',
    args: [child.address!],
    enabled: !!child.address,
    watch: true,
  });

  const { approveAndAddChild, isLoading: isLoadingAddFunds } = useAddFundsForm(
    child,
    !!config?.lastClaim.isZero(),
    () => {
      refetchConfig();
      setSelectedIndex(0);
    },
  );

  const { changeConfig, isLoading: isLoadingChildSetting } =
    useChildSettingsForm(child.address, !!config?.lastClaim.isZero(), () => {
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
  }, [config]);

  if (!config) {
    return null;
  }

  return (
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
          <div className="flex h-full flex-col items-end justify-between">
            <Balance
              value={config?.balance}
              setSelectedIndex={setSelectedIndex}
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
  );
}

export default RightTab;
