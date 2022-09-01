import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';
import { env } from 'config/env/client';
import { useAccount } from 'wagmi';
import { useMagic } from '../contexts/auth';

function useRamp() {
  const { address } = useAccount();
  const { user } = useMagic();

  function showRamp() {
    new RampInstantSDK({
      hostLogoUrl: 'https://gopocket.fr/favicon.ico',
      url: 'https://ri-widget-staging.firebaseapp.com/',
      hostAppName: 'Pocket',
      fiatCurrency: 'EUR',
      fiatValue: '15',
      swapAsset: 'USDC',
      userAddress: address,
      userEmailAddress: user?.email || undefined,
      hostApiKey: 'fukzkzsk5wfybdp6d6rspmuq54utvo37wsd9uk9h',
      webhookStatusUrl: `${env.APP_URL}/api/webhook/ramp`,
    })
      .on('*', (event) => console.log(event))
      .show();
  }

  return { showRamp };
}

export default useRamp;
