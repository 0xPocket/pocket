import {
  faEarthEurope,
  faGraduationCap,
  faPencil,
  faRocket,
} from '@fortawesome/free-solid-svg-icons';
import { IndexCardAnimation } from '@lib/ui';
import { useState } from 'react';
import { Waypoint } from 'react-waypoint';
import IndexCard from './IndexCard';

function IndexPageCardsChildren() {
  const [show, setShow] = useState(false);

  return (
    <div className="z-10 h-96">
      <Waypoint onEnter={() => setShow(true)} />
      <div className="relative flex items-center justify-between">
        {show && (
          <IndexCardAnimation>
            <IndexCard
              title="Apprentissage"
              content="Une plateform pédagogique pour faire ses premiers pas dans le web3"
              icon={faGraduationCap}
              varitaion
            />
            <IndexCard
              title="Decouverte"
              content="Une séléction de jeux et d'applications adaptée aux adolescents"
              icon={faEarthEurope}
              varitaion
            />
            <IndexCard
              title="Liberté"
              content="Un accompagnement vers une autonomie dans l’ecosystème en toute sérénité"
              icon={faRocket}
              varitaion
            />
          </IndexCardAnimation>
        )}
        <div className="bg-gradient-pink-text bg-clip-text text-6xl font-bold text-transparent">
          Enfants
        </div>
      </div>
    </div>
  );
}

export default IndexPageCardsChildren;
