import { Dialog, Transition } from '@headlessui/react';
import { useState, Fragment } from 'react';
import Button from '../common/Button';
import NewAccountForm from '../forms/NewAccountForm';
import { DialogFullWrapper } from '../wrappers/DialogsWrapper';

type AddChildCardProps = {};

function AddChildCard({}: AddChildCardProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <Button isOpen={isOpen} setIsOpen={setIsOpen}>
        Setup an account
      </Button>
      <DialogFullWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
        <NewAccountForm setIsOpen={() => setIsOpen(false)} />
      </DialogFullWrapper>
    </>
  );
}

export default AddChildCard;
