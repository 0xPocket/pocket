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
        <div
          className={`flex flex-col items-center justify-center gap-4 md:flex-row`}
        >
          {!isConnected && userType === 'Parent' && (
            <>
              <button onClick={() => callback('magic')} className="action-btn ">
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
