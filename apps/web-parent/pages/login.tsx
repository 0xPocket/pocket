import MainWrapper from '../components/wrappers/MainWrapper';
import LoginForm from '../components/forms/LoginForm';
import { useAuth } from '@lib/nest-auth/next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import SocialAuth from '../components/auth/SocialAuth';

function Login() {
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
      <section className="relative grid min-h-screen grid-cols-2">
        {/* <div className="bg-gradient-radial-pastel absolute right-[-200px] bottom-[-200px] h-[1080px] w-[1920px]"></div> */}
        <div className="flex flex-col items-center justify-center gap-8">
          <LoginForm />
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

export default Login;
