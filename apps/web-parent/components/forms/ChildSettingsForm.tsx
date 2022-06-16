import { UserChild } from '@lib/types/interfaces';
import { FormErrorMessage } from '@lib/ui';
import { ParentContract } from 'pocket-contract/ts';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useSmartContract } from '../../contexts/contract';
import { useWallet } from '../../contexts/wallet';
import { useAxios } from '../../hooks/axios.hook';
import Web3Modal from '../wallet/Web3Modal';

type ChildSettingsFormProps = {
  child: UserChild;
};

type FormValues = {
  ceiling: number;
  periodicity: number;
};

function ChildSettingsForm({ child }: ChildSettingsFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();
  const [showModal, setShowModal] = useState(false);
  const { provider, contract } = useSmartContract();
  const { data, refetch } = useQuery(
    'config',
    async () => {
      const ret = await contract?.childToConfig(child.web3Account.address);
      console.log(ret);
      return ret;
    },
    {
      enabled: false,
    },
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

  // console.log(data);

  const formValues = watch();

  const axios = useAxios();

  const changeConfig = (contract: ParentContract) => {
    console.log('changeConfig', formValues);
    contract
      .changeConfig(
        formValues.ceiling,
        formValues.periodicity,
        child.web3Account.address,
      )
      .then(async (res) => {
        const response = await axios.post('/api/ethereum/broadcast', {
          hash: res,
          type: 'CHANGE_CONFIG',
          childAddress: child.web3Account.address,
        });
        await provider?.waitForTransaction(response.data.hash);
        refetch();
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
      <h2>Settings</h2>

      <div className="flex flex-col">
        <label htmlFor="topup">Weekly ceiling</label>

        <input
          className="border p-2 text-dark"
          placeholder={data?.[2]?.toString() + '$'}
          min="0"
          {...register('ceiling', {
            min: {
              value: 0,
              message: 'Ceiling cannot be negative',
            },
          })}
          type="number"
        />
        {errors.ceiling && (
          <FormErrorMessage message={errors.ceiling.message} />
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="topup">Periodicity</label>

        <input
          className="border p-2 text-dark"
          placeholder={data?.[4]?.toString() + ' days'}
          min="0"
          {...register('periodicity', {
            min: {
              value: 0,
              message: 'Periodicity cannot be negative',
            },
          })}
          type="number"
        />
        {errors.periodicity && (
          <FormErrorMessage message={errors.periodicity.message} />
        )}
      </div>

      <Web3Modal
        contract={changeConfig}
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

export default ChildSettingsForm;
