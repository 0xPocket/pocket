import { DialogPopupWrapper } from '@lib/ui';
import type { Dispatch, FC } from 'react';
import { z } from 'zod';
import { useZodForm } from '../../utils/useZodForm';
import { trpc } from '../../utils/trpc';
import InputText from '../common/InputText';

type ContactDialogProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<React.SetStateAction<boolean>>;
};

const ContactFormSchema = z.object({
  //user
  //created_at
  name: z.string(),
  email: z.string(),
  subject: z.string().optional(),
  desc: z.string(),
});

type FormValues = z.infer<typeof ContactFormSchema>;

const ContactDialog: FC<ContactDialogProps> = ({ isOpen, setIsOpen }) => {
  const { register, handleSubmit } = useZodForm({ schema: ContactFormSchema });

  const queryClient = trpc.useContext();

  // const reportBug = trpc.useMutation(['bug.report'], {
  //   onSuccess: () => {
  //     toast.success(`Message sent ! We'll get back at you as soon as possible.`);
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
      <h1 className="mb-6">Contact Us</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex min-w-[460px] flex-col gap-4 rounded-lg"
      >
        <div className="flex gap-4">
          <InputText label="Name" register={register('name')} />
          <InputText label="Email" register={register('email')} />
        </div>
        <InputText label="Subject" register={register('subject')} />
        <label htmlFor="desc"></label>
        <textarea
          {...register('desc')}
          className="container-classic without-ring min-h-[150px] rounded-md p-4"
          placeholder="My message"
          required
        />
        <button className="action-btn">Submit</button>
      </form>
    </DialogPopupWrapper>
  );
};

export default ContactDialog;
