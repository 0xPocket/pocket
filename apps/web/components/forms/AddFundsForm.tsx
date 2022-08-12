import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserChild } from '@lib/types/interfaces';
import { FormErrorMessage } from '@lib/ui';
import { ethers } from 'ethers';
import { parseUnits, Result } from 'ethers/lib/utils';
import { PocketFaucet } from 'pocket-contract/typechain-types';
import { useForm } from 'react-hook-form';
import { useAccount } from 'wagmi';
import { useSmartContract } from '../../contexts/contract';
import { ContractMethodReturn } from '../../hooks/useContractRead';
import useContractWrite from '../../hooks/useContractWrite';

type AddFundsFormProps = {
  child: UserChild;
  returnFn: () => void;
  allowance: Result | undefined;
  config: ContractMethodReturn<PocketFaucet, 'childToConfig'> | undefined;
};

type FormValues = {
  topup: number;
};

function AddFundsForm({
  allowance,
  child,
  config,
  returnFn,
}: AddFundsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const { address } = useAccount();
  const { pocketContract, erc20 } = useSmartContract();

  const { writeAsync: approve } = useContractWrite({
    contract: erc20.contract,
    functionName: 'approve',
  });

  const { writeAsync: addChildAndFunds } = useContractWrite({
    contract: pocketContract,
    functionName: 'addChildAndFunds',
  });

  const { writeAsync: addFunds } = useContractWrite({
    contract: pocketContract,
    functionName: 'addFunds',
  });

  console.log(allowance);
  const onSubmit = async (data: FormValues) => {
    if (!address) {
      return;
    }

    if (
      allowance?.lt(parseUnits(data.topup.toString(), erc20.data?.decimals))
    ) {
      await approve({
        args: [
          process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
          parseUnits(data.topup.toString(), erc20.data?.decimals),
        ],
      });
    }

    if (config?.lastClaim.isZero())
      await addChildAndFunds({
        args: [
          '5000000000000000000',
          '604800',
          child.address,
          ethers.utils.parseUnits(data.topup.toString(), erc20.data?.decimals),
        ],
        overrides: { gasLimit: 3000000 },
      });
    else
      await addFunds({
        args: [
          ethers.utils.parseUnits(data.topup.toString(), erc20.data?.decimals),
          child.address,
        ],
        overrides: { gasLimit: 3000000 },
      });

    returnFn();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-full flex-col items-end justify-between space-y-4"
    >
      <label htmlFor="topup">Add funds to {child.name} account</label>
      <input
        className="border p-2 text-dark"
        min="1"
        placeholder="5 $USDC"
        type="number"
        {...register('topup', {
          min: {
            value: 1,
            message: 'Topup cannot be negative',
          },
          // max: {
          //   value: 20,
          //   message: 'Insufisant funds',
          // },
        })}
      />
      {errors.topup && <FormErrorMessage message={errors.topup.message} />}

      <div className="flex space-x-4">
        <button type="button" onClick={() => returnFn()}>
          return
        </button>
        <button type="submit" value="Send" className="success-btn">
          <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
          Send
        </button>
      </div>
    </form>
  );
}

export default AddFundsForm;
