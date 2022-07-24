import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserChild } from '@lib/types/interfaces';
import { FormErrorMessage } from '@lib/ui';
import { BigNumber } from 'ethers';
import { parseUnits, Result } from 'ethers/lib/utils';
import { useForm } from 'react-hook-form';
import { useAccount } from 'wagmi';
import { useSmartContract } from '../../contexts/contract';
import useContractWrite from '../../hooks/useContractWrite';

type AddFundsFormProps = {
  child: UserChild;
  returnFn: () => void;
  allowance: Result | undefined;
};

type FormValues = {
  topup: number;
};

function AddFundsForm({ allowance, child, returnFn }: AddFundsFormProps) {
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

  const { writeAsync: addFunds } = useContractWrite({
    contract: pocketContract,
    functionName: 'addFunds',
  });

  const onSubmit = async (data: FormValues) => {
    if (!address) {
      return;
    }

    if (allowance?.lt(data.topup)) {
      await approve({
        args: [
          process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
          parseUnits(data.topup.toString(), erc20.data?.decimals),
        ],
      });
    }

    await addFunds({
      args: [
        BigNumber.from(data.topup).mul(1000000),
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
      <label htmlFor="topup">Add funds to {child.firstName} account</label>
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
