import { UserChild } from '@lib/types/interfaces';
import { useQuery } from 'react-query';
import { useAxios } from '../../hooks/axios.hook';
import MainWrapper from '../../components/wrappers/MainWrapper';
import { SectionContainer } from '@lib/ui';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import ChildSettingsForm from '../../components/forms/ChildSettingsForm';

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
        .get<UserChild>('http://localhost:5000/users/children/' + id)
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
                <h1>{child?.firstName}</h1>
                <h3>{child.email}</h3>
                <h3>{child.web3Account?.address}</h3>
                <p>Status: </p>
              </div>
              <div className="flex flex-col items-end">
                <p>Available funds</p>
                <span className=" text-4xl">50</span>
                <span>usdc</span>
              </div>
            </div>
            <ChildSettingsForm child={child} />
            <div>
              <h2 className="mt-16 border p-4">Overview</h2>
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
