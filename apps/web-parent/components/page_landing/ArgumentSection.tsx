import { Element } from 'react-scroll';
type ArgumentSectionProps = {};

function ArgumentSection({}: ArgumentSectionProps) {
  return (
    <div className="container mx-auto mt-20">
      <Element name="decentralised-pocket-money" className="min-h-screen py-16">
        <h2 className="z-10 mb-4 bg-gradient-blue-text bg-clip-text pb-4 text-5xl text-transparent">
          Decentralised pocket money
        </h2>
      </Element>
      <Element name="activity-monitoring" className="min-h-screen">
        <h2 className="z-10 mb-4 bg-gradient-blue-text bg-clip-text pb-4 text-5xl text-transparent">
          Activity monitoring
        </h2>
      </Element>
      <Element name="a-place-to-learn" className="min-h-screen">
        <h2 className="z-10 mb-4 bg-gradient-blue-text bg-clip-text pb-4 text-5xl text-transparent">
          A place to learn
        </h2>
      </Element>
    </div>
  );
}

export default ArgumentSection;
