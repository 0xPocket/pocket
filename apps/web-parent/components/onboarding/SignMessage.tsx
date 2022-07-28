import { getCsrfToken } from 'next-auth/react';
import React from 'react';
import { SiweMessage } from 'siwe';
import { useAccount, useNetwork, useSignMessage } from 'wagmi';
import { Spinner } from '../common/Spinner';

type SignMessageProps = {
  register?: boolean;
  callback: (message: string, signature: string) => void;
};

const SignMessage: React.FC<SignMessageProps> = ({
  callback,
  register = false,
}) => {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { signMessageAsync, isLoading } = useSignMessage();

  const siweSignMessage = async () => {
    if (!address || !chain?.id) return;

    const message = new SiweMessage({
      domain: window.location.host,
      address,
      statement: 'Sign this message to access Pocket.',
      uri: window.location.origin,
      version: '1',
      chainId: chain?.id,
      nonce: await getCsrfToken(),
    });

    const signature = await signMessageAsync({
      message: message.prepareMessage(),
    });

    callback(JSON.stringify(message), signature);
  };

  return (
    <div className="flex w-96 flex-col items-center justify-center gap-2">
      {isLoading ? (
        <div className="flex w-48 justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <button
            className="relative flex w-48 flex-col items-center justify-center gap-4 rounded-lg border border-white-darker bg-[#161515]/25 p-4 font-sans font-bold hover:bg-[#161515]/75"
            disabled={isLoading}
            onClick={() => siweSignMessage()}
          >
            {register ? 'Link wallet' : 'Sign Message'}
          </button>
        </>
      )}
    </div>
  );
};

export default SignMessage;
