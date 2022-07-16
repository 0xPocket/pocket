import { UserChild } from '@lib/types/interfaces';
import { useQuery } from 'react-query';
import { useAxios } from '../../hooks/axios.hook';
import MainWrapper from '../../components/wrappers/MainWrapper';
import { SectionContainer } from '@lib/ui';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import AccountDashboard from '../../components/page_account/AccountDashboard';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.query.id;

  return {
    props: {
      id: id,
    },
  };
}

function Account({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const axios = useAxios();

  const { isLoading, data: child } = useQuery<UserChild>(
    ['child', id],
    () =>
      axios
        .get<UserChild>('http://localhost:3000/api/users/children/' + id)
        .then((res) => {
          return res.data;
        }),
    {
      staleTime: 60 * 1000,
      retry: false,
    },
  );

  return (
    <MainWrapper authProtected>
      <SectionContainer>
        {isLoading ? (
          <>Loading</>
        ) : child ? (
          <AccountDashboard child={child} />
        ) : (
          <div>User not found</div>
        )}
        <div className="absolute right-[-700px] bottom-[-200px] -z-50 h-[1080px] w-[1920px] bg-dark-radial-herosection dark:opacity-10"></div>
      </SectionContainer>
    </MainWrapper>
  );
}

export default Account;
