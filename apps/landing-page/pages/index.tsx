import BackedBySection from '../components/BackedBySection';
import Carrousel from '../components/Carrousel';
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
        <div className="mt-2 space-y-28 py-32  md:gap-60 md:space-y-40">
          <div className="space-y-32">
            <IndexPageCardsParents />
            <IndexPageCardsChildren />
          </div>
          <SimpleSection />
          <Carrousel />
          <BackedBySection />
        </div>
        <Footer />
      </MainContainer>
    </>
  );
}

export default Index;
