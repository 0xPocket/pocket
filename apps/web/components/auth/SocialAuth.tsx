import { useAuth } from '@lib/nest-auth/next';
import Image from 'next/image';
import Button from '../common/Button';

type SocialAuthProps = {};

function SocialAuth({}: SocialAuthProps) {
  const { status, signIn } = useAuth();

  return (
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
  );
}

export default SocialAuth;
