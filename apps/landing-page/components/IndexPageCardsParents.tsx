import {
  faEuroSign,
  faGear,
  faMessage,
} from '@fortawesome/free-solid-svg-icons';
import { IndexCardAnimation } from '@lib/ui';
import { useState } from 'react';
import { Waypoint } from 'react-waypoint';
import IndexCard from './IndexCard';

function IndexPageCardsParents() {
  const [show, setShow] = useState(false);

  return (
    <div className="min-h-96  z-10">
      <Waypoint onEnter={() => setShow(true)} />
      <div className="mb-8 bg-gradient-blue-text bg-clip-text text-center text-6xl font-bold text-transparent  sm:text-left xl:hidden">
        Parents
      </div>
      <div className="relative grid grid-cols-4 gap-8">
        <div className=" hidden items-center justify-center bg-gradient-blue-text bg-clip-text  text-6xl font-bold text-transparent xl:col-span-1 xl:flex">
          Parents
        </div>
        {show && (
          <IndexCardAnimation>
            <IndexCard
              title="Simplicité"
              content="Créez un compte, ajustez la fréquence et le montant d’argent de poche en quelques clics"
              icon={faGear}
            />
            <IndexCard
              title="Sérénité"
              content="Soyez averti en temps réel de l’activité de vos enfants ou recevez un résumé hebdomadaire"
              icon={faMessage}
            />
            <IndexCard
              title="Stabilité"
              content="Vos fonds ne sont pas soumis aux aléas du marché grâce à une cryptomonnaie indexée sur l'euro"
              icon={faEuroSign}
            />
          </IndexCardAnimation>
        )}
      </div>
    </div>
  );
}

export default IndexPageCardsParents;
