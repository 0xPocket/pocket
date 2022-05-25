type ArgumentSectionProps = {};

function ArgumentSection({}: ArgumentSectionProps) {
  return (
    <div className="container mx-auto mt-20">
      <section id="decentralised-pocket-money" className="min-h-screen py-16">
        <h2 className="z-10 mb-4 bg-gradient-blue-text bg-clip-text pb-4 text-5xl text-transparent">
          Decentralised pocket money
        </h2>
      </section>
      <section id="activity-monitoring" className="min-h-screen">
        <h2 className="z-10 mb-4 bg-gradient-blue-text bg-clip-text pb-4 text-5xl text-transparent">
          Activity monitoring
        </h2>
      </section>
      <section id="a-place-to-learn" className="min-h-screen">
        <h2 className="z-10 mb-4 bg-gradient-blue-text bg-clip-text pb-4 text-5xl text-transparent">
          A place to learn
        </h2>
      </section>
    </div>
  );
}

export default ArgumentSection;
