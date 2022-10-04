import { type Dispatch, type FC, useEffect } from 'react';
import { useZodForm } from '../../utils/useZodForm';
import { trpc } from '../../utils/trpc';
import InputText from '../common/InputText';
import { ContactSchema } from '../../server/schemas';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import FormattedMessage from '../common/FormattedMessage';
import { useIntl } from 'react-intl';
import { DialogPopupWrapper } from '../common/wrappers/DialogsWrapper';
import { useSession } from 'next-auth/react';

type ContactDialogProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<React.SetStateAction<boolean>>;
};

const ContactDialog: FC<ContactDialogProps> = ({ isOpen, setIsOpen }) => {
  const { data } = useSession();
  const { register, handleSubmit, setValue } = useZodForm({
    schema: ContactSchema['submit'],
  });

  const contact = trpc.useMutation(['contact.submit'], {
    onSuccess: () => {
      toast.success(<FormattedMessage id="footer.contact.success" />);
      setIsOpen(false);
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const intl = useIntl();

  useEffect(() => {
    if (data?.user?.email) {
      setValue('email', data?.user.email);
    }
    if (data?.user?.name) {
      setValue('name', data?.user.name);
    }
  }, [data?.user?.name, data?.user?.email, setValue]);

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
        {(!data?.user?.name || !data?.user?.email) && (
          <div className="flex gap-4 py-2">
            {!data?.user?.name && (
              <InputText label="Name" register={register('name')} />
            )}
            {!data?.user?.email && (
              <>
                <InputText
                  label="Email"
                  type="email"
                  register={register('email')}
                />
                {/* {formState.errors.email && (
                  <span className="absolute bottom-0 right-0 translate-y-full rounded border border-danger bg-danger/20 p-1 px-2 text-xs text-white">
                    {formState.errors.email.message}
                  </span>
                )} */}
              </>
              // TODO : change message error display
            )}
          </div>
        )}
        <InputText
          label={intl.formatMessage({ id: 'subject' })}
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
