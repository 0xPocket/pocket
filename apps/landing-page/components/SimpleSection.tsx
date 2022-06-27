import Image from 'next/image';
import React from 'react';

const SimpleSection: React.FC = () => {
  return (
    <section className="relative mx-auto flex max-w-6xl  gap-16">
      <div className="relative col-span-3 row-span-full aspect-square h-[500px]">
        <Image
          src="/assets/mockup_macbookpro.png"
          objectFit="contain"
          layout="fill"
          alt="pocket website"
        />
      </div>
      <div className="flex flex-col justify-center font-bold text-transparent">
        <h1 className="bg-gradient-blue-text  bg-clip-text text-6xl leading-[75px]">
          Rejoignez Pocket
        </h1>
        <h1 className="bg-gradient-pink-text bg-clip-text text-5xl leading-[75px] text-transparent">
          Soyez le premier.
        </h1>
        <div className="mt-4 bg-clip-text text-xl font-normal text-dark text-transparent dark:text-bright">
          {
            "Pocket sera disponible très rapidement. Faites partie des premiers inscrits et profitez d'avantages exclusifs."
          }
        </div>
      </div>
    </section>
  );
};

export default SimpleSection;
