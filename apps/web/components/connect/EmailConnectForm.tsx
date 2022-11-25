// import { signIn } from 'next-auth/react';
import Image from 'next/future/image';
import { FC, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useAccount, useConnect } from 'wagmi';
import { z } from 'zod';
import { useMagicConnect } from '../../hooks/useMagicConnect';
import { useSignIn } from '../../hooks/useSignIn';
import { trpc } from '../../utils/trpc';
import { useZodForm } from '../../utils/useZodForm';
import FormattedMessage from '../common/FormattedMessage';
import InputText from '../common/InputText';
import { Spinner } from '../common/Spinner';

const EmailSchema = z.object({
  email: z.string().email(),
});

const EmailConnectForm: FC = () => {
  const { isConnected, connector } = useAccount();
  const {
    connectors,
    connectAsync,
    isLoading: connectIsLoading,
  } = useConnect();
  const { register, handleSubmit, formState } = useZodForm({
    mode: 'all',
    reValidateMode: 'onChange',
    schema: EmailSchema,
  });
  const { signIn, isLoading: signInIsLoading } = useSignIn();

  const checkEmail = trpc.connect.connect.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const magicSignIn = useMagicConnect();

  const onSubmit = async (data: z.infer<typeof EmailSchema>) => {
    try {
      await checkEmail.mutateAsync({
        email: data.email,
      });
    } catch (e) {
      return;
    }

    const didToken = await magicSignIn.mutateAsync(data.email);

    if (!isConnected || connector?.id !== 'magic') {
      await connectAsync({
        connector: connectors.find((c) => c.id === 'magic'),
      });
    }

    signIn('magic', {
      token: didToken,
      redirect: false,
    });
  };

  const isLoading = useMemo(() => {
    return (
      checkEmail.isLoading ||
      magicSignIn.isLoading ||
      connectIsLoading ||
      signInIsLoading
    );
  }, [checkEmail, magicSignIn, connectIsLoading, signInIsLoading]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex min-w-[300px] flex-col items-center"
    >
      <p className="mb-4 text-xl">
        <FormattedMessage id="connect.email.connect" />
      </p>
      <div className="flex w-full flex-col gap-4">
        <InputText register={register('email')} label="Email" />
        {isLoading ? (
          <Spinner />
        ) : (
          <button
            type="submit"
            className={`action-btn flex-none`}
            disabled={!formState.isValid}
          >
            <FormattedMessage id="signIn" />
          </button>
        )}
      </div>
      <div className=" mt-4 flex items-center justify-center text-xs">
        Powered by{' '}
        <a href="https://magic.link" target="_blank" rel="noreferrer">
          <Image
            src="/assets/providers/magic_logo.svg"
            width={65}
            height={24}
            alt="magic.link"
            className="ml-2"
          />
        </a>
      </div>
    </form>
  );
};

export default EmailConnectForm;
