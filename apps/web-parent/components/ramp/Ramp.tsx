import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';
import { useWallet } from '../../contexts/wallet';

type RampProps = {};

function Ramp({}: RampProps) {
  const { wallet } = useWallet();

  console.log(wallet?.publicKey);
  function showRamp() {
    new RampInstantSDK({
      hostLogoUrl:
        'https://www.planeteanimaux.com/wp-content/uploads/2021/12/Top-10-des-chiens-les-plus-mignons.jpg',
      url: 'https://ri-widget-staging.firebaseapp.com/',
      hostAppName: 'Pocket',
      fiatCurrency: 'EUR',
      fiatValue: '15',
      swapAsset: 'MATIC_ETH',
      userAddress: wallet?.publicKey,
      userEmailAddress: 'test@gmaiiil.com',
      hostApiKey: 'fukzkzsk5wfybdp6d6rspmuq54utvo37wsd9uk9h',
    })
      .on('*', (event) => console.log(event))
      .show();
  }

  return <button onClick={showRamp}>test</button>;
}

export default Ramp;
