import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';
import { env } from 'config/env/client';
import { useCallback } from 'react';
import { useAccount } from 'wagmi';
import { useMagic } from '../contexts/auth';

function useRamp() {
  const { address } = useAccount();
  const { user } = useMagic();

  // console.log(env.NEXT_PUBLIC_APP_URL);
  const showRamp = useCallback(() => {
    new RampInstantSDK({
      hostLogoUrl:
        'https://pocket-eu.s3.eu-west-3.amazonaws.com/PocketLogoText.png',
      url:
        env.NEXT_PUBLIC_NETWORK !== 'polygon-mainnet'
          ? 'https://ri-widget-staging.firebaseapp.com/'
          : undefined,
      hostAppName: 'Pocket',
      fiatCurrency: 'EUR',
      swapAsset: 'MATIC_USDC',
      userAddress: address,
      userEmailAddress: user?.email || undefined,
      hostApiKey: 'fukzkzsk5wfybdp6d6rspmuq54utvo37wsd9uk9h',
      webhookStatusUrl: `${env.NEXT_PUBLIC_APP_URL}/api/webhook/ramp`,
    })
      .on('*', (event) => console.log(event))
      .show();
  }, [user, address]);

  return { showRamp };
}

export default useRamp;
