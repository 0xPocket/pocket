import Image from 'next/image';
import CallToAction from './CallToAction';

type HeroSectionProps = {};

function HeroSection({}: HeroSectionProps) {
  return (
    <section className="relative flex min-h-[100vh] items-center pt-28 2xl:pt-0 ">
      <div className="grid grid-cols-10">
        <div className="relative -z-10 col-span-10 block aspect-[1/1] w-full xl:col-span-6 xl:hidden">
          <Image
            src="/assets/hero_image2.png"
            alt=""
            layout="fill"
            objectFit="contain"
          />
        </div>
        <div className="col-span-10 flex flex-col justify-center gap-4 xl:col-span-4">
          <div className="max-w-fit text-[38px] font-bold leading-[50px] text-transparent lg:text-[65px] lg:leading-[80px]">
            <span className="block bg-gradient-blue-text bg-clip-text">
              {"L'argent de poche du web3."}
            </span>
            <span className="block bg-gradient-pink-text bg-clip-text ">
              {'Simple. Sécurisé.'}
            </span>
          </div>
          <div className=" ">
            <div className="text-2xl leading-relaxed">
              Pas besoin de tout comprendre aux cryptomonnaies pour en donner à
              ses ados.
            </div>
            <div className="text-2xl leading-normal">
              {
                "Achetez et distribuez de l'argent de poche à vos enfants en un clic."
              }
            </div>
          </div>

          <CallToAction />
        </div>
        <div className="relative -z-10 col-span-10 hidden aspect-[1/1] w-full xl:col-span-6 xl:block">
          <Image
            src="/assets/hero_image2.png"
            alt=""
            layout="fill"
            objectFit="contain"
          />
        </div>
      </div>
      <div className="absolute bottom-[-100px] right-0 -z-50 h-[800px] w-[1800px] bg-light-radial-herosection dark:opacity-10"></div>
    </section>
  );
}

export default HeroSection;
