import PageWrapper from '../../components/common/wrappers/PageWrapper';
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import AccountDashboard from '../../components/dashboard/parent/Dashboard';
import { trpc } from '../../utils/trpc';
import FormattedMessage from '../../components/common/FormattedMessage';
import Breadcrumb from '../../components/common/Breadcrumb';
import TitleHelper from '../../components/common/TitleHelper';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.params?.id as string;

  return {
    props: {
      address: id,
    },
  };
}

function Account({
  address,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { isLoading, data: child } = trpc.useQuery([
    'parent.childByAddress',
    { address },
  ]);

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
