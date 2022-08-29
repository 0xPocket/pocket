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
      '0xf000000000000000000000000000000000000000000000000000000000000000',
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
    overrides: { gasLimit: '3000000' }, // TEMPORARY. necessary on testnet
  });
  const { config: addFundsConfig } = usePrepareContractWrite({
    addressOrName: pocketContract.address,
    contractInterface: pocketContract.interface,
    functionName: 'addFunds',
    overrides: { gasLimit: '3000000' }, // TEMPORARY. necessary on testnet

    args: [0, child.address],
  });

  const { writeAsync: approve } = useContractWrite({
    ...configApprove,
    onError(e) {
      toast.error(
        `An error occured while doing your approve transaction: ${e.message}`,
      );
    },
  });

  const { writeAsync: addChildAndFunds } = useContractWrite({
    ...addChildAndFundsConfig,
    onError(e) {
      toast.error(`An error occured while doing your deposit: ${e.message}`);
    },
  });

  const { writeAsync: addFunds } = useContractWrite({
    ...addFundsConfig,
    onError(e) {
      toast.error(`An error occured while doing your deposit: ${e.message}`);
    },
  });

  const onSubmit = async (data: FormValues) => {
    const amount = parseUnits(data.topup.toString(), erc20.data?.decimals);
    let ret;
    let info;
    if (!address || !data?.topup) return;
    if (balance?.lt(amount))
      return toast.error(
        "You don't have enough usdc, but you can get more in your wallet on the top right",
      );
    if (allowance?.lt(amount) && approve) {
      toast.info(
        "Since it's your first deposit you will have to validate 2 operations",
      );
      const ret = await approve();
      info = toast.info(
        `The network is validating your approve. It may takes between 30 and 60 seconds, please wait`,
        {
          isLoading: true,
        },
      );
      await ret.wait();
      toast.dismiss(info);
      toast.success(
        `Your transaction is validated, please validate the second one`,
      );
    }

    if (config?.lastClaim.isZero() && addChildAndFunds) {
      ret = await addChildAndFunds({
        recklesslySetUnpreparedArgs: [...stdConfig, child.address, amount],
      });
    } else if (addFunds) {
      ret = await addFunds({
        recklesslySetUnpreparedArgs: [amount, child.address],
      });
    } else return toast.error(`An error occured, please try again`);
    info = toast.info(
      `The network is validating your transfer. It may takes between 30 and 60 seconds, please wait`,
      { isLoading: true },
    );
    const result = await ret?.wait();
    toast.dismiss(info);
    if (result) toast.success(`The transfer is a success`);
    // TO DO send email saying it's a success
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
