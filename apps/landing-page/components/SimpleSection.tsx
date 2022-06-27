import Image from 'next/image';
import React from 'react';

const SimpleSection: React.FC = () => {
  return (
    <section className="relative mx-auto flex max-w-6xl  gap-16">
      <div className="relative col-span-3 row-span-full aspect-square h-[500px]">
        <Image
          src="/assets/iphone_mockup.png"
          objectFit="contain"
          layout="fill"
          alt="iphone"
        />
      </div>
      <div className="flex flex-col justify-center font-bold text-transparent">
        <h1 className="bg-gradient-blue-text  bg-clip-text text-6xl">
          {"L'argent de poche du web3."}
        </h1>
        <h1 className="bg-gradient-pink-text bg-clip-text text-5xl text-transparent">
          {'Simple. Securisé.'}
        </h1>
        <div className="mt-4 bg-clip-text text-xl font-normal text-dark text-transparent dark:text-bright">
          <p className="mt-4">
            {
              "Pocket vous permet en un clique d'acheter et de distribuer l'argent de poche a vos enfants."
            }
          </p>
        </div>
      </div>
    </section>
  );
};

export default SimpleSection;
