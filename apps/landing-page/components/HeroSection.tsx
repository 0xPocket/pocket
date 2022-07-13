import { FormattedMessage } from 'react-intl';
import CallToAction from './CallToAction';
import Image from 'next/future/image';
type HeroSectionProps = {};

function HeroSection({}: HeroSectionProps) {
  return (
    <section className="relative flex items-center justify-center pt-16 xl:min-h-screen 2xl:pt-0 ">
      <div className="grid grid-cols-10">
        <div className="relative -z-10 col-span-10 mb-4 w-full md:h-auto xl:col-span-6 xl:mb-0 xl:hidden">
          <Image
            src="/assets/illu.svg"
            alt="illu"
            style={{ objectFit: 'contain' }}
          />
        </div>
        <div className="col-span-10 flex flex-col justify-center gap-4 xl:col-span-4">
          <div className="max-w-fit text-[38px] font-bold leading-[40px] text-transparent md:text-[65px] md:leading-[80px]">
            <span className="block bg-gradient-blue-text bg-clip-text">
              <FormattedMessage id="hero.title.top" />
            </span>
            <span className="block bg-gradient-pink-text bg-clip-text ">
              <FormattedMessage id="hero.title.bottom" />
            </span>
          </div>
          <div>
            <div className="sm:text-2xl sm:leading-relaxed">
              <FormattedMessage id="hero.subtitle.top" />
            </div>
            <div className="sm:text-2xl sm:leading-relaxed">
              <FormattedMessage id="hero.subtitle.bottom" />
            </div>
          </div>

          <CallToAction />
        </div>
        <div className="relative -z-10 col-span-10 hidden w-full items-center justify-center xl:col-span-6 xl:flex">
          <Image src="/assets/illu.svg" alt="illu" />
        </div>
      </div>
      <div className="absolute bottom-[-100px] right-0 -z-50 h-[800px] w-[1800px] bg-light-radial-herosection dark:opacity-10"></div>
    </section>
  );
}

export default HeroSection;
