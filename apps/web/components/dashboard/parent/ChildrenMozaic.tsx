import ChildCard from '../../card/parent/ChildCard';
import { useRouter } from 'next/router';
import { Button } from '@lib/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { trpc } from '../../../utils/trpc';
import FormattedMessage from '../../common/FormattedMessage';

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
        <button onClick={() => testwebhookramp.mutate()}> Test webhook</button>
        <Button
          action={() => router.push('/add-account')}
          className="space-x-2"
        >
          <FontAwesomeIcon icon={faPlus} />
          <p>Add a child</p>
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          data?.map((child) => (
            <ChildCard key={child.id} child={child} hasLink />
          ))
        )}
      </div>
    </div>
  );
}

export default ChildrenMozaic;
