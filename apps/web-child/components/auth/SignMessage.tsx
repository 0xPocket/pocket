import axios, { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { useMutation } from 'react-query';
import { useAccount, useNetwork, useSignMessage } from 'wagmi';
import { useAuth } from '../../contexts/auth';
import { Spinner } from '../common/Spinner';

type SignMessageProps = {
  register?: boolean;
};

const SignMessage: React.FC<SignMessageProps> = ({ register = false }) => {
  const { getMessage } = useAuth();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { signMessageAsync, isLoading } = useSignMessage();
  const router = useRouter();

  const registerWithToken = useMutation<
    AxiosResponse,
    AxiosError<{ error: string; message: string; statusCode: number }>
  >((data) => axios.post('/api/auth/ethereum/register', data));

  const verify = useMutation<
    AxiosResponse,
    AxiosError<{ error: string; message: string; statusCode: number }>
  >((data) => axios.post('/api/auth/ethereum/verify', data));

  const sign = useCallback(
    async (chainId: number, address: string) => {
      if (!address || !chainId) return;
      // We get a random nonce from our server

      // Sign the message

      // Send the signature to the server to verify it
      try {
        const message = await getMessage(address, chainId);
        const signature = await signMessageAsync({
          message: message.prepareMessage(),
        });

        if (register) {
          await registerWithToken.mutateAsync({
            message,
            signature,
            token: router.query.token,
          } as any);
        } else {
          await verify.mutateAsync({
            message,
            signature,
          } as any);
        }

        router.reload();
      } catch (e) {
        console.log(e);
      }
    },
    [router, getMessage, verify, register, registerWithToken, signMessageAsync],
  );

  return (
    <div className="flex w-96 flex-col items-center justify-center gap-2">
      {isLoading || verify.isLoading || registerWithToken.isLoading ? (
        <div className="flex w-48 justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <button
            className="relative flex w-48 flex-col items-center justify-center gap-4 rounded-lg border border-white-darker bg-[#161515]/25 p-4 font-sans font-bold hover:bg-[#161515]/75"
            disabled={
              isLoading || verify.isLoading || registerWithToken.isLoading
            }
            onClick={() => sign(chain?.id!, address!)}
          >
            Sign Message
          </button>
          {verify.isError && (
            <div className="text-sm text-danger">
              {verify.error.response?.data.message}
            </div>
          )}
          {registerWithToken.isError && (
            <div className="text-sm text-danger">
              {registerWithToken.error.response?.data.message}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SignMessage;
