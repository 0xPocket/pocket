import MainWrapper from '../../components/common/wrappers/MainWrapper';
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import AccountDashboard from '../../components/dashboard/parent/Dashboard';
import { trpc } from '../../utils/trpc';
import FormattedMessage from '../../components/common/FormattedMessage';
import Breadcrumb from '../../components/common/Breadcrumb';

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
    <MainWrapper>
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
    </MainWrapper>
  );
}

export default Account;
