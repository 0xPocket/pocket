import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { trpc } from '../../../utils/trpc';
import FormattedMessage from '../../common/FormattedMessage';
import { Spinner } from '../../common/Spinner';
import MyAccountCard from './MyAccountCard';
import AccountCard from '../../newcard/AccountCard';
import PendingCard from '../../newcard/PendingCard';

function ParentDashboard() {
  const router = useRouter();

  const { isLoading, data } = trpc.parent.children.useQuery();
  const { isLoading: pendingChildrenLoading, data: pendingChildren } =
    trpc.parent.pendingChildren.useQuery();

  return (
    <div className="flex flex-col space-y-12">
      {/* <div className="flex items-center justify-between">
        <h1>
          <FormattedMessage id="wallet.myaccount" />
        </h1>
      </div>
      <MyAccountCard /> */}

      <div className="flex items-center justify-between">
        <h1>
          <FormattedMessage id="dashboard.title" />
        </h1>
      </div>
      {isLoading || pendingChildrenLoading ? (
        <Spinner />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <>
            {data?.map((child) => (
              <AccountCard child={child} key={child.id} />
            ))}
            {pendingChildren?.map((child) => (
              <PendingCard key={child.id} pendingChild={child} />
            ))}
            <div
              onClick={() => router.push('/add-account')}
              className="container-classic flex min-h-[190px] cursor-pointer items-center justify-center rounded-lg p-4 text-3xl opacity-60 transition-all hover:text-primary hover:opacity-100"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              <p>
                <FormattedMessage id="dashboard.addChild" />
              </p>
            </div>
          </>
        </div>
      )}
    </div>
  );
}

export default ParentDashboard;
