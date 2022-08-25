// import Link from 'next/link';
import { Button, Header, ThemeToggler } from '@lib/ui';
import WalletPopover from '../wallet/WalletPopover';
import { useMagic } from '../../contexts/auth';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { Spinner } from '../common/Spinner';
import Status from './Status';

type GlobalHeaderProps = {};

function GlobalHeader({}: GlobalHeaderProps) {
  return (
    <Header>
      <Header.BlockLeft>
        <Header.Title href="/">Pocket.</Header.Title>
      </Header.BlockLeft>
      <Header.BlockRight>
        <Status />

        <ThemeToggler />
      </Header.BlockRight>
    </Header>
  );
}

export default GlobalHeader;
