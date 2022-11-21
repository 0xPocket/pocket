import { useRouter } from 'next/router';
import Breadcrumb from '../../../components/common/Breadcrumb';
import FormattedMessage from '../../../components/common/FormattedMessage';
import { Spinner } from '../../../components/common/Spinner';
import TitleHelper from '../../../components/common/TitleHelper';
import PageWrapper from '../../../components/common/wrappers/PageWrapper';
import DirectSendForm from '../../../components/DirectSendForm';
import { trpc } from '../../../utils/trpc';

export default function DirectSend() {
  const router = useRouter();
  const id = router.query.id as string;

  const { isLoading, data: child } = trpc.parent.childByAddress.useQuery(
    { address: id },
    {
      enabled: !!id,
    },
  );

  return (
    <PageWrapper>
      <TitleHelper title={child?.name || 'Child'} />

      <Breadcrumb
        routes={
          child
            ? [
                { name: child.name, path: `/account/${id}` },
                { name: 'Send', path: `/account/${id}/send` },
                { name: 'Direct', path: null },
              ]
            : []
        }
      />
      {isLoading ? (
        <>
          <Spinner />
        </>
      ) : child ? (
        <DirectSendForm childAddress={id} />
      ) : (
        <div>
          <FormattedMessage id="account.not-found" />
        </div>
      )}
    </PageWrapper>
  );
}
