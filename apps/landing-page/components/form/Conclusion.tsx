import React from 'react';

const Conclusion: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 text-center">
      <h1>Merci de votre intérêt pour notre produit 👍</h1>
      <h3>
        Vous serez contacté lorsque le produit sera disponible pour le tester en
        avant première.
      </h3>
      <p>{`L'équipe de Pocket.`}</p>
    </div>
  );
};

export default Conclusion;
