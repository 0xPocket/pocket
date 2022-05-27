import { useState } from 'react';
import { Button, DialogPopupWrapper } from '@lib/ui';
import AddChildForm from '../forms/AddChildForm';

type AddChildCardProps = {};

function AddChildCard({}: AddChildCardProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <Button isOpen={isOpen} setIsOpen={setIsOpen}>
        Setup an account
      </Button>
      <DialogPopupWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
        <AddChildForm setIsOpen={() => setIsOpen(false)} />
      </DialogPopupWrapper>
    </>
  );
}

export default AddChildCard;
