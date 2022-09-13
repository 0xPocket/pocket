import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tab } from '@headlessui/react';
import ActivityTabHeaders from './ActivityTabHeader';
import EventsTable from './EventsTable';
import { TransactionsTable } from './TransactionsTable';
import { useGetClaimsQuery } from '../../../../hooks/useGetClaimsQuery';
import { useTransactionsQuery } from '../../../../hooks/useTransactionsQuery';
import FormattedMessage from '../../../common/FormattedMessage';

type ActivityContentProps = {
  childAddress: string;
  userType: string;
};

function ActivityContent({ childAddress, userType }: ActivityContentProps) {
  const { isLoading: isTxLoading, data: txList } =
    useTransactionsQuery(childAddress);
  const { data: logs, isLoading: isLogLoading } = useGetClaimsQuery(
    childAddress,
    userType,
  );

  return (
    <div className="flex flex-col space-y-8">
      <Tab.Group>
        <div className="flex justify-between">
          <h2>
            <FormattedMessage id="dashboard.common.activity.title" />
          </h2>
          <ActivityTabHeaders
            leftHeader={
              <FormattedMessage id="dashboard.child.claimMatic.claim" />
            }
            rightHeader={
              <FormattedMessage
                id={
                  userType === 'Parent'
                    ? 'dashboard.common.activity.header.topup'
                    : 'dashboard.common.activity.header.claim'
                }
              />
            }
          />
        </div>
        <Tab.Panels className="container-classic relative flex-grow overflow-x-hidden overflow-y-scroll rounded-lg px-8">
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
