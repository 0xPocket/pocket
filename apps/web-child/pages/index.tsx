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
      <section className=" bg-primary">
        {status === 'authenticated' ? (
          <Button>CLAIM</Button>
        ) : (
          <div>You must connect</div>
        )}
        {/* <div>Balance : {balance} ETH</div> */}
      </section>
    </MainWrapper>
  );
}

export default ChildrenSignup;
