import PageWrapper from '../components/common/wrappers/PageWrapper';
import { Spinner } from '../components/common/Spinner';
import { useMagic } from '../contexts/auth';
import { Tab } from '@headlessui/react';
import ParentSignin from '../components/auth/ParentSignin';
import ChildSignin from '../components/auth/ChildSignin';
import { Fragment, useEffect } from 'react';
import { useRouter } from 'next/router';
import FormattedMessage from '../components/common/FormattedMessage';
import TitleHelper from '../components/common/TitleHelper';

function Connect() {
  const { loading, loggedIn } = useMagic();
  const router = useRouter();

  useEffect(() => {
    if (!loading && loggedIn) {
      router.push('/');
    }
  }, [loading, loggedIn, router]);

  if (loading) {
    return (
      <PageWrapper>
        <section className="flex min-h-[85vh] items-center justify-center">
          <Spinner />
        </section>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <TitleHelper id="titles.connect" />
      <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-8 text-center">
        <h1 className="mb-4">
          <FormattedMessage id="common.welcome" />
        </h1>
        <Tab.Group>
          <Tab.List className="flex gap-8">
            <Tab as={Fragment}>
              {({ selected }) => (
                <button className={`${!selected && 'opacity-40'}`}>
                  <FormattedMessage id="connect.parent" />
                </button>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({ selected }) => (
                <button className={`${!selected && 'opacity-40'}`}>
                  <FormattedMessage id="connect.child" />
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
    </PageWrapper>
  );
}

export default Connect;
