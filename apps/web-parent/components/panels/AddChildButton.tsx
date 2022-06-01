import { useState } from 'react';
import { Button, DialogPopupWrapper } from '@lib/ui';
import AddChildForm from '../forms/AddChildForm';

type AddChildButtonProps = {};

function AddChildButton({}: AddChildButtonProps) {
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

export default AddChildButton;
