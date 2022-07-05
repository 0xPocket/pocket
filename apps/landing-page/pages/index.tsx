import BackedBySection from '../components/BackedBySection';
import Caroussel from '../components/Caroussel';
import MainContainer from '../components/containers/MainContainer';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import IndexPageCardsChildren from '../components/IndexPageCardsChildren';
import IndexPageCardsParents from '../components/IndexPageCardsParents';
import SimpleSection from '../components/SimpleSection';

type IndexProps = {};

function Index({}: IndexProps) {
  return (
    <>
      <MainContainer>
        <HeroSection />
        <div className="mt-2 flex flex-col gap-40  py-32 md:gap-60">
          <div className=" flex flex-col gap-32">
            <IndexPageCardsParents />
            <IndexPageCardsChildren />
          </div>
          <SimpleSection />
          <Caroussel />
          <BackedBySection />
        </div>
        <Footer />
      </MainContainer>
    </>
  );
}

export default Index;
