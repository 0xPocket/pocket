import { faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatUnits } from 'ethers/lib/utils.js';
import { PocketFaucetAbi } from 'pocket-contract/abi';
import { FC, useState } from 'react';
import { useSmartContract } from '../../../contexts/contract';
import { ExtractAbiReturnType } from '../../../utils/abi-types';
import FormattedMessage from '../../common/FormattedMessage';
import FormattedNumber from '../../common/FormattedNumber';
import { DialogPopupWrapper } from '../../common/wrappers/DialogsWrapper';

type SettingsDialogProps = {
  config: ExtractAbiReturnType<typeof PocketFaucetAbi, 'childToConfig'>;
};

const SettingsDialog: FC<SettingsDialogProps> = ({ config }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { erc20 } = useSmartContract();

  return (
    <div>
      <FontAwesomeIcon
        icon={faGear}
        onClick={() => setIsOpen(true)}
        className="cursor-pointer"
      />
      <DialogPopupWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="">
          {/* <h1>My Vault Settings</h1> */}
          <div className="grid gap-12 md:grid-cols-2">
            <div className="space-y-4 md:space-y-8">
              <h2 className="text-center">Vault balance</h2>
              <div className="text-center text-4xl text-pink md:text-6xl ">
                $<FormattedNumber value={config.balance} />
              </div>
            </div>
            <div className="space-y-4 md:space-y-8">
              <h2 className="text-center">Settings</h2>
              <div className="">
                <p className="flex items-center justify-between">
                  <FormattedMessage id="periodicity" /> :
                  <span className="text-2xl md:text-3xl">
                    {formatUnits(config.periodicity, 0) === '604800' ? (
                      <FormattedMessage id="weekly" />
                    ) : (
                      <FormattedMessage id="monthly" />
                    )}
                  </span>
                </p>
                <p className="flex items-center justify-between">
                  <FormattedMessage id="ceiling" /> :
                  <span className="text-2xl md:text-3xl">
                    {Number(
                      formatUnits(config.ceiling, erc20?.decimals),
                    ).toFixed(2)}
                    $
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogPopupWrapper>
    </div>
  );
};

export default SettingsDialog;
