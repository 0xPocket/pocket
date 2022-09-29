import { FC, useEffect, useRef } from 'react';
import generateIdenticon from '@metamask/jazzicon';

type props = { address?: string | null };

const MetaMaskProfilePicture: FC<props> = ({ address }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const myDomElement = generateIdenticon(
      75,
      parseInt(
        address
          ? address.slice(2, 10)
          : '0x000000000000000000000000000000000000dEaD'.slice(2, 10),
        16,
      ),
    );
    if (ref.current) {
      while (ref.current.firstChild) {
        ref.current.removeChild(ref.current.firstChild);
      }
      ref.current.appendChild(myDomElement);
    }
  }, [address]);

  return <div ref={ref}></div>;
};

export default MetaMaskProfilePicture;
