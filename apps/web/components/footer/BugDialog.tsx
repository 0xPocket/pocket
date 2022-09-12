import { DialogPopupWrapper } from '@lib/ui';
import type { Dispatch, FC } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { trpc } from '../../utils/trpc';
import InputText from '../common/InputText';
import { useZodForm } from '../../utils/useZodForm';

type BugDialogProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<React.SetStateAction<boolean>>;
};

const BugFormSchema = z.object({
  //user
  //created_at
  fromURL: z.string(),
  subject: z.string().optional(),
  desc: z.string(),
});

type FormValues = z.infer<typeof BugFormSchema>;

const BugDialog: FC<BugDialogProps> = ({ isOpen, setIsOpen }) => {
  const router = useRouter();
  const { register, handleSubmit } = useZodForm({
    schema: BugFormSchema,
    defaultValues: {
      fromURL: router.asPath,
      desc: '',
      subject: undefined,
    },
  });

  const queryClient = trpc.useContext();

  // const reportBug = trpc.useMutation(['bug.report'], {
  //   onSuccess: () => {
  //     toast.success(`Bug reported, we'll get back to you asap if needed !`);
  //     setIsOpen(false);
  //   },
  //   onError: (e) => {
  //     toast.error(e.message);
  //   },
  // });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    // addChild.mutate(data);
  };

  return (
    <DialogPopupWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
      <h1 className="mb-6">Report a bug</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex min-w-[360px] flex-col gap-4 rounded-lg"
      >
        <InputText
          label="Subject (optional)"
          register={register('subject')}
          optional
        />
        <label htmlFor="desc"></label>
        <textarea
          {...register('desc')}
          className="container-classic without-ring min-h-[150px] rounded-md p-4"
          placeholder="Tell us more about it"
          required
        />
        <button className="action-btn">Submit</button>
      </form>
    </DialogPopupWrapper>
  );
};

export default BugDialog;
