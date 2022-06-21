import MainContainer from '../components/containers/MainContainer';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';

type IndexProps = {};

function Index({}: IndexProps) {
  return (
    <MainContainer>
      <HeroSection />
    </MainContainer>
  );
}

export default Index;
