import { UserChild } from '@lib/types/interfaces';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAxios } from '../../hooks/axios.hook';
import { setChildren } from '../../redux/children/childrenSlice';
import { RootState } from '../../redux/store';
import AddChildCard from '../cards/AddChildCard';
import ChildCard from '../cards/ChildCard';

type ChildrenAccountPanelProps = {};

function ChildrenAccountPanel({}: ChildrenAccountPanelProps) {
  const childrens = useSelector((state: RootState) => state.children.value);
  const dispatch = useDispatch();
  const axios = useAxios();

  // const [children, setChildren] = useState<UserChild[]>([]);

  useEffect(() => {
    axios
      .get<UserChild[]>('http://localhost:5000/users/parents/children')
      .then((res: { data: UserChild[] }) => {
        dispatch(setChildren(res.data));
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      <h2 className="mb-4">My accounts</h2>
      <div className="grid grid-cols-2 gap-4">
        {childrens?.map((child) => (
          <ChildCard key={child.id} child={child} />
        ))}
        <AddChildCard />
      </div>
    </div>
  );
}

export default ChildrenAccountPanel;
