import { Tab } from '@headlessui/react';

type TransactionContentProps = {};

function TransactionContent({}: TransactionContentProps) {
  return (
    <div className="space-y-8">
      <Tab.Group>
        <div className="flex justify-between">
          <h2>Transaction history</h2>
          <Tab.List className="space-x-8">
            <Tab
              className={({ selected }) =>
                selected
                  ? 'text-dark underline dark:text-white'
                  : 'text-white-darker'
              }
            >
              activity
            </Tab>
            <Tab
              className={({ selected }) =>
                selected
                  ? 'text-dark underline dark:text-white'
                  : 'text-white-darker'
              }
            >
              top-ups
            </Tab>
          </Tab.List>
        </div>
        <div className="container-classic h-full rounded-lg p-8">
          <Tab.Panels>
            <Tab.Panel></Tab.Panel>
            <Tab.Panel></Tab.Panel>
          </Tab.Panels>
        </div>
      </Tab.Group>
    </div>
  );
}

export default TransactionContent;
