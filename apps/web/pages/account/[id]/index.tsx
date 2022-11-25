import PageWrapper from '../../../components/common/wrappers/PageWrapper';
import AccountDashboard from '../../../components/dashboard/parent/Dashboard';
import { trpc } from '../../../utils/trpc';
import FormattedMessage from '../../../components/common/FormattedMessage';
import Breadcrumb from '../../../components/common/Breadcrumb';
import TitleHelper from '../../../components/common/TitleHelper';
import { useRouter } from 'next/router';
import { Spinner } from '../../../components/common/Spinner';

function AccountProfile() {
  const router = useRouter();
  const id = router.query.id as string;

  const { isLoading, data: child } = trpc.parent.childByAddress.useQuery(
    { address: id },
    {
      enabled: !!id,
    },
  );

  return (
    <PageWrapper>
      <TitleHelper title={child?.name || 'Child'} />

      <Breadcrumb routes={child ? [{ name: child.name, path: null }] : []} />
      {isLoading ? (
        <>
          <Spinner />
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

export default AccountProfile;
