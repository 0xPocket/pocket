import { env } from 'config/env/client';
import { useCallback, useState } from 'react';
import { useAccount } from 'wagmi';
import transakSDK from '@transak/transak-sdk';
import { useSession } from 'next-auth/react';

type TransakStatus =
  | 'order_canceled'
  | 'order_created'
  | 'order_failed'
  | 'order_successful'
  | 'order_completed';

function useTransak() {
  const { address } = useAccount();
  const { data: session } = useSession();
  const [modalStatus, setModalStatus] = useState<'open' | 'closed'>('closed');
  const [orderStatus, setStatus] = useState<TransakStatus>();

  const showTransak = useCallback(() => {
    if (!address || !session?.user?.email) {
      throw new Error('No address or email');
    }
    const transak = new transakSDK({
      apiKey: env.NEXT_PUBLIC_TRANSAK_API_KEY, // Your API Key
      environment:
        process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'STAGING', // STAGING/PRODUCTION
      widgetHeight: '625px',
      widgetWidth: '500px',
      // fiatAmount: 50,
      defaultCryptoAmount: 30,
      defaultPaymentMethod: 'credit_debit_card',
      // Examples of some of the customization parameters you can pass
      disableWalletAddressForm: true,
      cryptoCurrencyCode: 'USDC',
      network: 'polygon', // Example 'polygon'
      walletAddress: address, // Your customer's wallet address
      themeColor: '0db0e9', // App theme color
      fiatCurrency: 'EUR', // If you want to limit fiat selection eg 'USD'
      email: session?.user?.email, // Your customer's email address
    });

    transak.on('TRANSAK_WIDGET_OPEN', () => {
      setModalStatus('open');
    });

    transak.on('TRANSAK_WIDGET_CLOSE', () => {
      setModalStatus('closed');
      setTimeout(() => {
        document.documentElement.style.removeProperty('overflow');
      }, 1);
    });

    transak.on('TRANSAK_ORDER_FAILED', () => {
      setStatus('order_failed');
    });

    transak.on('TRANSAK_ORDER_CANCELLED', () => {
      setStatus('order_canceled');
    });

    transak.on('TRANSAK_ORDER_CREATED', () => {
      setStatus('order_created');
    });

    transak.on('TRANSAK_ORDER_SUCCESSFUL', (data) => {
      if (data.status.status === 'COMPLETED') {
        setStatus('order_completed');
      } else {
        setStatus('order_successful');
      }
    });

    transak.init();
  }, [session?.user, address]);

  return { state: modalStatus, status: orderStatus, showTransak };
}

export default useTransak;
