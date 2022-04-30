import { Transition } from '@headlessui/react';
import { useState } from 'react';
import Button from '../common/Button';
import NewAccountForm from '../forms/NewAccountForm';
import { DialogFullWrapper } from '../wrappers/Dialogs';

type AddChildCardProps = {};

function AddChildCard({}: AddChildCardProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <Button action={(isOpen: boolean) => setIsOpen(!isOpen)} arg={isOpen}>
        Setup an account
      </Button>

      <DialogFullWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
        <NewAccountForm />
      </DialogFullWrapper>
    </>
  );
}

export default AddChildCard;
