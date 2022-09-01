import type { FC } from 'react';
import { Button, ThemeTogglerApp } from '@lib/ui';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { useMagic } from '../../contexts/auth';

const DropdownMenu: FC = ({}) => {
  const { signOut } = useMagic();
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="flex h-7 w-7 items-center justify-center rounded-full">
        <span className="sr-only">Open options</span>
        <FontAwesomeIcon icon={faEllipsisVertical} />
        {/* <DotsVerticalIcon className="h-5 w-5" aria-hidden="true" /> */}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="container-classic absolute right-0 mt-2 flex w-56 origin-top-right flex-col items-center rounded-md p-4">
          <Menu.Item>
            <ThemeTogglerApp />
          </Menu.Item>
          <Menu.Item>
            <Button action={signOut} light>
              Logout
            </Button>
          </Menu.Item>
          {/* <Menu.Item>
            {locale === 'fr' ? (
              <Link href={asPath} locale="en-US">
                <a>🇺🇸</a>
              </Link>
            ) : (
              <Link href={asPath} locale="fr">
                <a>🇫🇷</a>
              </Link>
            )}
          </Menu.Item> */}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default DropdownMenu;
