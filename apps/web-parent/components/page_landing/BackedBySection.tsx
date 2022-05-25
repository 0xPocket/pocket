import Image from 'next/image';
import Link from 'next/link';

type BackedBySectionProps = {};

function BackedBySection({}: BackedBySectionProps) {
  return (
    <div className=" bg-primary bg-opacity-20 py-16 dark:bg-opacity-5">
      <div className="container mx-auto">
        <div className="flex flex-col items-center">
          <h2 className="">Backed by</h2>
          <div className="mt-8 flex justify-evenly gap-16">
            <Link href="https://www.lecryptofellowship.com/">
              <div className="relative h-20 w-20 cursor-pointer">
                <Image
                  src="/assets/backer_icons/cryptofellowship.svg"
                  alt="Crypto Fellowship logo"
                  layout="fill"
                />
              </div>
            </Link>
            <Link href="https://www.frst.vc/">
              <div className="relative h-20 w-20 cursor-pointer">
                <Image
                  src="/assets/backer_icons/first.svg"
                  alt="First logo"
                  layout="fill"
                />
              </div>
            </Link>
            <Link href="https://www.fabric.vc/">
              <div className="relative h-20 w-44 cursor-pointer">
                <Image
                  src="/assets/backer_icons/fabric.svg"
                  alt="Fabric logo"
                  layout="fill"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BackedBySection;
