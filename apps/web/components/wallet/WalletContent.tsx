import MainTabPanel from './MainTabPanel';
import { WalletAnimation } from '@lib/ui';

type WalletContentProps = {};

function WalletContent({}: WalletContentProps) {
  return (
    <WalletAnimation>
      <div className="w-[400px] rounded-lg bg-bright py-4 px-8 shadow-lg dark:bg-dark-light">
        <MainTabPanel />
      </div>
    </WalletAnimation>
  );
}

export default WalletContent;
