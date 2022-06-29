import { Button, Header, ThemeToggler } from '@lib/ui';
import { useAccount, useConnect } from 'wagmi';
import { useWeb3Auth } from '../../contexts/web3hook';
import { InjectedConnector } from 'wagmi/connectors/injected';

type GlobalHeaderProps = {};

function GlobalHeader({}: GlobalHeaderProps) {
  // const { user, address, status, toggleModal, disconnect } = useWeb3Auth();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  return (
    <Header>
      <Header.BlockLeft>
        <Header.Title>Child</Header.Title>
        <Header.Nav show={false}>
          <Header.NavLink href="/dashboard">Dashboard</Header.NavLink>
          <Header.NavLink href="#">Blog</Header.NavLink>
          <Header.NavLink href="#">FAQ</Header.NavLink>
        </Header.Nav>
      </Header.BlockLeft>
      <Header.BlockRight>
        {isConnected ? (
          <div>{address}</div>
        ) : (
          <Button action={() => connect()}>Connect Wallet</Button>
        )}

        <ThemeToggler />
      </Header.BlockRight>
    </Header>
  );

  // return (
  //   <Header>
  //     <Header.BlockLeft>
  //       <Header.Title>Child</Header.Title>
  //       <Header.Nav show={status === 'authenticated'}>
  //         <Header.NavLink href="/dashboard">Dashboard</Header.NavLink>
  //         <Header.NavLink href="#">Blog</Header.NavLink>
  //         <Header.NavLink href="#">FAQ</Header.NavLink>
  //       </Header.Nav>
  //     </Header.BlockLeft>
  //     <Header.BlockRight>
  //       {status === 'authenticated' ? (
  //         <>
  //           {user?.firstName} ({address?.substring(0, 4)}...){' '}
  //           <Button action={() => disconnect()}>Disconnect Wallet</Button>
  //         </>
  //       ) : (
  //         <Button action={() => toggleModal('login')}>Connect Wallet</Button>
  //       )}

  //       <ThemeToggler />
  //     </Header.BlockRight>
  //   </Header>
  // );
}

export default GlobalHeader;
