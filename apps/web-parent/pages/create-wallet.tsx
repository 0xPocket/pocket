import MainWrapper from '../components/wrappers/MainWrapper';
import CreateWalletForm from '../components/forms/CreateWalletForm';
import { useWallet } from '../contexts/wallet';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

type loginProps = {};

function CreateWallet({}: loginProps) {
  const { wallet } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (wallet) {
      router.push('/dashboard');
    }
  }, [wallet, router]);

  return (
    <MainWrapper noHeader>
      <section className="grid min-h-screen grid-cols-1">
        <div className="flex flex-col items-center justify-center gap-8 border-r text-dark">
          <CreateWalletForm />
        </div>
      </section>
    </MainWrapper>
  );
}

export default CreateWallet;
