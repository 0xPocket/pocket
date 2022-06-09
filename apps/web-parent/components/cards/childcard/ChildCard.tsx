import { UserChild } from '@lib/types/interfaces';
import Link from 'next/link';
import Web3Button from '../../wallet/Web3Button';
import { ParentContract } from 'pocket-contract/ts';
import { useSmartContract } from '../../../contexts/contract';
import PendingHelper from './PendingHelper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

type ChildCardProps = {
  child: UserChild;
};

function ChildCard({ child }: ChildCardProps) {
  const { provider } = useSmartContract();

  const addToContract = (contract: ParentContract) => {
    contract.addChild(0, 0, child.web3Account.address).then(async (res) => {
      console.log(await provider?.getGasPrice());
      const response = await provider?.sendTransaction(
        res as unknown as string,
      );
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

  return (
    <>
      <Link href={`/account/${child.id}`}>
        <div className="relative flex aspect-square flex-col justify-end overflow-hidden rounded-lg border border-dark border-opacity-5 bg-white p-4 shadow-lg dark:border-white-darker dark:bg-dark-light">
          <h2>
            {child?.firstName}{' '}
            {child.validated && <FontAwesomeIcon icon={faCheckCircle} />}
          </h2>
          {!child.web3Account && <PendingHelper child={child} />}
          {child.web3Account && !child.validated && (
            <Web3Button contract={addToContract}>Validate</Web3Button>
          )}
        </div>
      </Link>
    </>
  );
}

export default ChildCard;
