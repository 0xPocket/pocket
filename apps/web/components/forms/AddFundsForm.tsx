import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserChild } from '@lib/types/interfaces';
import { FormErrorMessage } from '@lib/ui';
import { BigNumber, ethers } from 'ethers';
import { parseUnits, Result } from 'ethers/lib/utils';
import { IERC20, PocketFaucet } from 'pocket-contract/typechain-types';
import { useForm } from 'react-hook-form';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { useSmartContract } from '../../contexts/contract';
import { ContractMethodReturn } from '../../hooks/useContractRead';
import { toast } from 'react-toastify';

type AddFundsFormProps = {
  child: UserChild;
  returnFn: () => void;
  allowance: Result | undefined;
  config: ContractMethodReturn<PocketFaucet, 'childToConfig'> | undefined;
  balance: (Result & [BigNumber]) | undefined;
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

function AddFundsForm({
  allowance,
  child,
  config,
  returnFn,
  balance,
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
  });
  const { config: addFundsConfig } = usePrepareContractWrite({
    addressOrName: pocketContract.address,
    contractInterface: pocketContract.interface,
    functionName: 'addFunds',
    args: [0, child.address],
  });

  const { writeAsync: approve } = useContractWrite({
    ...configApprove,
    onSuccess() {
      toast.success(
        `First transaction validated, please validate the second one`,
      );
    },
    onError(e) {
      console.log(e.message);
      toast.error(`An error occured while doing your approve transaction`);
    },
  });

  const { writeAsync: addChildAndFunds } = useContractWrite({
    ...addChildAndFundsConfig,
    onError(e) {
      toast.error(`An error occured while doing your deposit: ${e.message}`);
    },
    onSuccess() {
      toast.success(`Deposit is a success`);
    },
  });

  const { writeAsync: addFunds } = useContractWrite({
    ...addFundsConfig,
    onError(e) {
      toast.error(`An error occured while doing your deposit: ${e.message}`);
    },
    onSuccess() {
      toast.success(`Deposit is a success`);
    },
  });

  const onSubmit = async (data: FormValues) => {
    const amount = parseUnits(data.topup.toString(), erc20.data?.decimals);
    if (!address || !data?.topup) return;
    if (balance?.lt(amount))
      return toast.error("You don't have enough usdc...");
    if (allowance?.lt(amount) && approve) {
      const ret = await approve();
      toast.info(`Network is validating your transaction`);
      await ret.wait();
    }

    if (config?.lastClaim.isZero() && addChildAndFunds) {
      await addChildAndFunds({
        recklesslySetUnpreparedArgs: [...stdConfig, child.address, amount],
      });
    } else if (addFunds) {
      await addFunds({
        recklesslySetUnpreparedArgs: [amount, child.address],
      });
    } else return toast.error(`An error occured, please try again`);
    toast.info(`We are waiting for the network to validate your transfer`);
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
