import MainWrapper from '../../components/common/wrappers/MainWrapper';
import AccountDashboard from '../../components/dashboard/parent/Dashboard';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { trpc } from '../../utils/trpc';
import FormattedMessage from '../../components/common/FormattedMessage';
import { useRouter } from 'next/router';

function Account() {
  const router = useRouter();
  const id = router.query.id as string;

  const { isLoading, data: child } = trpc.useQuery(
    ['parent.childByAddress', { address: id }],
    {
      enabled: !!id,
    },
  );

  if (!child) return null;

  return (
    <MainWrapper>
      <div className="mb-12 flex items-center space-x-4">
        <FontAwesomeIcon icon={faAngleRight} />
        <Link href="/">
          <a>
            <FormattedMessage id="route.dashboard" />
          </a>
        </Link>
        <p>{`>`}</p>
        <p>{child?.name}</p>
      </div>
      {isLoading ? (
        <>
          <FormattedMessage id="loading" />
        </>
      ) : child ? (
        <AccountDashboard child={child} />
      ) : (
        <div>
          <FormattedMessage id="account.not-found" />
        </div>
      )}
    </MainWrapper>
  );
}

export default Account;
