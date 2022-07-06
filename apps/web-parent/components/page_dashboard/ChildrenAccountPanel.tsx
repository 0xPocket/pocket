import { UserChild } from '@lib/types/interfaces';
import { useQuery } from 'react-query';
import { useAxios } from '../../hooks/axios.hook';
import ChildCard from '../cards/childcard/ChildCard';
import { useRouter } from 'next/router';
import { Button } from '@lib/ui';

type ChildrenAccountPanelProps = {};

function ChildrenAccountPanel({}: ChildrenAccountPanelProps) {
  const axios = useAxios();
  const router = useRouter();

  const { isLoading, data } = useQuery(
    'children',
    () =>
      axios
        .get<UserChild[]>('http://localhost:3000/api/users/parents/children')
        .then((res: { data: UserChild[] }) => res.data),
    { staleTime: 60 * 1000 },
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="">My children</h2>
        <Button action={() => router.push('/dashboard/add-account/')}>
          Add a child
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          data?.map((child) => <ChildCard key={child.id} child={child} />)
        )}
      </div>
    </div>
  );
}

export default ChildrenAccountPanel;
