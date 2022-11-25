import { FC, useEffect, useRef } from 'react';
import generateIdenticon from '@metamask/jazzicon';

type props = { address?: string | null; size?: number };

const MetaMaskProfilePicture: FC<props> = ({ address, size = 75 }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const myDomElement = generateIdenticon(
      size,
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

  return <div ref={ref} className="flex items-center"></div>;
};

export default MetaMaskProfilePicture;
