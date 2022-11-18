import { env } from 'config/env/client';
import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import transakSDK from '@transak/transak-sdk';
import { useSession } from 'next-auth/react';
import pusherJs from 'pusher-js';

export type TransakOrderStatus =
  | 'order_successful'
  | 'order_processing'
  | 'order_completed';

type ShowTransakParams = {
  address?: string;
};

function useIsMobile() {
  return typeof window !== 'undefined' && window.innerWidth < 768;
}

function useTransak() {
  const { address } = useAccount();
  const { data: session } = useSession();
  const [modalStatus, setModalStatus] = useState<'open' | 'closed'>('closed');
  const [orderStatus, setStatus] = useState<TransakOrderStatus>();
  const [orderId, setOrderId] = useState<string>();

  const isMobile = useIsMobile();

  useEffect(() => {
    const pusher = new pusherJs('1d9ffac87de599c61283', { cluster: 'ap2' });

    if (orderId) {
      const channel = pusher.subscribe(orderId);
      channel.bind('ORDER_PROCESSING', () => {
        setStatus('order_processing');
      });
      channel.bind('ORDER_COMPLETED', () => {
        setStatus('order_completed');
      });
    }
    return () => {
      pusher.disconnect();
    };
  }, [orderId]);

  const showTransak = useCallback(
    ({ address: targetAddress }: ShowTransakParams) => {
      if (!address || !session?.user?.email) {
        throw new Error('No address or email');
      }
      const transak = new transakSDK({
        apiKey: env.NEXT_PUBLIC_TRANSAK_API_KEY, // Your API Key
        environment:
          process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'STAGING', // STAGING/PRODUCTION
        widgetHeight: '625px',
        widgetWidth: isMobile ? '390px' : '500px',
        // fiatAmount: 50,
        defaultCryptoAmount: 50.01,
        defaultPaymentMethod: 'credit_debit_card',
        // Examples of some of the customization parameters you can pass
        disableWalletAddressForm: true,
        cryptoCurrencyCode: 'USDC',
        network: 'polygon', // Example 'polygon'
        walletAddress: targetAddress ? targetAddress : address, // Your customer's wallet address
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

      transak.on('TRANSAK_ORDER_SUCCESSFUL', (data) => {
        if (data.status.status === 'PROCESSING') {
          setStatus('order_successful');
          setOrderId(data.status.id);
          transak.close();
        }
      });

      transak.init();
    },
    [session?.user, address, isMobile],
  );

  return { state: modalStatus, status: orderStatus, showTransak };
}

export default useTransak;
