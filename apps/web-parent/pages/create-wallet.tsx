import MainWrapper from '../components/wrappers/MainWrapper';
import CreateWalletForm from '../components/forms/CreateWalletForm';
import { useWallet } from '../contexts/wallet';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

function CreateWallet() {
  const { wallet } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (wallet?.publicKey) {
      router.push('/dashboard');
    }
  }, [wallet, router]);

  return (
    <MainWrapper noHeader>
      <section className="grid min-h-screen grid-cols-1">
        <div className="flex flex-col items-center justify-center gap-8 border-r text-dark">
          <p className="font-sans text-2xl font-bold text-white">
            CREATE YOUR WALLET
          </p>
          <CreateWalletForm />
        </div>
      </section>
    </MainWrapper>
  );
}

export default CreateWallet;
