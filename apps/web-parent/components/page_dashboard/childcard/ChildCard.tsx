import { UserChild } from '@lib/types/interfaces';
import Link from 'next/link';
import Web3Button from '../../wallet/Web3Button';
import { ParentContract } from 'pocket-contract/ts';
import PendingHelper from './PendingHelper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useAxios } from '../../../hooks/axios.hook';

type ChildCardProps = {
  child: UserChild;
};

function ChildCard({ child }: ChildCardProps) {
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
      <Link href={`/account/${child.id}`}>
        <div className="relative flex aspect-square cursor-pointer flex-col justify-end overflow-hidden rounded-lg border border-dark border-opacity-10 bg-white p-4 shadow-lg dark:border-white-darker dark:bg-dark-light">
          <h2>
            {child?.firstName}{' '}
            {child && <FontAwesomeIcon icon={faCheckCircle} />}
          </h2>
          {!child.web3Account && <PendingHelper child={child} />}
          {child.web3Account && !child && (
            <Web3Button contract={addToContract}>Validate</Web3Button>
          )}
        </div>
      </Link>
    </>
  );
}

export default ChildCard;
