import Image from 'next/image';
import { useMemo } from 'react';
import { IProviderUserOptions } from 'web3modal';
import { useWeb3Auth } from '../../contexts/web3hook';

type AuthDialogProvidersProps = {
  onClick: (provider: IProviderUserOptions) => void;
};

function AuthDialogProviders({ onClick }: AuthDialogProvidersProps) {
  const { web3Modal } = useWeb3Auth();

  const options = useMemo(() => {
    return web3Modal?.getUserOptions();
  }, [web3Modal]);

  return (
    <div className="flex w-96 flex-col gap-2">
      {options?.map((option) => (
        <button
          className="relative flex h-20 flex-row items-center gap-8 rounded-lg p-4 hover:bg-dark/25"
          onClick={() => onClick(option)}
          key={option.id}
        >
          <Image src={option.logo} alt={option.name} width={42} height={42} />
          <div className="flex w-full flex-col items-start justify-center">
            <span className="font-mono text-lg uppercase">{option.name}</span>
            <span className="text-sm text-bright/50">{option.description}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

export default AuthDialogProviders;
