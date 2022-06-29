import {
  faEarthEurope,
  faGraduationCap,
  faRocket,
} from '@fortawesome/free-solid-svg-icons';
import { IndexCardAnimation } from '@lib/ui';
import { useState } from 'react';
import { Waypoint } from 'react-waypoint';
import IndexCard from './IndexCard';

function IndexPageCardsChildren() {
  const [show, setShow] = useState(false);

  return (
    <div className="min-h-96 z-10">
      <Waypoint onEnter={() => setShow(true)} />
      <div className="mb-8 bg-gradient-pink-text bg-clip-text text-center text-6xl font-bold text-transparent  sm:text-left xl:hidden">
        Enfants
      </div>
      <div className="relative grid grid-cols-4 gap-8">
        {show && (
          <IndexCardAnimation>
            <IndexCard
              title="Apprentissage"
              content="Une plateforme pédagogique pour faire ses premiers pas dans le web3"
              icon={faGraduationCap}
              varitaion
            />
            <IndexCard
              title="Découverte"
              content="Une sélection de jeux et d'applications adaptée aux adolescents"
              icon={faEarthEurope}
              varitaion
            />
            <IndexCard
              title="Liberté"
              content="Un accompagnement vers une autonomie dans l’écosystème en toute sérénité"
              icon={faRocket}
              varitaion
            />
          </IndexCardAnimation>
        )}
        <div className="col-span-1 hidden items-center justify-center bg-gradient-pink-text bg-clip-text text-6xl  font-bold text-transparent xl:col-span-1 xl:flex xl:aspect-square 2xl:aspect-[2/1.5]">
          Enfants
        </div>
      </div>
    </div>
  );
}

export default IndexPageCardsChildren;
