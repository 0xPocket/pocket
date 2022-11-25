import { type FC } from 'react';
import EmailConnectForm from './EmailConnectForm';
import { Spinner } from '../common/Spinner';
import { useIsMounted } from '../../hooks/useIsMounted';
import RainbowKitButton from './RainbowKitButton';
import FormattedMessage from '../common/FormattedMessage';

const ProviderList: FC = () => {
  const isMounted = useIsMounted();

  return (
    <>
      {!isMounted ? (
        <Spinner />
      ) : (
        <div className="flex w-full flex-col items-center justify-center gap-8">
          <EmailConnectForm />
          <div className="flex w-full items-center">
            <div className="flex-grow border border-white border-opacity-50"></div>
            <div className="mx-4 text-lg font-bold">
              <FormattedMessage id="or" />
            </div>
            <div className="flex-grow border  border-white border-opacity-50"></div>
          </div>
          <RainbowKitButton />
        </div>
      )}
    </>
  );
};

export default ProviderList;
