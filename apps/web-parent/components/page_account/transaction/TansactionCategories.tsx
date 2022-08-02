import { Tab } from '@headlessui/react';

function TransactionCategories() {
  return (
    <Tab.List className="space-x-8">
      <Tab
        className={({ selected }) =>
          selected ? 'text-dark underline dark:text-white' : 'text-white-darker'
        }
      >
        Activity
      </Tab>

      <Tab
        className={({ selected }) =>
          selected ? 'text-dark underline dark:text-white' : 'text-white-darker'
        }
      >
        Top-ups
      </Tab>
    </Tab.List>
  );
}

export default TransactionCategories;
