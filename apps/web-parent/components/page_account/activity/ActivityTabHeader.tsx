import { Tab } from '@headlessui/react';

function ActivityTabHeaders() {
  return (
    <Tab.List className="grid grid-cols-2 space-x-8">
      <Tab
        className={({ selected }) =>
          selected ? 'text-dark underline dark:text-white' : 'text-white-darker'
        }
      >
        Transactions
      </Tab>

      <Tab
        className={({ selected }) =>
          selected ? 'text-dark underline dark:text-white' : 'text-white-darker'
        }
      >
        Your top-ups
      </Tab>
    </Tab.List>
  );
}

export default ActivityTabHeaders;
