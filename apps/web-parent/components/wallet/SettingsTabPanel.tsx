import { Dispatch, SetStateAction, useState } from 'react';
import { useWallet } from '../../contexts/wallet';
import Web3Button from './Web3Button';
import { Button } from '@lib/ui';

type SettingsTabPanelProps = {
  setSelectedIndex: Dispatch<SetStateAction<number>>;
};

function SettingsTabPanel({ setSelectedIndex }: SettingsTabPanelProps) {
  const { wallet } = useWallet();
  const [privateKey, setPrivateKey] = useState<string>();

  return (
    <>
      <div className="mb-4 flex items-center gap-4 border-b pb-4">
        <Button action={() => setSelectedIndex(0)}>back</Button>
        <h2 className="">Settings</h2>
      </div>
      <div className="flex flex-col gap-2 ">
        <h3>My address</h3>
        <div className="rounded-md bg-dark p-2 text-bright">
          <p className="break-words">{wallet?.publicKey}</p>
        </div>
        <h3>My private key</h3>
        <div className="relative overflow-hidden break-words rounded-md bg-dark p-2 text-bright">
          {privateKey ? (
            <div>{privateKey}</div>
          ) : (
            <Web3Button callback={(signer) => setPrivateKey(signer.privateKey)}>
              Show Private Key
            </Web3Button>
          )}
        </div>
      </div>
    </>
  );
}

export default SettingsTabPanel;
