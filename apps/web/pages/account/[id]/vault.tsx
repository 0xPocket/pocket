import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import Breadcrumb from '../../../components/common/Breadcrumb';
import FormattedMessage from '../../../components/common/FormattedMessage';
import { Spinner } from '../../../components/common/Spinner';
import TitleHelper from '../../../components/common/TitleHelper';
import PageWrapper from '../../../components/common/wrappers/PageWrapper';
import TransakStatus from '../../../components/TransakStatus';
import VaultForm from '../../../components/VaultForm';
import { useSmartContract } from '../../../contexts/contract';
import { useChildConfig } from '../../../hooks/useChildConfig';
import useTransak from '../../../hooks/useTransak';
import { trpc } from '../../../utils/trpc';

export default function VaultPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { isLoading, data: child } = trpc.parent.childByAddress.useQuery(
    { address: id },
    {
      enabled: !!id,
    },
  );

  const { data: childConfig, isLoading: childConfigLoading } = useChildConfig({
    address: id,
  });
  const { erc20 } = useSmartContract();
  const { address } = useAccount();

  const { data: erc20Balance } = useBalance({
    address: address,
    token: erc20?.address,
  });

  const { status, showTransak } = useTransak();

  const [step, setStep] = useState<'tutorial' | 'form'>('tutorial');

  useEffect(() => {
    if (!childConfig?.periodicity.isZero()) {
      setStep('form');
    }
  }, [childConfig]);

  let showTransakButton = erc20Balance?.value.isZero() && !status;

  showTransakButton = false;

  return (
    <PageWrapper noFooter>
      <TitleHelper title={child?.name || 'Child'} />

      <Breadcrumb
        routes={
          child
            ? [
                { name: child.name, path: `/account/${id}` },
                { name: 'Vault', path: null },
              ]
            : []
        }
      />
      {isLoading || childConfigLoading ? (
        <Spinner />
      ) : child ? (
        step === 'tutorial' ? (
          <div className="flex w-full flex-col items-center justify-center gap-12">
            {!status && (
              <>
                <p className="text-center font-bold">
                  Pour donner réguliérement de l’argent à votre enfant sans y
                  penser, il vous faut lui créer une tirelire. Comment
                  fonctionnera t’elle ?
                </p>
                <ul className="list-disc space-y-8 px-4">
                  <li>
                    C’est une tirelire dans laquelle vous déposez son argent de
                    poche en avance
                  </li>
                  <li>
                    Vous définissez à quelle fréquence votre enfant peut retirer
                    son argent
                  </li>
                  <li>Et vous définissez le montant qu’il pourra retirer </li>
                </ul>
              </>
            )}
            <div className="flex flex-col  gap-4">
              {showTransakButton && (
                <button
                  onClick={() => showTransak({})}
                  className="action-btn h-14 basis-1/2 rounded-xl font-bold"
                >
                  Acheter des USDC avant
                </button>
              )}
              {status && <TransakStatus status={status} />}
              <button
                className="success-btn h-14 basis-1/2 rounded-xl font-bold"
                onClick={() => setStep('form')}
                // disabled={showTransakButton || status !== 'order_completed'}
              >
                {"C'est parti !"}
              </button>
            </div>
          </div>
        ) : (
          <VaultForm childAddress={id} />
        )
      ) : (
        <div>
          <FormattedMessage id="account.not-found" />
        </div>
      )}
    </PageWrapper>
  );
}
