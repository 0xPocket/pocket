import PageWrapper from '../components/common/wrappers/PageWrapper';
import TitleHelper from '../components/common/TitleHelper';
import ConnectProviderList from '../components/connect/ConnectProviderList';
import Link from 'next/link';
import FormattedMessage from '../components/common/FormattedMessage';

function Connect() {
  return (
    <PageWrapper>
      <TitleHelper id="titles.connect" />
      <div className="mt-28 flex flex-col items-center">
        <h1 className="mb-8 text-center">
          <FormattedMessage id="connect.chose" />
        </h1>

        <div className="w-[512px]">
          <div
            className="mx-auto flex w-full flex-col justify-center gap-8 rounded-lg p-8
					text-center"
          >
            <ConnectProviderList />
          </div>
          <div className="mt-4 flex justify-center gap-2">
            <p>
              <FormattedMessage id="connect.noaccount" />
            </p>
            <Link href="/register">
              <a>
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
