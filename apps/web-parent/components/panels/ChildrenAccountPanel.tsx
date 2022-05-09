import { UserChild } from '@lib/types/interfaces';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useAxios } from '../../hooks/axios.hook';
import AddChildCard from '../cards/AddChildCard';
import ChildCard from '../cards/ChildCard';

type ChildrenAccountPanelProps = {};

function ChildrenAccountPanel({}: ChildrenAccountPanelProps) {
  const axios = useAxios();

  const [children, setChildren] = useState<UserChild[]>([]);

  const { isLoading, error, data, isFetching } = useQuery('children', () =>
    axios
      .get<UserChild[]>('http://localhost:5000/users/parents/children')
      .then((res: { data: UserChild[] }) => res.data),
  );
  // useEffect(() => {
  //   axios
  //     .get<UserChild[]>('http://localhost:5000/users/parents/children')
  //     .then((res: { data: UserChild[] }) => {
  //       setChildren(res.data);
  //     })
  //     .catch((error) => console.log(error));
  // }, []);

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
