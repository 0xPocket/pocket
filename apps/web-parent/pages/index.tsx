import { useSpring } from 'react-spring';
import IndexPageCard from '../components/cards/IndexPageCard';
import MainWrapper from '../components/wrappers/MainWrapper';

export default function Web() {
  return (
    <MainWrapper>
      <section className="bg relative flex h-[950px] items-center  overflow-hidden bg-bgWhite dark:bg-bgGray">
        <div className="absolute bottom-[-100px] right-0 h-[800px] w-[1800px] bg-light-radial-herosection"></div>
        <div className="container z-10 mx-auto mt-[-100px]">
          <span className="text-4xl">The best place for your kid</span>
          <div className="max-w-fit bg-gradient-blue-text bg-clip-text text-[100px] font-bold leading-[120px] text-transparent">
            <span className="">to start a</span>
            <span className="mt-[-20px] block">Web3 journey</span>
          </div>
        </div>
      </section>
      <IndexPageCard />
      <IndexPageCard />
      <IndexPageCard />
    </MainWrapper>
  );
}
