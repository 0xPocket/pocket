import { useState } from 'react';
import Button from '../common/Button';
import AddChildForm from '../forms/AddChildForm';
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
        <AddChildForm setIsOpen={() => setIsOpen(false)} />
      </DialogFullWrapper>
    </>
  );
}

export default AddChildCard;
