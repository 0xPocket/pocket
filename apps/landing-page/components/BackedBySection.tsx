import Image from 'next/image';
import Link from 'next/link';
import LogoPartenaire from './LogoPartenaire';

type BackedBySectionProps = {};

function BackedBySection({}: BackedBySectionProps) {
  return (
    <div className=" bg-opacity-20 py-16 dark:bg-opacity-5">
      <div className="container mx-auto">
        <div className="flex items-center justify-center gap-24">
          <h2 className="">Nos patenaires</h2>
          <LogoPartenaire
            url="https://www.lecryptofellowship.com/"
            imgUrl="/assets/backer_icons/cryptofellowship.svg"
            width="w-28"
            height="h-28"
            alt="Le cryptofellowship logo"
          />
          <LogoPartenaire
            url="https://www.frst.vc"
            imgUrl="/assets/backer_icons/first.svg"
            width="w-28"
            height="h-28"
            alt="frst vc logo"
          />
          <LogoPartenaire
            url="https://www.fabric.vc/"
            imgUrl="/assets/backer_icons/fabric.svg"
            width="w-60"
            height="h-28"
            alt="fabric logo"
          />
        </div>
      </div>
    </div>
  );
}

export default BackedBySection;
