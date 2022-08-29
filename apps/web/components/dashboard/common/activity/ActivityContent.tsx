import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tab } from '@headlessui/react';
import ActivityTabHeaders from './ActivityTabHeader';
import EventsTable from './EventsTable';
import { TransactionsTable } from './TransactionsTable';
import { useGetClaimsQuery } from '../../../../hooks/useGetClaimsQuery';
import { useTransactionsQuery } from '../../../../hooks/useTransactionsQuery';

type ActivityContentProps = {
  childAddress: string;
  rightHeader: string;
};

function ActivityContent({ childAddress, rightHeader }: ActivityContentProps) {
  const { isLoading: isTxLoading, data: txList } =
    useTransactionsQuery(childAddress);
  const { data: logs, isLoading: isLogLoading } =
    useGetClaimsQuery(childAddress);

  return (
    <div className="flex flex-grow-0 flex-col space-y-8">
      <Tab.Group>
        <div className="flex justify-between">
          <h2>Activity</h2>
          <ActivityTabHeaders
            leftHeader="Transactions"
            rightHeader={rightHeader}
          />
        </div>
        <Tab.Panels className="container-classic max-h-[600px] w-full overflow-scroll rounded-lg px-8 py-4">
          <Tab.Panel>
            {!isTxLoading && txList ? (
              <TransactionsTable transactionsList={txList} />
            ) : (
              <FontAwesomeIcon className="m-3 w-full" icon={faSpinner} spin />
            )}
          </Tab.Panel>

          <Tab.Panel>
            {!isLogLoading && logs ? (
              <EventsTable logs={logs} />
            ) : (
              <FontAwesomeIcon className="m-3 w-full" icon={faSpinner} spin />
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export default ActivityContent;
