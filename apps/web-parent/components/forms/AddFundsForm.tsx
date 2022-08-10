import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserChild } from '@lib/types/interfaces';
import { FormErrorMessage } from '@lib/ui';
import { ethers } from 'ethers';
import { parseUnits, Result } from 'ethers/lib/utils';
import { IERC20, PocketFaucet } from 'pocket-contract/typechain-types';
import { useForm } from 'react-hook-form';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { useSmartContract } from '../../contexts/contract';
import { ContractMethodReturn } from '../../hooks/useContractRead';
import { toast } from 'react-toastify';

// import useContractWrite from '../../hooks/useContractWrite';

type AddFundsFormProps = {
  child: UserChild;
  returnFn: () => void;
  allowance: Result | undefined;
  config: ContractMethodReturn<PocketFaucet, 'childToConfig'> | undefined;
};

type FormValues = {
  topup: number;
};

function stdApprove(contract: IERC20) {
  return {
    addressOrName: contract.address,
    contractInterface: contract.interface,
    functionName: 'approve',
    args: [
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
      ethers.constants.MaxUint256,
    ],
  };
}
const stdConfig = ['5000000000000000000', '604800'];

function toastSuccess(action: string) {
  toast.success(`Your ${action} is a success !`, {
    autoClose: 4000,
  });
}

function toastError(description: string) {
  toast.error(description, {
    autoClose: 4000,
  });
}

function toastOngoing(action: string) {
  toast.info(`Your ${action} is ongoing !`, {
    autoClose: 4000,
  });
}

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

  const { config: configApprove } = usePrepareContractWrite({
    ...stdApprove(erc20.contract),
  });
  const { config: addChildAndFundsConfig } = usePrepareContractWrite({
    addressOrName: pocketContract.address,
    contractInterface: pocketContract.interface,
    functionName: 'addChildAndFunds',
    args: [...stdConfig, child.address, 0],
    // overrides: { gasLimit: 3000000 },
  });
  const { config: addFundsConfig } = usePrepareContractWrite({
    addressOrName: pocketContract.address,
    contractInterface: pocketContract.interface,
    functionName: 'addFunds',
    args: [0, child.address],

    // overrides: { gasLimit: 3000000 },
  });

  const { writeAsync: approve } = useContractWrite({
    ...configApprove,
    onSuccess() {
      toastSuccess('approve');
    },
    onError() {
      toastSuccess('An error occured while doing your approve transaction');
    },
  });

  const { writeAsync: addChildAndFunds } = useContractWrite(
    addChildAndFundsConfig,
  );

  const { writeAsync: addFunds } = useContractWrite({
    ...addFundsConfig,
    onError: () => {
      toastError('An error occured while doing your deposit transaction');
    },
    onSuccess() {
      toastSuccess('funds deposit');
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!address || !data || !data.topup) return;
    if (
      allowance?.lt(parseUnits(data.topup.toString(), erc20.data?.decimals)) &&
      approve
    ) {
      await approve();
      toastOngoing('approve');
    }

    if (config?.lastClaim.isZero() && addChildAndFunds) {
      await addChildAndFunds({
        recklesslySetUnpreparedArgs: [
          ...stdConfig,
          child.address,
          ethers.utils.parseUnits(data.topup.toString(), erc20.data?.decimals),
        ],
      });
    } else if (addFunds) {
      await addFunds({
        recklesslySetUnpreparedArgs: [
          ethers.utils.parseUnits(data.topup.toString(), erc20.data?.decimals),
          child.address,
        ],
      });
    } else return toastError('An error occured, please try again');
    toastOngoing('deposit');
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
