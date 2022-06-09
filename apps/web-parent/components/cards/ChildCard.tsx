import { UserChild } from '@lib/types/interfaces';
import { useState } from 'react';
import Link from 'next/link';
import Web3Button from '../wallet/Web3Button';
import { ParentContract } from 'pocket-contract/ts';
import { useAxios } from '../../hooks/axios.hook';

type ChildCardProps = {
  child: UserChild;
};

function ChildCard({ child }: ChildCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const axios = useAxios();

  const addToContract = (contract: ParentContract) => {
    contract.addChild(0, 0, child.web3Account.address).then(async (res) => {
      const response = await axios.post('/api/ethereum/broadcast', {
        hash: res,
        type: 'ADD_CHILD',
        childAddress: child.web3Account.address,
      });
      console.log(response);
    });
  };

  return (
    <>
      {/* <Link href={`/account/${child.id}`}> */}
      <div
        className="relative flex aspect-square items-end overflow-hidden rounded-lg border border-dark border-opacity-5 bg-white p-4 shadow-lg dark:border-white-darker dark:bg-dark-light"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <h2 className="">{child?.firstName}</h2>
          {!child.web3Account && <div>Pending...</div>}
          <p>Validated : {child.status === 'ACTIVE' ? 'true' : 'false'}</p>
          {child.status === 'LINKED' && (
            <Web3Button contract={addToContract}>Validate</Web3Button>
          )}
          <p>Available funds : {'placeholder'}</p>
        </div>
      </div>
      {/* </Link> */}
    </>
  );
}

export default ChildCard;
