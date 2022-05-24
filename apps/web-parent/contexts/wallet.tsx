import { createContext, useCallback, useContext, useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { UserParentWallet } from '.prisma/client';
import { AES, enc } from 'crypto-js';
import { Wallet } from 'ethers';

interface WalletProviderProps {
  children: React.ReactNode;
}

interface IWalletContext {
  wallet: IWallet | undefined;
  requestDecrypt: () => void;
  cancelDecrypt: () => void;
  decryptKey: (passwordHash: string) => string | null;
  decrypt: boolean;
}

interface IWallet {
  publicKey: string;
  encryptedPrivateKey: string;
  privateKey?: string;
}

export function createCtx<A extends {} | null>() {
  const ctx = createContext<A | undefined>(undefined);
  return [ctx, ctx.Provider] as const; // 'as const' makes TypeScript infer a tuple
}

const [WalletContext, WalletContextProvider] = createCtx<IWalletContext>();

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [wallet, setWallet] = useState<IWallet | undefined>();
  const [decrypt, setDecrypt] = useState(false);

  const { data } = useQuery<UserParentWallet>('wallet', async () => {
    const res = await axios.get('/api/wallet');
    setWallet({
      publicKey: res.data.publicKey,
      encryptedPrivateKey: res.data.privateKey,
    });
    return res.data;
  });

  const requestDecrypt = useCallback(() => {
    setDecrypt(true);
  }, []);

  const cancelDecrypt = useCallback(() => {
    setDecrypt(false);
  }, []);

  const decryptKey = (passwordHash: string) => {
    const decryptedPK = AES.decrypt(
      wallet?.encryptedPrivateKey!,
      passwordHash,
    ).toString(enc.Utf8);
    try {
      const wallet = new Wallet(decryptedPK);
      setDecrypt(false);
      setWallet((prev) => {
        return {
          ...prev,
          privateKey: decryptedPK,
        };
      });
      return wallet.privateKey;
    } catch (e) {
      console.log('invalid password');
    }
    return null;
  };

  return (
    <WalletContextProvider
      value={{
        wallet,
        requestDecrypt,
        cancelDecrypt,
        decryptKey,
        decrypt,
      }}
    >
      {children}
    </WalletContextProvider>
  );
};

export function useWallet() {
  const c = useContext<IWalletContext | undefined>(WalletContext);
  if (c === undefined)
    throw new Error('useCtx must be inside a Provider with a value');
  return c;
}
