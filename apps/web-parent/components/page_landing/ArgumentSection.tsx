import { IndexArgumentsAnimation } from '@lib/ui';
import { Element } from 'react-scroll';
import ArgumentContainer from './ArgumentContainer';
type ArgumentSectionProps = {};

function ArgumentSection({}: ArgumentSectionProps) {
  return (
    <div className="container mx-auto mt-20">
      <ArgumentContainer
        title="Decentralised pocket money"
        direction="left"
        name="decentralised-pocket-money"
      >
        <h3>Salut</h3>
        <h3>Salut</h3>
        <h3>Salut</h3>
        <h3>Salut</h3>
      </ArgumentContainer>
      <ArgumentContainer
        title="Activity monitoring"
        direction="right"
        name="activity-monitoring"
      >
        <h3>Salut</h3>
        <h3>Salut</h3>
        <h3>Salut</h3>
        <h3>Salut</h3>
      </ArgumentContainer>
      <ArgumentContainer
        title="A place to learn"
        direction="left"
        name="a-place-to-learn"
      >
        <h3>Salut</h3>
        <h3>Salut</h3>
        <h3>Salut</h3>
        <h3>Salut</h3>
      </ArgumentContainer>
    </div>
  );
}

export default ArgumentSection;
