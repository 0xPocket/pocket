import { type FC } from 'react';
import { useAccount } from 'wagmi';
import { useIsMounted } from '../../hooks/useIsMounted';
import FormattedMessage from '../common/FormattedMessage';
import { Spinner } from '../common/Spinner';
import RainbowKitButton from '../connect/RainbowKitButton';

type ProviderListProps = {
  callback: (id: string) => void;
  userType: 'Parent' | 'Child';
};

const ProviderList: FC<ProviderListProps> = ({ callback, userType }) => {
  const mounted = useIsMounted();

  const { isConnected, status } = useAccount();

  return (
    <>
      {!isConnected && (
        <h3>
          <FormattedMessage id="register.step1.title" />
        </h3>
      )}

      {!mounted || status === 'connecting' ? (
        <Spinner />
      ) : (
        <div className={` flex items-center justify-center gap-8`}>
          {!isConnected && userType === 'Parent' && (
            <>
              <button
                onClick={() => callback('magic')}
                className="flex h-10 items-center rounded-xl bg-primary p-4 font-sans font-bold transition-all hover:scale-[1.025]"
              >
                Sign in with Email
              </button>
              <div>OR</div>
            </>
          )}
          <RainbowKitButton callback={callback as any} />
        </div>
      )}
    </>
  );
};

export default ProviderList;
