import { getCsrfToken } from 'next-auth/react';
import { useMutation } from 'react-query';
import { SiweMessage } from 'siwe';
import { useAccount, useNetwork, useSignMessage } from 'wagmi';

export function useEthereumSiwe() {
  const { signMessageAsync } = useSignMessage();
  const { address } = useAccount();
  const { chain } = useNetwork();

  return useMutation(async () => {
    const message = new SiweMessage({
      domain: window.location.host,
      address,
      statement: 'Sign this message to register to Pocket.',
      uri: window.location.origin,
      version: '1',
      chainId: chain?.id,
      nonce: await getCsrfToken(),
    });

    const signature = await signMessageAsync({
      message: message.prepareMessage(),
    });

    return {
      message,
      signature,
    };
  });
}
