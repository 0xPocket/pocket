import { faWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserChild } from '@lib/types/interfaces';
import { FormErrorMessage } from '@lib/ui';
import { ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { useContractWrite } from 'wagmi';
import { z } from 'zod';
import { useSmartContract } from '../../contexts/contract';
import { useZodForm } from '../../utils/useZodForm';

type ChildSettingsFormProps = {
  child: UserChild;
  config: any;
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm({
    schema: ChildSettingsSchema,
    defaultValues: {
      periodicity: ethers.utils.formatUnits(config?.[4], 0).toString(),
      ceiling: ethers.utils.formatUnits(config?.[2], 6).toString(),
    },
  });

  const { erc20Data, abi } = useSmartContract();

  const { writeAsync: changeConfig } = useContractWrite({
    addressOrName: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
    functionName: 'changeConfig',
    contractInterface: abi,
  });

  const onSubmit = async (data: FormValues) => {
    await changeConfig({
      args: [
        parseUnits(data.ceiling.toString(), erc20Data?.decimals),
        data.periodicity,
        child.web3Account.address,
      ],
    });
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
