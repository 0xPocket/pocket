import { DialogPopupWrapper } from '@lib/ui';
import { Dispatch, FC, useEffect } from 'react';
import { useZodForm } from '../../utils/useZodForm';
import { trpc } from '../../utils/trpc';
import InputText from '../common/InputText';
import { ContactSchema } from '../../server/schemas';
import { toast } from 'react-toastify';
import { useMagic } from '../../contexts/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import FormattedMessage from '../common/FormattedMessage';
import { useIntl } from 'react-intl';

type ContactDialogProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<React.SetStateAction<boolean>>;
};

const ContactDialog: FC<ContactDialogProps> = ({ isOpen, setIsOpen }) => {
  const { user } = useMagic();
  const { register, handleSubmit, setValue } = useZodForm({
    schema: ContactSchema['submit'],
  });

  const contact = trpc.useMutation(['contact.submit'], {
    onSuccess: () => {
      toast.success(
        `Message sent ! We'll get back at you as soon as possible.`,
      );
      setIsOpen(false);
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const intl = useIntl();

  useEffect(() => {
    if (user?.email) {
      setValue('email', user.email);
    }
    if (user?.name) {
      setValue('name', user.name);
    }
  }, [user?.name, user?.email, setValue]);

  return (
    <DialogPopupWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
      <h1 className="mb-6">
        <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
        <FormattedMessage id="footer.contact-us" />
      </h1>
      <form
        onSubmit={handleSubmit((data) => contact.mutate(data))}
        className="flex min-w-[460px] flex-col gap-4 rounded-lg"
      >
        {(!user?.name || !user?.email) && (
          <div className="flex gap-4 py-2">
            {!user?.name && (
              <InputText label="Name" register={register('name')} />
            )}
            {!user?.email && (
              <InputText label="Email" register={register('email')} />
            )}
          </div>
        )}
        <InputText
          label={<FormattedMessage id="subject" />}
          register={register('subject')}
          autoComplete="off"
        />
        <label htmlFor="desc"></label>
        <textarea
          {...register('desc')}
          className="container-classic without-ring min-h-[150px] rounded-md p-4"
          placeholder={intl.formatMessage({ id: 'footer.my-message' })}
          autoComplete="off"
          required
        />
        <button className="action-btn">
          <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />{' '}
          <FormattedMessage id="send" />
        </button>
      </form>
    </DialogPopupWrapper>
  );
};

export default ContactDialog;