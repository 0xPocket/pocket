import { DialogPopupWrapper } from '@lib/ui';
import type { Dispatch, FC } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { trpc } from '../../utils/trpc';
import InputText from '../common/InputText';
import { useZodForm } from '../../utils/useZodForm';
import { TicketSchema } from '../../server/schemas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBug, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

type BugDialogProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<React.SetStateAction<boolean>>;
};

const BugDialog: FC<BugDialogProps> = ({ isOpen, setIsOpen }) => {
  const router = useRouter();

  const { register, handleSubmit } = useZodForm({
    schema: TicketSchema['submit'],
    defaultValues: {
      fromURL: router.asPath,
    },
  });

  const reportBug = trpc.useMutation(['ticket.submit'], {
    onSuccess: () => {
      toast.success(`Bug reported, we'll get back to you asap if needed !`);
      setIsOpen(false);
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  return (
    <DialogPopupWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
      <h1 className="mb-6">
        <FontAwesomeIcon icon={faBug} className="mr-2" /> Report a bug
      </h1>
      <form
        onSubmit={handleSubmit((data) => reportBug.mutate(data))}
        className="flex min-w-[360px] flex-col gap-6 rounded-lg"
      >
        <InputText
          label="Subject (optional)"
          register={register('subject')}
          optional
        />
        <textarea
          {...register('desc')}
          className="container-classic without-ring min-h-[150px] rounded-md p-4"
          placeholder="Tell us more about it"
          required
        />
        <button className="action-btn">
          <FontAwesomeIcon icon={faPaperPlane} className="mr-2" /> Send
        </button>
      </form>
    </DialogPopupWrapper>
  );
};

export default BugDialog;
