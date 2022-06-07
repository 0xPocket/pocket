import { UserChild } from '@lib/types/interfaces';
import { useState } from 'react';
import Link from 'next/link';
import Web3Button from '../wallet/Web3Button';
import { ParentContract } from 'pocket-contract/ts';
import { useSmartContract } from '../../contexts/contract';

type ChildCardProps = {
  child: UserChild;
};

function ChildCard({ child }: ChildCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { provider } = useSmartContract();

  const addToContract = (contract: ParentContract) => {
    contract.addChild(0, 0, child.web3Account.address).then(async (res) => {
      console.log(await provider?.getGasPrice());
      const response = await provider?.sendTransaction(res);
      console.log('tx sent');
      try {
        const confirmation = await response?.wait();
        console.log(confirmation);
        console.log(response);
      } catch (e) {
        console.log(e);
      }
    });
  };

  if (!child.validated)
    return (
      <>
        <div
          className="relative flex aspect-square items-end overflow-hidden rounded-lg border border-dark border-opacity-5 bg-white p-4 shadow-lg dark:border-white-darker dark:bg-dark-light"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div>
            <h2 className="">{child?.firstName}</h2>
            {!child.web3Account && <div>Pending...</div>}
            {!child.validated && (
              <Web3Button contract={addToContract}>Validate</Web3Button>
            )}
            <p>Available funds : {'placeholder'}</p>
          </div>
        </div>
      </>
    );

  return (
    <>
      <Link href={`/account/${child.id}`}>
        <div
          className="relative flex aspect-square items-end overflow-hidden rounded-lg border border-dark border-opacity-5 bg-white p-4 shadow-lg dark:border-white-darker dark:bg-dark-light"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div>
            <h2 className="">{child?.firstName}</h2>
            {!child.web3Account && <div>Pending...</div>}
            <p>Validated : {child.validated ? 'true' : 'false'}</p>
            {!child.validated && (
              <Web3Button contract={addToContract}>Validate</Web3Button>
            )}
            <p>Available funds : {'placeholder'}</p>
          </div>
        </div>
      </Link>
    </>
  );
}

export default ChildCard;
