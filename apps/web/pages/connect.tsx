import PageWrapper from '../components/common/wrappers/PageWrapper';
import TitleHelper from '../components/common/TitleHelper';
import ConnectProviderList from '../components/connect/ConnectProviderList';
import Link from 'next/link';
import FormattedMessage from '../components/common/FormattedMessage';

function Connect() {
  return (
    <PageWrapper>
      <TitleHelper id="titles.connect" />
      <div className="flex flex-col items-center">
        <div className="max-w-lg">
          <div
            className="mx-auto flex w-full flex-col justify-center gap-8 rounded-lg p-8
					text-center"
          >
            <ConnectProviderList />
          </div>
          <div className="mt-8 flex justify-center">
            <p className="inline-block">
              <FormattedMessage id="connect.noaccount" />
            </p>
            <Link href="/register">
              <a className="ml-2">
                <FormattedMessage id="connect.create" />
              </a>
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Connect;
