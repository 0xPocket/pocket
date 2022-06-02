import { UserChild } from '@lib/types/interfaces';
import { useState } from 'react';
import Link from 'next/link';

type ChildCardProps = {
  child: UserChild;
};

function ChildCard({ child }: ChildCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Link href={`/account/${child.id}`}>
        <div
          className="relative flex aspect-square items-end overflow-hidden rounded-lg border border-dark border-opacity-5 bg-white p-4 shadow-lg dark:border-white-darker dark:bg-dark-light"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div>
            <h2 className="">{child?.firstName}</h2>
            <p>Available funds : {'placeholder'}</p>
          </div>
        </div>
      </Link>
    </>
  );
}

export default ChildCard;
