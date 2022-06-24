import Image from 'next/image';
import React from 'react';

const SimpleSection: React.FC = () => {
  return (
    <section className="relative mx-auto grid max-w-6xl grid-cols-8 gap-8">
      <div className="relative col-span-4 col-end-4 row-span-full aspect-auto h-[600px]">
        <Image
          src="/assets/iphone_mockup.png"
          objectFit="contain"
          layout="fill"
          alt="iphone"
        />
      </div>
      <div className="col-span-4 col-start-5 row-span-full flex flex-col justify-center bg-gradient-blue-text bg-clip-text font-bold text-transparent">
        <h1>{"L'argent de poche du web3."}</h1>
        <h1 className="bg-gradient-pink-text bg-clip-text text-transparent">
          {'Simple. Securisé.'}
        </h1>
        <div className="mt-4 bg-clip-text text-xl font-normal text-dark text-transparent dark:text-bright">
          <b>
            Pas besoin de tout comprendre aux cryptomonnaies pour en donner a
            ses ados.
          </b>
          <span className="mt-4">
            {
              "Pocket vous permet en un clique d'acheter et de distribuer l'argent de poche a vos enfants."
            }
          </span>
        </div>
      </div>
    </section>
  );
};

export default SimpleSection;
