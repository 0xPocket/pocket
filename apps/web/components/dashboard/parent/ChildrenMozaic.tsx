import ChildCard from '../../card/parent/ChildCard';
import { useRouter } from 'next/router';
import { Button } from '@lib/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { trpc } from '../../../utils/trpc';

type ChildrenMozaicProps = {};

function ChildrenMozaic({}: ChildrenMozaicProps) {
  const router = useRouter();

  const { isLoading, data } = trpc.useQuery(['parent.children']);

  return (
    <div className="flex flex-col space-y-12">
      <div className="flex items-center justify-between">
        <h1>My children</h1>
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
