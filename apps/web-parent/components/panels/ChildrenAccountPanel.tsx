import { UserChild } from '@lib/types/interfaces';
import { useQuery } from 'react-query';
import { useAxios } from '../../hooks/axios.hook';
import AddChildButton from './AddChildButton';
import ChildCard from '../cards/ChildCard';

type ChildrenAccountPanelProps = {};

function ChildrenAccountPanel({}: ChildrenAccountPanelProps) {
  const axios = useAxios();

  const { isLoading, data } = useQuery(
    'children',
    () =>
      axios
        .get<UserChild[]>('http://localhost:5000/users/parents/children')
        .then((res: { data: UserChild[] }) => res.data),
    { staleTime: 60 * 1000 },
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="">My accounts</h2>
        <AddChildButton />
      </div>
      <div className="grid grid-cols-2 gap-4">
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
