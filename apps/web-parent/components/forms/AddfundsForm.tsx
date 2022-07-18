import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserChild } from '@lib/types/interfaces';
import { FormErrorMessage } from '@lib/ui';
import { BigNumber, constants, Wallet } from 'ethers';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useSmartContract } from '../../contexts/contract';
import Web3Modal from '../wallet/Web3Modal';

type AddfundsFormProps = {
  child: UserChild;
  returnFn: () => void;
};

type FormValues = {
  topup: number;
};

function AddfundsForm({ child, returnFn }: AddfundsFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();
  const [showModal, setShowModal] = useState(false);
  const { USDTContract, contract: pocketContract } = useSmartContract();
  const queryClient = useQueryClient();

  const formValues = watch();

  const increaseAllowance = async (signer: Wallet) => {
    const contract = USDTContract?.connect(signer);

    const allowance = await contract?.allowance(
      signer.address,
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
    );

    console.log('allowance :', allowance?.toString());

    if (allowance?.lt(formValues.topup)) {
      console.log('approve allowance infinite');
      await contract?.approve(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
        constants.MaxUint256,
      );
    }
    console.log('sending funds ...');
    console.log((await contract?.balanceOf(signer.address))?.toString());
    console.log(BigNumber.from(formValues.topup).mul(1000000).toString());
    const tx = await pocketContract
      ?.connect(signer)
      .addFunds(
        BigNumber.from(formValues.topup).mul(1000000),
        child.web3Account.address,
      );
    tx?.wait().then(() => {
      console.log('invalidate query');
      queryClient.invalidateQueries('config');
    });
    returnFn();
    // console.log(tx);
  };

  const onSubmit = (data: FormValues) => {
    console.log(data);
    setShowModal(true);
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

      <Web3Modal
        callback={increaseAllowance}
        isOpen={showModal}
        setIsOpen={setShowModal}
      />
    </form>
  );
}

export default AddfundsForm;
