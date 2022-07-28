import MainWrapper from '../components/wrappers/MainWrapper';
import { Spinner } from '../components/common/Spinner';
import { useMagic } from '../contexts/auth';
import { Tab } from '@headlessui/react';
import ParentSignin from '../components/auth/ParentSignin';
import ChildSignin from '../components/auth/ChildSignin';

function Connect() {
  const { loading } = useMagic();

  if (loading) {
    return (
      <MainWrapper>
        <section className="flex min-h-[85vh] items-center justify-center">
          <Spinner />
        </section>
      </MainWrapper>
    );
  }

  return (
    <MainWrapper>
      <div className="mx-auto flex w-72 flex-col items-center justify-center gap-8">
        <Tab.Group>
          <Tab.List className="flex gap-4">
            <Tab className="container-classic px-4 py-2">Parent</Tab>
            <Tab className="container-classic px-4 py-2">Child</Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel className="mx-auto flex w-72 flex-col items-center justify-center gap-8">
              <ParentSignin />
            </Tab.Panel>
            <Tab.Panel className="mx-auto flex w-72 flex-col items-center justify-center gap-8">
              <ChildSignin />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </MainWrapper>
  );
}

export default Connect;
