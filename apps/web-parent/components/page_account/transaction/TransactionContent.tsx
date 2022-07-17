import { Tab } from '@headlessui/react';

type TransactionContentProps = {};

function TransactionContent({}: TransactionContentProps) {
  return (
    <div className="space-y-8">
      <h2>Transaction history</h2>
      <Tab.Group>
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
        <Tab.Panels>
          <Tab.Panel></Tab.Panel>
          <Tab.Panel></Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export default TransactionContent;
