import MainWrapper from '../../components/wrappers/MainWrapper';
import { SectionContainer } from '@lib/ui';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import AccountDashboard from '../../components/dashboard/parent/Dashboard';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { trpc } from '../../utils/trpc';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.params?.id as string;

  return {
    props: {
      id,
    },
  };
}

function Account({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { isLoading, data: child } = trpc.useQuery([
    'parent.childById',
    { id },
  ]);

  return (
    <MainWrapper>
      <SectionContainer>
        <div className="mb-12 flex items-center space-x-4">
          <FontAwesomeIcon icon={faAngleRight} />
          <Link href="/">
            <a>dashboard</a>
          </Link>
          <p>{`>`}</p>
          <p>{child?.name}</p>
        </div>
        {isLoading ? (
          <>Loading</>
        ) : child ? (
          <AccountDashboard child={child} />
        ) : (
          <div>User not found</div>
        )}
      </SectionContainer>
    </MainWrapper>
  );
}

export default Account;
