import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';
import { useWallet } from '../contexts/wallet';

type RampProps = {};

function useRamp({}: RampProps) {
  const { wallet } = useWallet();

  function showRamp() {
    new RampInstantSDK({
      hostLogoUrl:
        'https://gopocket.fr/favicon.ico',
      url: 'https://ri-widget-staging.firebaseapp.com/',
      hostAppName: 'Pocket',
      fiatCurrency: 'EUR',
      fiatValue: '15',
      // swapAsset: 'MUMBAI_USDC',
      userAddress: wallet?.publicKey,
      userEmailAddress: 'test@gmail.com',
      hostApiKey: 'fukzkzsk5wfybdp6d6rspmuq54utvo37wsd9uk9h',
    })
      .on('*', (event) => console.log(event))
      .show();
  }

  return { showRamp };
}

export default useRamp;
