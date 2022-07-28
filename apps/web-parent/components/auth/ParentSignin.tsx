import type { FC } from 'react';
import EmailSignin from './EmailSignin';
import EthereumSignin from './EthereumSignin';
import SocialSignin from './SocialSignin';

const ParentSignin: FC = () => {
  return (
    <>
      <EmailSignin />
      <SocialSignin />
      <div className="flex w-72 items-center">
        <div className="w-full border-b opacity-25"></div>
        <h2 className="mx-2 text-lg font-bold">OR</h2>
        <div className="w-full border-b opacity-25"></div>
      </div>
      <EthereumSignin type="Parent" />
    </>
  );
};

export default ParentSignin;
