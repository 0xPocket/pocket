import Footer from '../components/footer/Footer';
import ArgumentSection from '../components/page_landing/ArgumentSection';
import BackedBySection from '../components/page_landing/BackedBySection';
import HeroSection from '../components/page_landing/HeroSection';
import IndexPageCards from '../components/page_landing/IndexPageCards';
import MainWrapper from '../components/wrappers/MainWrapper';

export default function Web() {
  return (
    <MainWrapper>
      <HeroSection />
      <IndexPageCards />
      <BackedBySection />
      <ArgumentSection />
      <Footer />
    </MainWrapper>
  );
}
