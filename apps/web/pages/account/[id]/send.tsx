import Link from 'next/link';
import { useRouter } from 'next/router';
import Breadcrumb from '../../../components/common/Breadcrumb';
import FormattedMessage from '../../../components/common/FormattedMessage';
import { Spinner } from '../../../components/common/Spinner';
import TitleHelper from '../../../components/common/TitleHelper';
import PageWrapper from '../../../components/common/wrappers/PageWrapper';
import { trpc } from '../../../utils/trpc';

export default function AccountSend() {
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
                { name: 'Send', path: null },
              ]
            : []
        }
      />
      {isLoading ? (
        <>
          <Spinner />
        </>
      ) : child ? (
        <div className="flex w-full flex-col items-center justify-center gap-12">
          <p className="text-center font-bold">
            <FormattedMessage id="send.firsttime.choice" />
          </p>
          <div className="flex  gap-4">
            <Link href={`/account/${id}/direct`} passHref>
              <button className="action-btn h-14 basis-1/2 rounded-xl font-bold">
                <FormattedMessage id="send.firsttime.choiceOnce" />
              </button>
            </Link>
            <Link href={`/account/${id}/vault`} passHref>
              <button className="action-btn h-14 basis-1/2 rounded-xl font-bold">
                <FormattedMessage id="send.firsttime.choiceRecurrent" />
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <FormattedMessage id="account.not-found" />
        </div>
      )}
    </PageWrapper>
  );
}
