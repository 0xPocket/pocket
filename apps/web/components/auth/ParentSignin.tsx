import type { FC } from 'react';
import FormattedMessage from '../common/FormattedMessage';
import EmailSignin from './EmailSignin';
import EthereumSignin from './EthereumSignin';
// import SocialSignin from './SocialSignin';

const ParentSignin: FC = () => {
  return (
    <>
      <EmailSignin />
      <div className="flex w-72 items-center">
        <div className="w-full border-b opacity-25"></div>
        <h2 className="mx-2 text-lg font-bold">
          <FormattedMessage id="or" />
        </h2>
        <div className="w-full border-b opacity-25"></div>
      </div>
      <EthereumSignin type="Parent" />
    </>
  );
};

export default ParentSignin;
