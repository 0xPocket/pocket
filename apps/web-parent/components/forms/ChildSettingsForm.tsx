import { faWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserChild } from '@lib/types/interfaces';
import { FormErrorMessage } from '@lib/ui';
import { ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { ParentContract } from 'pocket-contract/ts';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useSmartContract } from '../../contexts/contract';
import { useAxios } from '../../hooks/axios.hook';
import Web3Modal from '../wallet/Web3Modal';

type ChildSettingsFormProps = {
  child: UserChild;
  config: any;
  returnFn: () => void;
};

type FormValues = {
  ceiling: string;
  periodicity: string;
};

function ChildSettingsForm({
  child,
  config,
  returnFn,
}: ChildSettingsFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      periodicity: ethers.utils.formatUnits(config?.[4], 0).toString(),
      ceiling: ethers.utils.formatUnits(config?.[2], 6).toString(),
    },
  });

  const [showModal, setShowModal] = useState(false);
  const { provider, erc20Decimals } = useSmartContract();
  const formValues = watch();
  const axios = useAxios();
  const queryClient = useQueryClient();

  const changeConfig = (contract: ParentContract) => {
    console.log('changeConfig', formValues);
    contract
      .changeConfig(
        parseUnits(formValues.ceiling, erc20Decimals),
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
        queryClient.invalidateQueries('config');
      });
    returnFn();
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
      <div className="flex items-center space-x-8">
        <label>Periodicity</label>
        <div className="flex flex-col space-x-2">
          <input
            type="radio"
            id="weekly"
            value="7"
            {...register('periodicity')}
          />
          <label htmlFor="huey">Weekly</label>
        </div>

        <div className="flex flex-col space-x-2">
          <input
            type="radio"
            id="monthly"
            value="30"
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

      <div className="flex space-x-4">
        <button type="button" onClick={() => returnFn()}>
          return
        </button>
        <button type="submit" className="success-btn">
          <FontAwesomeIcon icon={faWrench} className="mr-2" />
          Apply
        </button>
      </div>
      <Web3Modal
        contract={changeConfig}
        isOpen={showModal}
        setIsOpen={setShowModal}
      />
    </form>
  );
}

export default ChildSettingsForm;
