import { useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useConnect } from 'wagmi';
import { MagicConnector } from '../utils/MagicConnector';

export function useMagicConnect() {
  const { connectors } = useConnect();

  const magicConnector: MagicConnector = useMemo(
    () => connectors.find((c) => c.id === 'magic'),
    [connectors],
  ) as MagicConnector;

  return useMutation(async (email: string) => {
    const magicSDK = magicConnector.getMagicSDK();

    await magicSDK?.auth.loginWithMagicLink({
      email,
    });
    const didToken = await magicSDK?.user.getIdToken();

    if (!didToken) {
      throw new Error('No DID token found.');
    }

    return didToken;
  });
}
