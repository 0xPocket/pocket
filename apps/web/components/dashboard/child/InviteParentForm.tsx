import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { z } from 'zod';
import { useZodForm } from '../../../utils/useZodForm';
import { trpc } from '../../../utils/trpc';
import { ChildSchema } from '../../../server/schemas';
import InputText from '../../common/InputText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import FormattedMessage from '../../common/FormattedMessage';
import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

type FormValues = z.infer<typeof ChildSchema['inviteParent']>;

function InviteParentForm() {
  const router = useRouter();
  const queryClient = trpc.useContext();
  const intl = useIntl();

  const { register, handleSubmit, setValue } = useZodForm({
    schema: ChildSchema['inviteParent'],
  });

  const inviteParent = trpc.useMutation(['child.inviteParent'], {
    // onSuccess: () => {
    //   queryClient.invalidateQueries('child.createParent');
    //   router.push('/');
    //   toast.success(<FormattedMessage id="parent-form.sent" />);
    // },
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
      className="container-classic flex flex-col gap-4 rounded-lg p-8"
    >
      <h2 className="">
        <FontAwesomeIcon icon={faUserPlus} className="mr-4" />
        <FormattedMessage id="parent-form.info" />
      </h2>
      <div className="flex flex-grow flex-col justify-evenly gap-4">
        <InputText
          label={intl.formatMessage({ id: 'email' })}
          register={register('email')}
        />
        <button disabled={inviteParent.isLoading} className="action-btn">
          <FormattedMessage id="submit" />
        </button>
      </div>
    </form>
  );
}

export default InviteParentForm;
