import { Tab } from '@headlessui/react';
import { UserChild, UserParent } from '@lib/types/interfaces';
import { useState } from 'react';
import { DialogFullWrapper } from '../wrappers/Dialogs';
import { ChildContract } from '@lib/contract';

type ChildCardProps = {
  child: UserChild;
};

const cc = new ChildContract();

function ChildCard({ child }: ChildCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div
        className="relative aspect-square rounded-lg bg-primary text-bright"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="absolute left-4 bottom-4">{child?.firstName}</h2>
        <p>{cc.getBalance('test')}</p>
      </div>

      <DialogFullWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="mb-8 flex h-full flex-col">
          <Tab.Group>
            <div className="mb-8">
              <Tab.List>
                <Tab>Overview</Tab>
                <Tab>Settings</Tab>
              </Tab.List>
            </div>
            <Tab.Panels>
              <Tab.Panel>Content 1</Tab.Panel>
              <Tab.Panel>Content 2</Tab.Panel>
              <Tab.Panel>Content 3</Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </DialogFullWrapper>
    </>
  );
}

export default ChildCard;
