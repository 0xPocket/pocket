import { type FC } from 'react';
import EmailConnectForm from './EmailConnectForm';
import { Spinner } from '../common/Spinner';
import { useIsMounted } from '../../hooks/useIsMounted';
import RainbowKitButton from './RainbowKitButton';

const ProviderList: FC = () => {
  const isMounted = useIsMounted();

  return (
    <>
      {!isMounted ? (
        <Spinner />
      ) : (
        <div className="flex w-full flex-col items-center justify-center gap-8">
          <EmailConnectForm />
          <div>OR</div>
          <RainbowKitButton />
        </div>
      )}
    </>
  );
};

export default ProviderList;
