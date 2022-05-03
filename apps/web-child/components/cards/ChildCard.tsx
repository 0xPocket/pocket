import { Tab } from '@headlessui/react';
import { UserChild, UserParent } from '@lib/types/interfaces';
import { useState } from 'react';
import { DialogFullWrapper } from '../wrappers/DialogsWrapper';
import { ChildContract } from '@lib/contract';
import SectionContainer from '../containers/SectionContainer';
import ChildSettingsForm from '../forms/ChildSettingsForm';

type ChildCardProps = {
  child: UserChild;
};

const cc = new ChildContract();

function ChildCard({ child }: ChildCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div
        className="relative flex aspect-square items-end rounded-lg bg-primary p-4 text-bright"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <h2 className="">{child?.firstName}</h2>
          <p>Available funds : {cc.getBalance('test')}</p>
        </div>
      </div>

      <DialogFullWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="container h-screen">
          <h1 className="mb-8">{child.firstName}</h1>
          <Tab.Group>
            <Tab.List className="mb-8 flex gap-4">
              <Tab className="border p-4">Overview</Tab>
              <Tab className="border p-4">Settings</Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                <div className="grid  grid-cols-2 gap-8">
                  <div className="h-60 bg-dark p-4 text-bright">
                    Wallet Content
                  </div>
                  <div className="h-60 bg-dark p-4 text-bright">History</div>
                </div>
              </Tab.Panel>
              <Tab.Panel>
                <ChildSettingsForm child={child} />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </DialogFullWrapper>
    </>
  );
}

export default ChildCard;