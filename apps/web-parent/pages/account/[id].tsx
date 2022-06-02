import { useRouter } from 'next/router';
import { UserChild } from '@lib/types/interfaces';
import { useQuery } from 'react-query';
import { useAxios } from '../../hooks/axios.hook';
import MainWrapper from '../../components/wrappers/MainWrapper';
import { SectionContainer } from '@lib/ui';
import { Tab } from '@headlessui/react';

type AccountProps = {};

function Account({}: AccountProps) {
  const axios = useAxios();
  const router = useRouter();

  const { id } = router.query;

  // const { isLoading, data } = useQuery(
  //   'child',
  //   () =>
  //     axios
  //       .get<UserChild[]>('http://localhost:5000/users/child/children')
  //       .then((res: { data: UserChild[] }) => res.data),
  //   { staleTime: 60 * 1000 },
  // );
  return (
    <MainWrapper authProtected>
      <SectionContainer>
        <div>
          <h1> {id} </h1>
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
              <Tab.Panel>{/* <ChildSettingsForm child={child} /> */}</Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </SectionContainer>
    </MainWrapper>
  );
}

export default Account;
