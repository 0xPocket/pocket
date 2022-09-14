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
      hostLogoUrl: 'https://gopocket.fr/favicon.ico',
      url: 'https://ri-widget-staging.firebaseapp.com/',
      hostAppName: 'Pocket',
      fiatCurrency: 'EUR',
      fiatValue: '15',
      swapAsset: 'MATIC_USDC',
      userAddress: address,
      userEmailAddress: user?.email || undefined,
      hostApiKey: 'fukzkzsk5wfybdp6d6rspmuq54utvo37wsd9uk9h',
      webhookStatusUrl: `${env.NEXT_PUBLIC_APP_URL}/api/webhook/ramp`,
    })
      .on('*', (event) => console.log(event))
      .show();
  }, [user]);

  return { showRamp };
}

export default useRamp;
