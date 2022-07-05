import React from 'react';

type Props = {
  onClick: () => void;
};

const Introduction: React.FC<Props> = ({ onClick }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 text-center">
      <h1>Bonjour 👋</h1>
      <h1>Vous souhaitez avoir accès à notre produit en avant-première ?</h1>
      <h2 className=" font-normal">Alors dites-nous en plus sur vous !</h2>
      <button
        onClick={onClick}
        className="rounded-lg bg-primary p-4 text-white"
      >
        {`C'est parti !`}
      </button>
    </div>
  );
};

export default Introduction;
