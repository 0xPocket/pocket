import { UserChild } from '@lib/types/interfaces';
import { useQuery } from 'react-query';
import { useAxios } from '../../hooks/axios.hook';
import AddChildCard from '../cards/AddChildCard';
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
      <h2 className="mb-4">My accounts</h2>
      <div className="grid grid-cols-2 gap-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          data?.map((child) => <ChildCard key={child.id} child={child} />)
        )}
        <AddChildCard />
      </div>
    </div>
  );
}

export default ChildrenAccountPanel;
