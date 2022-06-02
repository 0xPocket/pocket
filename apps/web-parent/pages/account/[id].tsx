import { UserChild } from '@lib/types/interfaces';
import { useQuery } from 'react-query';
import { useAxios } from '../../hooks/axios.hook';
import MainWrapper from '../../components/wrappers/MainWrapper';
import { SectionContainer } from '@lib/ui';
import { Tab } from '@headlessui/react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

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

  const { isLoading, data } = useQuery<UserChild>(
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
        ) : data ? (
          <div>
            <h1 className="mb-8"> {data?.firstName} </h1>
            <Tab.Group>
              <Tab.List className="mb-8 flex gap-4">
                <Tab className="border p-4">Overview</Tab>
                <Tab className="border p-4">Settings</Tab>
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel>
                  <div className="grid  grid-cols-2 gap-8">
                    <div className="h-60 bg-dark p-4 text-bright">
                      Wallet Content
                    </div>
                    <div className="h-60 bg-dark p-4 text-bright">History</div>
                  </div>
                </Tab.Panel>
                <Tab.Panel>
                  {/* <ChildSettingsForm child={child} /> */}
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        ) : (
          <>User not found</>
        )}
      </SectionContainer>
    </MainWrapper>
  );
}

export default Account;
