import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Listbox, Transition } from '@headlessui/react';
import { CovalentItem } from '@lib/types/interfaces';
import { DialogPopupWrapper } from '@lib/ui';
import { FC, Fragment, useState } from 'react';
import { toast } from 'react-toastify';
import { trpc } from '../../../../utils/trpc';

type TokenReportPopupProps = {
  items: CovalentItem[];
};

const TokenReportPopup: FC<TokenReportPopupProps> = ({ items }) => {
  const [selectedToken, setSelectedToken] = useState<CovalentItem>(items[0]);
  const [popupOpen, setPopupOpen] = useState(false);
  const reportToken = trpc.useMutation(['token.report'], {
    onSuccess: () => {
      toast.success('Report sent !');
    },
  });

  return (
    <div className="flex items-end justify-end text-sm">
      <div
        className="flex cursor-pointer items-center text-danger"
        onClick={() => setPopupOpen(true)}
      >
        <FontAwesomeIcon icon={faTriangleExclamation} className="mr-2" />
        Report a suspicious token
      </div>
      <DialogPopupWrapper isOpen={popupOpen} setIsOpen={setPopupOpen}>
        <div className="relative flex w-60 flex-col gap-4">
          <Listbox value={selectedToken} onChange={setSelectedToken}>
            {({ open }) => (
              <>
                <Listbox.Label className="block text-sm font-medium">
                  Select a token
                </Listbox.Label>

                <div className="relative">
                  <Listbox.Button className="relative w-full max-w-sm cursor-default rounded-md border py-2 pl-3 pr-10 text-left shadow-sm">
                    {selectedToken?.contract_name}
                  </Listbox.Button>
                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="background absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md  py-1 text-base shadow-lg sm:text-sm">
                      {items.map((item) => (
                        <Listbox.Option
                          key={item.contract_address}
                          value={item}
                          className={({ active }) => {
                            return `${
                              active
                                ? 'bg-indigo-600 text-white'
                                : 'text-gray-900'
                            } relative cursor-default select-none py-2 pl-3 pr-9`;
                          }}
                        >
                          {item.contract_name}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </>
            )}
          </Listbox>

          <button
            className="danger-btn"
            onClick={() => {
              reportToken.mutate({ address: selectedToken.contract_address });
              setPopupOpen(false);
            }}
          >
            Report
          </button>
        </div>
      </DialogPopupWrapper>
    </div>
  );
};

export default TokenReportPopup;
