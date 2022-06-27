import { faBitcoin } from '@fortawesome/free-brands-svg-icons';
import { faGear, faMessage } from '@fortawesome/free-solid-svg-icons';
import { IndexCardAnimation } from '@lib/ui';
import { useState } from 'react';
import { Waypoint } from 'react-waypoint';
import IndexCard from './IndexCard';

function IndexPageCardsParents() {
  const [show, setShow] = useState(false);

  return (
    <div className="z-10  h-96">
      <Waypoint onEnter={() => setShow(true)} />
      <div className="relative flex items-center justify-between">
        <div className="bg-gradient-blue-text bg-clip-text text-6xl font-bold text-transparent">
          Parents
        </div>
        {show && (
          <IndexCardAnimation>
            <IndexCard
              title="Simplicité"
              content="Créer un compte, ajustez la fréquence et le montant d’argent de poche en quelques cliques"
              icon={faGear}
            />
            <IndexCard
              title="Notifications"
              content="Soyez averti en temps réel de l’activité de vos enfants ou recevez un résumé hebdomadaire"
              icon={faMessage}
            />
            <IndexCard
              title="Stabilité"
              content="Vos fonds ne sont pas soumis aux aléas du marché grace a une cryptomonnaie indéxé sur l'euro"
              icon={faBitcoin}
            />
          </IndexCardAnimation>
        )}
      </div>
    </div>
  );
}

export default IndexPageCardsParents;
