import { UserChild } from '@lib/types/interfaces';
import { FormErrorMessage } from '@lib/ui';
import { BigNumber, constants, Wallet } from 'ethers';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSmartContract } from '../../contexts/contract';
import Web3Modal from '../wallet/Web3Modal';

type AddfundsFormProps = {
  child: UserChild;
};

type FormValues = {
  topup: number;
};

function AddfundsForm({ child }: AddfundsFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();
  const [showModal, setShowModal] = useState(false);
  const {
    provider,
    USDTContract,
    contract: pocketContract,
  } = useSmartContract();

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
    console.log(tx);
  };

  const onSubmit = (data: FormValues) => {
    console.log(data);
    setShowModal(true);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center justify-between gap-4 rounded-lg bg-dark-light p-4"
    >
      <h2>Add funds</h2>
      <div className="flex flex-col">
        <label htmlFor="topup">Add funds to {child.firstName} account</label>
        <input
          className="border p-2"
          min="0"
          placeholder="5 $USDC"
          type="number"
          {...register('topup', {
            min: {
              value: 0,
              message: 'Topup cannot be negative',
            },
            max: {
              value: 20,
              message: 'Insufisant funds',
            },
          })}
        />
        {errors.topup && <FormErrorMessage message={errors.topup.message} />}
      </div>
      {/* 
      <Web3Modal
        contract={addFunds}
        isOpen={showModal}
        setIsOpen={setShowModal}
      /> */}

      <input
        type="submit"
        value="Apply"
        className="rounded-md bg-dark  px-4 py-3 text-bright"
      />
      <Web3Modal
        callback={increaseAllowance}
        isOpen={showModal}
        setIsOpen={setShowModal}
      />
    </form>
  );
}

export default AddfundsForm;
