import BackedBySection from '../components/BackedBySection';
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
        <div className="mt-2 flex flex-col gap-40">
          <IndexPageCardsParents />
          <IndexPageCardsChildren />
          <SimpleSection />
          <BackedBySection />
          <Footer />
        </div>
      </MainContainer>
    </>
  );
}

export default Index;
