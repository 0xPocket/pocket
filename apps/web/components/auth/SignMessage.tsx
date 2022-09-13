import { getCsrfToken } from 'next-auth/react';
import React from 'react';
import { SiweMessage } from 'siwe';
import { useAccount, useNetwork, useSignMessage } from 'wagmi';
import FormattedMessage from '../common/FormattedMessage';
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
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <button className="action-btn" onClick={() => siweSignMessage()}>
            {register ? (
              <FormattedMessage id="auth.wallet.connect" />
            ) : (
              <FormattedMessage id="auth.wallet.signMessage" />
            )}
          </button>
        </>
      )}
    </>
  );
};

export default SignMessage;
