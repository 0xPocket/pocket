import { Tab } from '@headlessui/react';
import ActivityTabHeaders from './ActivityTabHeader';
import EventsTable from './EventsTable';
import { TransactionsTable } from './TransactionsTable';
import { useGetClaimsQuery } from '../../../../hooks/useGetClaimsQuery';
import { useTransactionsQuery } from '../../../../hooks/useTransactionsQuery';
import FormattedMessage from '../../../common/FormattedMessage';
import { useGetDepositsQuery } from '../../../../hooks/useGetDepositsQuery';
import { Spinner } from '../../../common/Spinner';

type ActivityContentProps = {
  childAddress: string;
  parentAddress: string;
};

function ActivityContent({
  childAddress,
  parentAddress,
}: ActivityContentProps) {
  const { isLoading: isTxLoading, data: txList } =
    useTransactionsQuery(childAddress);
  const { data: claims, isLoading: isClaimsLoading } =
    useGetClaimsQuery(childAddress);
  const { data: deposits, isLoading: isDepositsLoading } = useGetDepositsQuery(
    childAddress,
    parentAddress,
  );

  return (
    <div className="flex flex-col space-y-8">
      <Tab.Group>
        <div className="flex justify-between">
          <h2>
            <FormattedMessage id="activity" />
          </h2>
          <ActivityTabHeaders
            leftHeader={<FormattedMessage id="transactions" />}
            rightHeader={<FormattedMessage id="account" />}
          />
        </div>
        <Tab.Panels className="container-classic relative flex-grow overflow-y-auto overflow-x-hidden rounded-lg px-8">
          <Tab.Panel>
            {!isTxLoading && txList ? (
              <TransactionsTable transactionsList={txList} />
            ) : (
              <Spinner />
            )}
          </Tab.Panel>

          <Tab.Panel>
            {!isClaimsLoading && !isDepositsLoading && claims && deposits ? (
              <EventsTable logs={[...claims, ...deposits]} />
            ) : (
              <Spinner />
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export default ActivityContent;
