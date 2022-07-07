import { FormattedMessage } from 'react-intl';
import LogoPartenaire from './LogoPartenaire';

type BackedBySectionProps = {};

function BackedBySection({}: BackedBySectionProps) {
  return (
    <div className=" rounded-xl bg-dark-lightest py-12 px-4 dark:bg-transparent">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center gap-24 lg:flex-row">
          <h2 className="text-bright">
            <FormattedMessage id="backedby.title" />
          </h2>
          <LogoPartenaire
            imgUrl="/assets/backer_icons/cryptofellowship.svg"
            width="w-28"
            height="h-28"
            alt="Le cryptofellowship logo"
          />
          <LogoPartenaire
            imgUrl="/assets/backer_icons/first.svg"
            width="w-28"
            height="h-28"
            alt="frst vc logo"
          />
          <LogoPartenaire
            imgUrl="/assets/backer_icons/fabric.svg"
            width="w-60"
            height="h-28"
            alt="fabric logo"
          />
          <LogoPartenaire
            imgUrl="/assets/backer_icons/neuillylab.svg"
            width="h-28"
            height="h-28"
            alt="neuillylab logo"
          />
        </div>
      </div>
    </div>
  );
}

export default BackedBySection;
