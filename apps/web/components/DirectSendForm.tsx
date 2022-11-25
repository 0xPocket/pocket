import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils.js';
import Link from 'next/link';
import { USDCAbi } from 'pocket-contract/abi/USDCAbi';
import { FC, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import { useAccount, useBalance } from 'wagmi';
import { z } from 'zod';
import { useSmartContract } from '../contexts/contract';
import { useSendMetaTx } from '../hooks/useSendMetaTx';
import useTransak from '../hooks/useTransak';
import { useTransferTx } from '../hooks/useTransferTx';
import { useZodForm } from '../utils/useZodForm';
import FormattedMessage from './common/FormattedMessage';
import { Spinner } from './common/Spinner';
import InputNumber from './InputNumber';

type DirectSendFormProps = {
  childAddress: string;
};

const DirectSendForm: FC<DirectSendFormProps> = ({ childAddress }) => {
  const { showTransak, status } = useTransak();

  const { address } = useAccount();

  const { erc20 } = useSmartContract();

  const { data: erc20Balance } = useBalance({
    address,
    token: erc20?.address,
    watch: true,
  });

  const intl = useIntl();

  const { write, isLoading } = useSendMetaTx({
    abi: USDCAbi,
    functionName: 'transferWithAuthorization',
    address: erc20?.address,
    onMutate: () => {
      toast.dismiss();
      toast.info(intl.formatMessage({ id: 'transaction.pending' }), {
        isLoading: true,
      });
    },
    onSuccess: async () => {
      toast.dismiss();
      toast.success(intl.formatMessage({ id: 'add-child-and-funds.success' }));
      reset();
    },
    onError() {
      toast.error(intl.formatMessage({ id: 'add-child-and-funds.error' }));
    },
  });

  const isTransak = useMemo(() => {
    return erc20Balance?.value.isZero();
  }, [erc20Balance]);

  const DirectSendFormSchema = z.object({
    amount: z
      .number()
      .min(isTransak ? 30 : 1)
      .max(Number(erc20Balance?.formatted) || 999999999),
  });

  const {
    handleSubmit,
    register,
    formState: { isValid },
    setFocus,
    setValue,
    reset,
  } = useZodForm({
    reValidateMode: 'onChange',
    mode: 'all',
    schema: DirectSendFormSchema,
  });

  const { signTransfer, isLoading: transferSignatureLoading } = useTransferTx({
    contractAddress: erc20?.address,
  });

  useEffect(() => {
    setFocus('amount');
  }, [setFocus]);

  if (status) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2">
        {status === 'order_completed' ? (
          <>
            <h3 className="font-bold">
              <FormattedMessage id="order_complete" />
            </h3>
            <Link href={`/account/${childAddress}`}>
              <a className="action-btn mt-4">
                <FormattedMessage id="go_dashboard" />
              </a>
            </Link>
          </>
        ) : (
          <>
            <h3 className=" mx-auto text-center font-bold ">
              <FormattedMessage id="transak_processing" />
            </h3>
            <p className="mb-4 text-sm text-gray">
              <FormattedMessage id="email_done" />
            </p>
            <Spinner />
          </>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        if (isTransak) {
          showTransak({
            address: childAddress,
            amount: data.amount,
            tracking: true,
            autoClose: false,
          });
        } else {
          if (address) {
            const res = await signTransfer(
              address,
              childAddress,
              parseUnits(data.amount.toString(), erc20?.decimals).toString(),
            );

            if (res) {
              write([
                address,
                childAddress,
                parseUnits(data.amount.toString(), erc20?.decimals),
                BigNumber.from(res.validAfter),
                BigNumber.from(res.validBefore),
                res.nonce,
                res.signature.v,
                res.signature.r,
                res.signature.s,
              ]);
            }
          }
        }
      })}
      className="flex h-full w-full flex-col items-center justify-center gap-8"
    >
      <div className="flex flex-col items-center space-y-6">
        <p className="font-bold">
          <FormattedMessage id="send.direct.howmuch" />
        </p>
        <InputNumber
          register={register('amount', { valueAsNumber: true })}
          withBalance={!isTransak}
          onMax={() =>
            setValue('amount', Number(erc20Balance?.formatted), {
              shouldValidate: true,
            })
          }
        />
        {isTransak && <p className="mx-auto text-sm text-gray">Minimum: $30</p>}
      </div>
      <button
        type="submit"
        className="action-btn"
        disabled={!isValid || isLoading || transferSignatureLoading}
      >
        {isLoading || transferSignatureLoading ? (
          <Spinner base />
        ) : (
          <span className="mr-2">🚀</span>
        )}
        <FormattedMessage id="send" />
      </button>
    </form>
  );
};

export default DirectSendForm;
