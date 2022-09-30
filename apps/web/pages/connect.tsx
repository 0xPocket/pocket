import PageWrapper from '../components/common/wrappers/PageWrapper';
import FormattedMessage from '../components/common/FormattedMessage';
import TitleHelper from '../components/common/TitleHelper';
import EmailSignin from '../components/auth/EmailSignin';
import EthereumSignin from '../components/auth/EthereumSignin';

function Connect() {
  return (
    <PageWrapper>
      <TitleHelper id="titles.connect" />
      <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-8 text-center">
        <h1 className="mb-4">
          <FormattedMessage id="common.welcome" />
        </h1>
        <div className="container-classic rounded-lg p-8">
          <div className="mx-auto flex w-72 flex-col items-center justify-center gap-8">
            {/* <EmailSignin /> */}
            {/* <div className="flex w-72 items-center">
              <div className="w-full border-b opacity-25"></div>
              <h2 className="mx-2 text-lg font-bold">
                <FormattedMessage id="or" />
              </h2>
              <div className="w-full border-b opacity-25"></div>
            </div> */}
            <EthereumSignin type="Parent" />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Connect;
