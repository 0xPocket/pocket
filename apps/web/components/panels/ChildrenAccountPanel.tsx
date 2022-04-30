import { UserParent } from '@lib/types/interfaces';
import AddChildCard from '../cards/AddChildCard';
import ChildCard from '../cards/ChildCard';
import { ChildContract } from '@lib/contract';
type ChildrenAccountPanelProps = {
  user: UserParent;
};

function ChildrenAccountPanel({ user }: ChildrenAccountPanelProps) {
  return (
    <div>
      <h2 className="mb-4">My accounts</h2>
      <div className="grid grid-cols-2 gap-4">
        {user.children.map((child) => (
          <ChildCard key={child.id} child={child} />
        ))}
        <AddChildCard />
      </div>
    </div>
  );
}

export default ChildrenAccountPanel;
