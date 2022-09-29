import PageWrapper from '../../components/common/wrappers/PageWrapper';
import AccountDashboard from '../../components/dashboard/parent/Dashboard';
import { trpc } from '../../utils/trpc';
import FormattedMessage from '../../components/common/FormattedMessage';
import Breadcrumb from '../../components/common/Breadcrumb';
import TitleHelper from '../../components/common/TitleHelper';
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
    <PageWrapper>
      <TitleHelper title={child.name!} />

      <Breadcrumb routes={[{ name: child.name!, path: null }]} />
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
    </PageWrapper>
  );
}

export default Account;
