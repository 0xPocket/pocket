import type { FC } from 'react';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEllipsisVertical,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import FormattedMessage from '../common/FormattedMessage';
import LangToggler from './LangToggler';
import { useSignOut } from '../../hooks/useSignOut';
import { useSession } from 'next-auth/react';

const DropdownMenu: FC = ({}) => {
  const signOut = useSignOut();
  const { status } = useSession();

  return (
    <Menu as="div" className="relative z-50 inline-block text-left">
      {({ open }) => (
        <>
          <Menu.Button className="flex h-7 w-7 items-center justify-center rounded-full">
            <span className="sr-only">
              <FormattedMessage id="header.open-options" />
            </span>
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </Menu.Button>
          {open && (
            <Transition
              show={open}
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                static
                className="container-classic absolute right-0 mt-2 flex w-56 origin-top-right flex-col items-center rounded-md p-4"
              >
                {status === 'authenticated' && (
                  <Menu.Item>
                    <button
                      onClick={() => signOut.mutate()}
                      className="third-btn"
                    >
                      <FontAwesomeIcon
                        icon={faRightFromBracket}
                        className="mr-2"
                      />
                      <FormattedMessage id="signout" />
                    </button>
                  </Menu.Item>
                )}
              </Menu.Items>
            </Transition>
          )}
        </>
      )}
    </Menu>
  );
};

export default DropdownMenu;
