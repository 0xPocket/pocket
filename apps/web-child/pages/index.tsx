import { formatEther } from 'ethers/lib/utils';
import { useEffect, useState } from 'react';
import Button from '../components/common/Button';
import MainWrapper from '../components/wrappers/MainWrapper';
import { useWeb3Auth } from '../contexts/web3hook';

type ChildrenSignupProps = {};

function ChildrenSignup({}: ChildrenSignupProps) {
  const { address, status, provider } = useWeb3Auth();
  const [balance, setBalance] = useState<string>();

  useEffect(() => {
    if (address) {
      provider?.getBalance(address).then((balance) => {
        const balanceInEth = formatEther(balance);

        setBalance(balanceInEth);
      });
    }
  }, [provider, address]);

  return (
    <MainWrapper>
      {status === 'authenticated' ? (
        <Button>CLAIM</Button>
      ) : (
        <section className=" h-screen bg-primary">You must connect</section>
      )}
      <div>Balance : {balance} ETH</div>
    </MainWrapper>
  );
}

export default ChildrenSignup;
