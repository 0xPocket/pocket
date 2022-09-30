import PageWrapper from '../components/common/wrappers/PageWrapper';
import FormattedMessage from '../components/common/FormattedMessage';
import TitleHelper from '../components/common/TitleHelper';
import ProviderList from '../components/connect/ProviderList';
import Link from 'next/link';

function Connect() {
  return (
    <PageWrapper>
      <TitleHelper id="titles.connect" />
      <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-8 text-center">
        <h1 className="mb-4">
          <FormattedMessage id="common.welcome" />
        </h1>
        <div className="container-classic rounded-lg p-8">
          <ProviderList />
        </div>
        <div className="flex gap-2 text-sm">
          <p>{"Don't have an account yet ?"}</p>

          <Link href="/register">Sign up</Link>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Connect;
