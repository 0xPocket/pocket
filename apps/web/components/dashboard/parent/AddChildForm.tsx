import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { z } from 'zod';
import { useZodForm } from '../../../utils/useZodForm';
import { trpc } from '../../../utils/trpc';
import { ParentSchema } from '@pocket/api/schemas';
import InputText from '../../common/InputText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import FormattedMessage from '../../common/FormattedMessage';
import { useIntl } from 'react-intl';

type FormValues = z.infer<typeof ParentSchema['createChild']>;

function AddChildForm() {
  const router = useRouter();
  const queryClient = trpc.useContext();
  const intl = useIntl();

  const { register, handleSubmit } = useZodForm({
    schema: ParentSchema['createChild'],
  });

  const addChild = trpc.parent.createChild.useMutation({
    onSuccess: () => {
      queryClient.parent.pendingChildren.invalidate().then(() => {
        router.push('/');
      });
      toast.success(<FormattedMessage id="child-form.created" />);
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const onSubmit = (data: FormValues) => {
    addChild.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="container-classic flex flex-col gap-4 rounded-lg p-8"
    >
      <h2 className="">
        <FontAwesomeIcon icon={faUserPlus} className="mr-4" />
        <FormattedMessage id="child-form.info" />
      </h2>
      <div className="flex flex-grow flex-col justify-evenly gap-4">
        <InputText
          label={intl.formatMessage({ id: 'name' })}
          register={register('name')}
        />
        <InputText
          label={intl.formatMessage({ id: 'email' })}
          register={register('email')}
        />
        <button disabled={addChild.isLoading} className="action-btn">
          <FormattedMessage id="submit" />
        </button>
      </div>
    </form>
  );
}

export default AddChildForm;
