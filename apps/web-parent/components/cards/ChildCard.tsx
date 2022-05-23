import { Tab } from '@headlessui/react';
import { UserChild } from '@lib/types/interfaces';
import { useState } from 'react';
import { DialogFullWrapper } from '../wrappers/DialogsWrapper';
import ChildSettingsForm from '../forms/ChildSettingsForm';

type ChildCardProps = {
  child: UserChild;
};

function ChildCard({ child }: ChildCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div
        className="relative flex aspect-square items-end overflow-hidden rounded-lg border border-dark border-opacity-5 bg-white p-4 shadow-lg dark:border-white-darker dark:bg-dark-light"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <h2 className="">{child?.firstName}</h2>
          <p>Available funds : {'placeholder'}</p>
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
