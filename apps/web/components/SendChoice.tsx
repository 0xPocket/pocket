import Link from 'next/link';
import type { FC } from 'react';
import { useChildConfig } from '../hooks/useChildConfig';
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
          Souhaitez-vous lui donner de l’argent une seule fois ou de maniére
          récurente ?
        </p>
        <div className="flex  gap-4">
          <Link href={`/account/${childAddress}/direct`} passHref>
            <button className="action-btn h-14 basis-1/2 rounded-xl font-bold">
              Une seule fois
            </button>
          </Link>
          <Link href={`/account/${childAddress}/vault`} passHref>
            <button className="action-btn h-14 basis-1/2 rounded-xl font-bold">
              De maniére récurente
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-12">
      <p className="text-center font-bold">
        Voulez-vous lui envoyer directement de l’argent ou recharger sa tirelire
        ?
      </p>
      <div className="flex  gap-4">
        <Link href={`/account/${childAddress}/direct`} passHref>
          <button className="action-btn h-14 basis-1/2 rounded-xl font-bold">
            Envoyer directement
          </button>
        </Link>
        <Link href={`/account/${childAddress}/vault`} passHref>
          <button className="action-btn h-14 basis-1/2 rounded-xl font-bold">
            Recharger sa tirelire
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SendChoice;
