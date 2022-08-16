import { faWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserChild } from '@lib/types/interfaces';
import { FormErrorMessage } from '@lib/ui';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { PocketFaucet } from 'pocket-contract/typechain-types';
import { toast } from 'react-toastify';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

import { z } from 'zod';
import { useSmartContract } from '../../contexts/contract';
import { ContractMethodReturn } from '../../hooks/useContractRead';

import { useZodForm } from '../../utils/useZodForm';

type ChildSettingsFormProps = {
  child: UserChild;
  config: ContractMethodReturn<PocketFaucet, 'childToConfig'> | undefined;
  returnFn: () => void;
};

const ChildSettingsSchema = z.object({
  ceiling: z.string(),
  periodicity: z.string(),
});

type FormValues = z.infer<typeof ChildSettingsSchema>;

function ChildSettingsForm({
  child,
  config,
  returnFn,
}: ChildSettingsFormProps) {
  const { erc20, pocketContract } = useSmartContract();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm({
    schema: ChildSettingsSchema,
    defaultValues: {
      periodicity: formatUnits(config?.periodicity!, 0).toString(),
      ceiling: formatUnits(config?.[2]!, erc20.data?.decimals).toString(),
    },
  });
  const { config: changeConfigConfig } = usePrepareContractWrite({
    addressOrName: pocketContract.address,
    contractInterface: pocketContract.interface,
    functionName: 'changeConfig',
    args: [0, 1, child.address],
  });

  const { writeAsync: changeConfig } = useContractWrite({
    ...changeConfigConfig,
    onSuccess() {
      toast.success(`Configuration changed successfully`);
    },
    onError(e) {
      console.log(e.message);
      toast.error(`An error occured while changing your child configuration`);
    },
  });

  const { config: addChildConfig } = usePrepareContractWrite({
    addressOrName: pocketContract.address,
    contractInterface: pocketContract.interface,
    functionName: 'addChild',
    args: [0, 1, child.address],
  });

  const { writeAsync: addChild } = useContractWrite({
    ...addChildConfig,
    onSuccess() {
      toast.success(`Configuration changed successfully`);
    },
    onError(e) {
      console.log(e.message);
      toast.error(`An error occured while changing your child configuration`);
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (config?.lastClaim.isZero() && addChild)
      await addChild({
        recklesslySetUnpreparedArgs: [
          parseUnits(data.ceiling, erc20.data?.decimals),
          data.periodicity,
          child.address,
        ],
      });
    else if (changeConfig)
      await changeConfig({
        recklesslySetUnpreparedArgs: [
          parseUnits(data.ceiling, erc20.data?.decimals),
          data.periodicity,
          child.address,
        ],
      });
    else return;
    toast.info(`We are waiting for the network to validate your transfer`);
    returnFn();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-full flex-col items-end justify-between space-y-4"
    >
      <div className="flex items-center space-x-8">
        <label>Periodicity</label>
        <div className="flex flex-col space-x-2">
          <input
            type="radio"
            id="weekly"
            value="604800"
            {...register('periodicity')}
          />
          <label htmlFor="huey">Weekly</label>
        </div>

        <div className="flex flex-col space-x-2">
          <input
            type="radio"
            id="monthly"
            value="2592000"
            {...register('periodicity')}
          />
          <label htmlFor="dewey">Monthly</label>
        </div>
      </div>
      <div className="flex items-center space-x-8">
        <label htmlFor="topup">Ceiling</label>
        <input
          className="border p-2 text-dark"
          min="0"
          {...register('ceiling')}
          type="number"
        />
        {errors.ceiling && (
          <FormErrorMessage message={errors.ceiling.message} />
        )}
      </div>

      <div className="flex space-x-4">
        <button type="button" onClick={() => returnFn()}>
          return
        </button>
        <button type="submit" className="success-btn">
          <FontAwesomeIcon icon={faWrench} className="mr-2" />
          Apply
        </button>
      </div>
    </form>
  );
}

export default ChildSettingsForm;
