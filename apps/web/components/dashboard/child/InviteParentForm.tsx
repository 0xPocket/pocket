import { toast } from 'react-toastify';
import { z } from 'zod';
import { useZodForm } from '../../../utils/useZodForm';
import { trpc } from '../../../utils/trpc';
import { ChildSchema } from '@pocket/api/schemas';
import InputText from '../../common/InputText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import FormattedMessage from '../../common/FormattedMessage';
import { useIntl } from 'react-intl';

type FormValues = z.infer<typeof ChildSchema['inviteParent']>;

function InviteParentForm() {
  const intl = useIntl();

  const { register, handleSubmit } = useZodForm({
    schema: ChildSchema['inviteParent'],
  });

  const inviteParent = trpc.child.inviteParent.useMutation({
    onSuccess: () => {
      toast.success(<FormattedMessage id="parent-form.sent" />);
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const onSubmit = (data: FormValues) => {
    inviteParent.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="container-classic m-auto flex w-2/5 flex-col gap-2 rounded-lg p-8"
    >
      <h3 className="text mb-2 ">
        <FontAwesomeIcon icon={faUserPlus} className="mr-4" />
        <FormattedMessage id="invite-parent" />
      </h3>
      <p className="text mb-4 italic">
        <FormattedMessage id="parent-form.info" />
      </p>
      <div className="mb-1 flex flex-grow flex-col justify-evenly gap-4">
        <InputText
          label={intl.formatMessage({ id: 'email' })}
          register={register('email')}
        />
      </div>
      <button disabled={inviteParent.isLoading} className="action-btn">
        <FormattedMessage id="send" />
      </button>
    </form>
  );
}

export default InviteParentForm;
