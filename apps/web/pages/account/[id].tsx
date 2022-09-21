import MainWrapper from '../../components/common/wrappers/MainWrapper';
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import AccountDashboard from '../../components/dashboard/parent/Dashboard';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { trpc } from '../../utils/trpc';
import FormattedMessage from '../../components/common/FormattedMessage';

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
