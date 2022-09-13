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
import { useAddFundsForm } from '../../../hooks/useAddFundsForm';
import { useChildSettingsForm } from '../../../hooks/useChildSettingsForm';

import type { ContractMethodReturn } from '../../../hooks/useContractRead';
import FormattedMessage from '../../common/FormattedMessage';
import AddFundsForm from '../../forms/AddFundsForm';
import ChildSettingsForm from '../../forms/ChildSettingsForm';
import Balance from './Balance';

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

  const { approveAndAddChild } = useAddFundsForm(
    child.address,
    !!config?.lastClaim.isZero(),
    () => {
      refetchConfig();
      setSelectedIndex(0);
    },
  );

  const { changeConfig } = useChildSettingsForm(
    child.address,
    !!config?.lastClaim.isZero(),
    () => {
      refetchConfig();
      setSelectedIndex(0);
    },
  );

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
          <FormattedMessage id="card.parent.piggyBank.balance" />
        </Tab>

        <Tab>
          <FormattedMessage id="card.parent.piggyBank.addFunds" />
        </Tab>

        <Tab>
          <FormattedMessage id="card.parent.piggyBank.settings" />
        </Tab>
      </Tab.List>
      <Tab.Panels as="div" className="h-full">
        <Tab.Panel as={'div'} className="h-full">
          <div className="flex h-full flex-col items-end justify-between">
            <Balance
              value={config?.balance}
              setSelectedIndex={setSelectedIndex}
              hideActions={hideActions}
            />
          </div>
        </Tab.Panel>
        <Tab.Panel as={'div'} className="h-full">
          <div className="flex h-full flex-col items-end justify-between">
            <AddFundsForm
              child={child}
              addFunds={approveAndAddChild}
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
              config={config}
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
