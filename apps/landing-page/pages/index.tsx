import BackedBySection from '../components/BackedBySection';
import MainContainer from '../components/containers/MainContainer';
import HeroSection from '../components/HeroSection';
import SimpleSection from '../components/SimpleSection';

type IndexProps = {};

function Index({}: IndexProps) {
  return (
    <>
      <MainContainer>
        <HeroSection />
        <BackedBySection />
        <SimpleSection />
      </MainContainer>
    </>
  );
}

export default Index;
