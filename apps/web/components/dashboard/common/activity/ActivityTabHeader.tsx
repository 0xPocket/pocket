import { Tab } from '@headlessui/react';

type ActivityTabHeadersProps = {
  leftHeader: React.ReactElement;
  rightHeader: React.ReactElement;
};

function ActivityTabHeaders({
  leftHeader,
  rightHeader,
}: ActivityTabHeadersProps) {
  return (
    <Tab.List className="flex items-center space-x-8">
      <Tab
        className={({ selected }) =>
          selected ? 'text-dark underline dark:text-white' : 'text-white-darker'
        }
      >
        {leftHeader}
      </Tab>

      <Tab
        className={({ selected }) =>
          selected ? 'text-dark underline dark:text-white' : 'text-white-darker'
        }
      >
        {rightHeader}
      </Tab>
    </Tab.List>
  );
}

export default ActivityTabHeaders;
