import { useState } from 'react';
import { animated, useSpring } from 'react-spring';
import { Waypoint } from 'react-waypoint';

type IndexPageCardProps = {
  title: string;
  content: string;
};

function IndexCard({ title, content }: IndexPageCardProps) {
  return (
    <div className="relative aspect-[2/2] w-[400px] overflow-hidden rounded-2xl border border-dark border-opacity-5 bg-bgWhite p-8 shadow-xl">
      <div className="absolute right-[-200px] bottom-[-200px] h-[600px] w-[500px] bg-light-radial-herosection opacity-10"></div>
      <h2 className="mb-4 bg-gradient-blue-text bg-clip-text text-4xl text-transparent">
        {title}
      </h2>
      <p>{content}</p>
    </div>
  );
}

function IndexPageCard() {
  const [appear, setAppear] = useState<boolean>(false);

  const contentProps = useSpring({
    opacity: appear ? 1 : 0,
    top: appear ? -200 : -500,
    delay: 500,
    config: {
      tension: 280,
      friction: 60,
    },
  });

  return (
    <div className="relative mb-[100px] h-96">
      <Waypoint onEnter={() => setAppear(true)} />
      <animated.div style={contentProps} className="absolute z-20">
        <div className="flex w-screen justify-evenly ">
          <IndexCard
            title="Argument 1"
            content="Parce que c'est bien, parce que c'est beau, parce que tu en as besoin."
          />
          <IndexCard
            title="Argument 2"
            content="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."
          />
          <IndexCard
            title="Argument 3"
            content="There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour."
          />
        </div>
      </animated.div>
    </div>
  );
}

export default IndexPageCard;
