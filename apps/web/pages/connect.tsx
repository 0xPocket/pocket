import MainWrapper from '../components/wrappers/MainWrapper';
import { Spinner } from '../components/common/Spinner';
import { useMagic } from '../contexts/auth';
import { Tab } from '@headlessui/react';
import ParentSignin from '../components/auth/ParentSignin';
import ChildSignin from '../components/auth/ChildSignin';
import { Fragment } from 'react';

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
      <div className="mx-auto flex max-w-sm flex-col items-center justify-center gap-8 text-center">
        <h1 className="mb-4">Welcome to Pocket !</h1>
        <Tab.Group>
          <Tab.List className="flex gap-8">
            <Tab as={Fragment}>
              {({ selected }) => (
                <button className={` ${!selected && 'opacity-40'}`}>
                  {`I'm a parent`}
                </button>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({ selected }) => (
                <button className={`${!selected && 'opacity-40'}`}>
                  {`I'm a child`}
                </button>
              )}
            </Tab>
          </Tab.List>
          <Tab.Panels className="container-classic rounded-lg p-8">
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
