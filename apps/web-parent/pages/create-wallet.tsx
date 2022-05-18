import MainWrapper from '../components/wrappers/MainWrapper';
import LoginForm from '../components/forms/LoginForm';
import { useRouter } from 'next/router';
import SocialAuth from '../components/auth/SocialAuth';
import CreateWalletForm from '../components/forms/CreateWalletForm';

type loginProps = {};

function CreateWallet({}: loginProps) {
  return (
    <MainWrapper noHeader>
      <section className="grid min-h-screen grid-cols-1">
        <div className="flex flex-col items-center justify-center gap-8 border-r bg-bright">
          <CreateWalletForm />
        </div>
      </section>
    </MainWrapper>
  );
}

export default CreateWallet;
