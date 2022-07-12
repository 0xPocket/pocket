import Image from 'next/image';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import CallToAction from './CallToAction';

const SimpleSection: React.FC = () => {
  return (
    <section className="relative mx-auto grid max-w-7xl grid-cols-2 gap-16">
      <div className="relative col-span-2 aspect-[1/0.58] w-full lg:col-span-1 ">
        <Image
          src="/assets/mockup_macbookpro.png"
          objectFit="contain"
          layout="fill"
          alt="pocket website"
        />
      </div>
      <div className="col-span-2 flex flex-col justify-center text-center md:text-left lg:col-span-1">
        <h1 className="bg-gradient-blue-text bg-clip-text  text-6xl font-bold leading-[75px] text-transparent">
          <FormattedMessage id="simple.section.title" />
        </h1>
        <h1 className="bg-gradient-pink-text bg-clip-text  text-3xl font-bold text-transparent md:text-5xl md:leading-[1.5]">
          <FormattedMessage id="simple.section.subtitle" />
        </h1>
        <div className="mt-4 text-xl">
          <FormattedMessage id="simple.section.content" />
        </div>
        <CallToAction />
      </div>
    </section>
  );
};

export default SimpleSection;
