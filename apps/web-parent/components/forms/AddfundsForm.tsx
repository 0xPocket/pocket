import { UserChild } from '@lib/types/interfaces';
import { FormErrorMessage } from '@lib/ui';
import { ParentContract } from 'pocket-contract/ts';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useSmartContract } from '../../contexts/contract';
import { useAxios } from '../../hooks/axios.hook';
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
  const formValues = watch();
  const axios = useAxios();
  const { provider } = useSmartContract();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);

  const addFunds = (contract: ParentContract) => {
    contract
      .addFunds(formValues.topup, child.web3Account.address)
      .then(async (res) => {
        const response = await axios.post('/api/ethereum/broadcast', {
          hash: res,
          type: 'ADD_FUNDS',
          childAddress: child.web3Account.address,
        });
        await provider?.waitForTransaction(response.data.hash);
        queryClient.invalidateQueries('config');
      });
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

      <Web3Modal
        contract={addFunds}
        isOpen={showModal}
        setIsOpen={setShowModal}
      />

      <input
        type="submit"
        value="Apply"
        className="rounded-md bg-dark  px-4 py-3 text-bright"
      />
    </form>
  );
}

export default AddfundsForm;
