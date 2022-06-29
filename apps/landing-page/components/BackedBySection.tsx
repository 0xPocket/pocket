import LogoPartenaire from './LogoPartenaire';

type BackedBySectionProps = {};

function BackedBySection({}: BackedBySectionProps) {
  return (
    <div className=" rounded-xl bg-dark-lightest py-12 dark:bg-transparent">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center gap-24 md:flex-row">
          <h2 className="text-bright">Nos partenaires</h2>
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
        </div>
      </div>
    </div>
  );
}

export default BackedBySection;
