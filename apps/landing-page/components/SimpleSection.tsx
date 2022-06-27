import Image from 'next/image';
import React from 'react';
import CallToAction from './CallToAction';

const SimpleSection: React.FC = () => {
  return (
    <section className="relative mx-auto flex max-w-6xl flex-col gap-16 lg:flex-row">
      <div className="relative aspect-square h-[500px]">
        <Image
          src="/assets/iphone_mockup.png"
          objectFit="contain"
          layout="fill"
          alt="iphone"
        />
      </div>
      <div className="flex flex-col justify-center text-transparent">
        <h1 className="bg-gradient-blue-text bg-clip-text  text-6xl font-bold">
          {'Une application adaptée.'}
        </h1>
        <h1 className="bg-gradient-pink-text bg-clip-text text-5xl font-bold text-transparent">
          {'Simple. Securisé.'}
        </h1>
        <div className="mt-4 bg-clip-text text-xl font-normal text-dark text-transparent dark:text-bright">
          <p className="mt-4">
            {
              "Pocket vous permet en un clique d'acheter et de distribuer l'argent de poche a vos enfants."
            }
          </p>
        </div>
        <div className="self-center lg:self-auto">
          <CallToAction />
        </div>
      </div>
    </section>
  );
};

export default SimpleSection;
