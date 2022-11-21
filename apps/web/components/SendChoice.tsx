import Link from 'next/link';
import type { FC } from 'react';
import { useChildConfig } from '../hooks/useChildConfig';
import FormattedMessage from './common/FormattedMessage';
import { Spinner } from './common/Spinner';

type SendChoiseProps = {
  childAddress: string;
};

const SendChoice: FC<SendChoiseProps> = ({ childAddress }) => {
  const { data, isLoading } = useChildConfig({ address: childAddress });

  if (isLoading) {
    return <Spinner />;
  }

  if (data?.periodicity.isZero()) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-12">
        <p className="text-center font-bold">
          <FormattedMessage id="send.firsttime.choice" />
        </p>
        <div className="flex  gap-4">
          <Link href={`/account/${childAddress}/direct`} passHref>
            <button className="action-btn h-14 basis-1/2 rounded-xl font-bold">
              <FormattedMessage id="send.firsttime.choiceOnce" />
            </button>
          </Link>
          <Link href={`/account/${childAddress}/vault`} passHref>
            <button className="action-btn h-14 basis-1/2 rounded-xl font-bold">
              <FormattedMessage id="send.firsttime.choiceRecurrent" />
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-12">
      <p className="text-center font-bold">
        <FormattedMessage id="send.secondtime.choice" />
      </p>
      <div className="flex  gap-4">
        <Link href={`/account/${childAddress}/direct`} passHref>
          <button className="action-btn h-14 basis-1/2 rounded-xl font-bold">
            <FormattedMessage id="send.secondtime.choiceOnce" />
          </button>
        </Link>
        <Link href={`/account/${childAddress}/vault`} passHref>
          <button className="action-btn h-14 basis-1/2 rounded-xl font-bold">
            <FormattedMessage id="send.secondtime.choiceRecurrent" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SendChoice;
