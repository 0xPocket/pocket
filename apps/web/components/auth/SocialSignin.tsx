import Image from 'next/image';
import type { FC } from 'react';

const MagicSocialProviders = [
  {
    id: 'facebook',
    name: 'Facebook',
  },
  {
    id: 'google',
    name: 'Google',
  },
];

const SocialSignin: FC = () => {
  return (
    <div className="flex gap-4">
      {MagicSocialProviders.map((connector) => (
        <button
          key={connector.id}
          onClick={() => console.log('test')}
          className="transition-all hover:scale-110"
        >
          <div className="relative h-10 w-10">
            <Image
              src={`/assets/social_icons/${connector.id}.svg`}
              objectFit="contain"
              layout="fill"
              alt={connector.name}
            />
          </div>
          {/* {connector.name} */}
        </button>
      ))}
    </div>
  );
};

export default SocialSignin;
