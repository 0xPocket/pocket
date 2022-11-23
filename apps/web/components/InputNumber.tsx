import { FC, useEffect, useRef } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { useAccount, useBalance } from 'wagmi';
import { useSmartContract } from '../contexts/contract';
import FormattedMessage from './common/FormattedMessage';
import FormattedNumber from './common/FormattedNumber';

type InputNumberProps = {
  register: UseFormRegisterReturn;
  withBalance?: boolean;
  onMax?: () => void;
  initWidth?: number;
  children?: React.ReactNode;
};
const InputNumber: FC<InputNumberProps> = ({
  register,
  withBalance = false,
  onMax,
  initWidth = 1,
  children,
}) => {
  const { address } = useAccount();
  const { erc20 } = useSmartContract();

  const { data: erc20Balance } = useBalance({
    address,
    token: erc20?.address,
    watch: true,
    enabled: withBalance,
  });

  const amountRef = useRef<HTMLInputElement | null>(null);

  const { ref, onChange, ...rest } = register;

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    e.currentTarget.style.width = `${e.currentTarget.value.length || 1}ch`;
  };

  useEffect(() => {
    if (amountRef.current) {
      amountRef.current.style.width = `${initWidth}ch`;
    }
  }, [initWidth]);

  return (
    <>
      <div className="flex items-center justify-center">
        <span className="mr-1 text-3xl">$</span>

        <input
          className="input-number-bis w-4"
          placeholder="0"
          type="number"
          autoComplete="off"
          min="0"
          {...rest}
          onChange={onChangeHandler}
          ref={(e) => {
            ref(e);
            amountRef.current = e; // you can still assign to ref
          }}
        />
      </div>
      {withBalance && (
        <div className="flex w-full items-center justify-center gap-2 text-center">
          {erc20Balance && (
            <span className="text-sm text-gray">
              <FormattedMessage id="balance" />:{' '}
              <FormattedNumber value={erc20Balance.value} />
            </span>
          )}
          <button
            className="rounded bg-primary px-2 text-sm"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onMax?.();
              amountRef.current!.style.width = `${
                amountRef.current!.value.length || 1
              }ch`;
            }}
          >
            Max
          </button>
          {children}
        </div>
      )}
    </>
  );
};

export default InputNumber;
