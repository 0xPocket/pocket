import { UserChild } from '@lib/types/interfaces';
import { useQuery } from 'react-query';
import { useAxios } from '../../hooks/axios.hook';
import MainWrapper from '../../components/wrappers/MainWrapper';
import { SectionContainer } from '@lib/ui';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import ChildSettingsForm from '../../components/forms/ChildSettingsForm';
import AddfundsForm from '../../components/forms/AddfundsForm';

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
    'child',
    () =>
      axios
        .get<UserChild>('http://localhost:3000/api/users/children/' + id)
        .then((res) => res.data),
    { staleTime: 60 * 1000, retry: false },
  );

  return (
    <MainWrapper authProtected>
      <SectionContainer>
        {isLoading ? (
          <>Loading</>
        ) : child ? (
          <div>
            <div className="mb-8 flex justify-between">
              <div>
                <h1 className="mb-4">{child?.firstName}</h1>
                <h3>{child.email}</h3>
                <p>Status: {child.status}</p>
              </div>
              <div className="flex max-w-md flex-col items-end rounded-md bg-dark-light p-4">
                <span className="max-w-xs rounded-md bg-bright px-2 text-sm text-dark-light">
                  {child.web3Account?.address}
                </span>
                <p>Balance</p>
                <span className=" text-4xl">50</span>
                <span>usdc</span>
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <AddfundsForm child={child} />
              <ChildSettingsForm child={child} />
            </div>
            <div>
              <h2 className="mt-16  p-4">Overview</h2>
              <div className="grid  grid-cols-2 gap-8">
                <div className="h-60 bg-dark p-4 text-bright">
                  Wallet Content
                </div>
                <div className="h-60 bg-dark p-4 text-bright">History</div>
              </div>
            </div>
          </div>
        ) : (
          <div>User not found</div>
        )}
      </SectionContainer>
    </MainWrapper>
  );
}

export default Account;
