import { useAuth } from '@lib/nest-auth/next';
import MainWrapper from '../components/wrappers/MainWrapper';
import SocialAuth from '../components/auth/SocialAuth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import SignUpForm from '../components/auth/SignUpForm';

type signinProps = {};

function SignUp({}: signinProps) {
  const router = useRouter();
  const { status } = useAuth();

  useEffect(() => {
    console.log(status);
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [router, status]);

  return (
    <MainWrapper noHeader>
      <section className="grid min-h-screen grid-cols-2">
        <div className="flex flex-col items-center justify-center gap-8 border-r bg-primary">
          <SignUpForm />
          <div className="flex w-72 items-center">
            <div className="w-full border-b"></div>
            <h2 className="m-4 font-bold">OR</h2>
            <div className="w-full border-b"></div>
          </div>
          <SocialAuth />
        </div>
        <div className="flex items-center justify-center">ILLU</div>
      </section>
    </MainWrapper>
  );
}

export default SignUp;
