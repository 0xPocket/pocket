import Image from 'next/image';
import { FormattedMessage } from 'react-intl';
import CallToAction from './CallToAction';

type HeroSectionProps = {};

function HeroSection({}: HeroSectionProps) {
  return (
    <section className="relative flex min-h-[100vh] items-center pt-28 2xl:pt-0 ">
      <div className="grid grid-cols-10">
        <div className="relative -z-10 col-span-10 mb-8 block  aspect-[2/1.5] min-h-[500px] w-full xl:col-span-6 xl:hidden">
          <Image
            src="/assets/illu.svg"
            alt="illu"
            objectFit="contain"
            layout="fill"
          />
        </div>
        <div className="col-span-10 flex flex-col justify-center gap-4 xl:col-span-4">
          <div className="max-w-fit text-[38px] font-bold leading-[50px] text-transparent lg:text-[65px] lg:leading-[80px]">
            <span className="block bg-gradient-blue-text bg-clip-text">
              <FormattedMessage id="hero.title.top" />
            </span>
            <span className="block bg-gradient-pink-text bg-clip-text ">
              <FormattedMessage id="hero.title.bottom" />
            </span>
          </div>
          <div className=" ">
            <div className="text-2xl leading-relaxed">
              <FormattedMessage id="hero.subtitle.top" />
            </div>
            <div className="text-2xl leading-normal">
              <FormattedMessage id="hero.subtitle.bottom" />
            </div>
          </div>

          <CallToAction />
        </div>
        <div className="relative -z-10 col-span-10 hidden aspect-[1/1] w-full items-center justify-center xl:col-span-6 xl:flex">
          <Image
            src="/assets/illu.svg"
            alt="illu"
            objectFit="contain"
            layout="fill"
          />
        </div>
      </div>
      <div className="absolute bottom-[-100px] right-0 -z-50 h-[800px] w-[1800px] bg-light-radial-herosection dark:opacity-10"></div>
    </section>
  );
}

export default HeroSection;
