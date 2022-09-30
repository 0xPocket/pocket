import { env } from 'config/env/client';
import { useCallback } from 'react';
import { useAccount } from 'wagmi';
import transakSDK from '@transak/transak-sdk';
import { useSession } from 'next-auth/react';

function useTransak() {
  const { address } = useAccount();
  const { data } = useSession();

  const showTransak = useCallback(() => {
    const transak = new transakSDK({
      apiKey: env.NEXT_PUBLIC_TRANSAK_API_KEY, // Your API Key
      environment: 'STAGING', // STAGING/PRODUCTION
      widgetHeight: '625px',
      widgetWidth: '500px',
      // Examples of some of the customization parameters you can pass
      disableWalletAddressForm: true,
      cryptoCurrencyCode: 'USDC',
      network: 'polygon', // Example 'polygon'
      walletAddress: address, // Your customer's wallet address
      themeColor: '0db0e9', // App theme color
      fiatCurrency: 'EUR', // If you want to limit fiat selection eg 'USD'
      email: data?.user?.email, // Your customer's email address
      redirectURL: '',
    });

    // !TODO: Find a better way (or check if update fixes this)
    transak.on(transak.EVENTS.TRANSAK_WIDGET_CLOSE, () => {
      setTimeout(() => {
        document.documentElement.style.removeProperty('overflow');
      }, 1);
    });

    transak.init();
  }, [data?.user, address]);

  return { showTransak };
}

export default useTransak;
