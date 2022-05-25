import { Dispatch, SetStateAction } from 'react';
import { useWallet } from '../../contexts/wallet';
import Button from '../common/Button';

type SettingsTabPanelProps = {
  setSelectedIndex: Dispatch<SetStateAction<number>>;
};

function SettingsTabPanel({ setSelectedIndex }: SettingsTabPanelProps) {
  const { wallet, requestDecrypt } = useWallet();

  return (
    <>
      <div className="flex items-center gap-4 border-b pb-4">
        <Button action={() => setSelectedIndex(0)}>back</Button>
        <h2 className="">Settings</h2>
      </div>
      <div className="flex flex-col gap-2 pb-4">
        <h3>My address</h3>
        <div className="rounded-md bg-dark p-2 text-bright">
          <p className="break-words">{wallet.publicKey}</p>
        </div>
        <h3>My private key</h3>
        <div className="relative overflow-hidden rounded-md bg-dark p-2 text-bright">
          {wallet?.privateKey && (
            <p className="select-none break-words blur-sm">
              {wallet.privateKey}
            </p>
          )}
          {!wallet?.privateKey && (
            <Button action={() => requestDecrypt()}>Show Private Key</Button>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2 pb-4"></div>
    </>
  );
}

export default SettingsTabPanel;
