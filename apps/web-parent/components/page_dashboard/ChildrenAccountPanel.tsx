import { UserChild } from '@lib/types/interfaces';
import { useQuery } from 'react-query';
import ChildCard from '../card/ChildCard';
import { useRouter } from 'next/router';
import { Button } from '@lib/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

type ChildrenAccountPanelProps = {};

function ChildrenAccountPanel({}: ChildrenAccountPanelProps) {
  const router = useRouter();

  const { isLoading, data } = useQuery(
    'children',
    () =>
      axios
        .get<UserChild[]>('http://localhost:3000/api/users/parents/children')
        .then((res) => res.data),
    { staleTime: 60 * 1000 },
  );

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

export default ChildrenAccountPanel;
