import { useRouter } from 'next/router';
import Breadcrumb from '../../../components/common/Breadcrumb';
import FormattedMessage from '../../../components/common/FormattedMessage';
import { Spinner } from '../../../components/common/Spinner';
import TitleHelper from '../../../components/common/TitleHelper';
import PageWrapper from '../../../components/common/wrappers/PageWrapper';
import VaultForm from '../../../components/VaultForm';
import VaultFormWithTutorial from '../../../components/VaultFormWithTutorial';
import { useChildConfig } from '../../../hooks/useChildConfig';
import { trpc } from '../../../utils/trpc';

export default function VaultPage() {
  const router = useRouter();
  const id = router.query.id as string | undefined;

  const { isLoading, data: child } = trpc.parent.childByAddress.useQuery(
    { address: id! },
    {
      enabled: !!id,
    },
  );

  const { data: childConfig, isLoading: childConfigLoading } = useChildConfig({
    address: id,
  });

  return (
    <PageWrapper noFooter>
      <TitleHelper title={child?.name || 'Child'} />

      <Breadcrumb
        routes={
          child
            ? [
                { name: child.name, path: `/account/${id}` },
                { name: 'Send', path: `/account/${id}/send` },
                { name: 'Vault', path: null },
              ]
            : []
        }
      />
      {isLoading || childConfigLoading ? (
        <Spinner />
      ) : child ? (
        childConfig?.periodicity.isZero() ? (
          <VaultFormWithTutorial childAddress={child.address} />
        ) : (
          <VaultForm childAddress={child.address} />
        )
      ) : (
        <div>
          <FormattedMessage id="account.not-found" />
        </div>
      )}
    </PageWrapper>
  );
}
