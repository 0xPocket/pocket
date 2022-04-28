import MainWrapper from '../components/wrappers/MainWrapper';
import LoginForm from '../components/forms/LoginForm';
import Button from '../components/common/Button';
import Image from 'next/image';
import { useAuth } from '@lib/nest-auth/next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

type loginProps = {};
type formProps = {};

function Login({}: loginProps) {
  const handleFacebookLogIn = () => {};
  const handleGoogleLogIn = () => {};

  const router = useRouter();
  const { status, signIn } = useAuth();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [router, status]);

  return (
    <MainWrapper header={false}>
      <section className="grid min-h-screen grid-cols-2">
        <div className="flex flex-col items-center justify-center gap-8 border-r bg-primary">
          <LoginForm />
          <div className="flex w-72 items-center">
            <div className="w-full border-b"></div>
            <h2 className="m-4 font-bold">OR</h2>
            <div className="w-full border-b"></div>
          </div>
          <div className="flex flex-col gap-4">
            <Button action={() => signIn('google')}>
              <div className="absolute -left-2 opacity-30">
                <Image
                  src="/assets/social_icons/google.svg"
                  height={60}
                  width={60}
                  alt="Google social icon"
                />
              </div>
              <span className="ml-6">Connect with Google</span>
            </Button>
            <Button action={() => signIn('facebook')}>
              <div className="absolute -left-2 opacity-30">
                <Image
                  src="/assets/social_icons/facebook.svg"
                  height={60}
                  width={60}
                  alt="Facebook social icon"
                />
              </div>
              <span className="ml-6">Connect with Facebook</span>
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center">ILLU</div>
      </section>
    </MainWrapper>
  );
}

export default Login;
