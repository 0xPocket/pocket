import ChildCard from '../../card/parent/ChildCard';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { trpc } from '../../../utils/trpc';
import FormattedMessage from '../../common/FormattedMessage';
import { Spinner } from '../../common/Spinner';

function ChildrenMozaic() {
  const router = useRouter();

  const { isLoading, data } = trpc.useQuery(['parent.children']);
  const testwebhookramp = trpc.useMutation(['parent.testWebhookRamp']);

  return (
    <div className="flex flex-col space-y-12">
      <div className="flex items-center justify-between">
        <h1>
          <FormattedMessage id="dashboard.title" />
        </h1>
        <button onClick={() => testwebhookramp.mutate()} className="danger-btn">
          Granter
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {/* {isLoading && (
          <div className=" mx-auto ">
            <Spinner />
          </div>
        )} */}
        {!isLoading && (
          <>
            {data?.map((child) => (
              <ChildCard key={child.id} child={child} />
            ))}
            <div
              onClick={() => router.push('/add-account')}
              className="container-classic flex min-h-[260px] cursor-pointer items-center justify-center rounded-lg p-8 text-3xl opacity-60 transition-all hover:text-primary hover:opacity-100"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              <p>
                <FormattedMessage id="dashboard.addChild" />
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ChildrenMozaic;
