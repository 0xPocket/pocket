import ArgumentSection from '../components/page_landing/ArgumentSection';
import HeroSection from '../components/page_landing/HeroSection';
import IndexPageCards from '../components/page_landing/IndexPageCards';
import MainWrapper from '../components/wrappers/MainWrapper';

export default function Web() {
  return (
    <MainWrapper>
      <HeroSection />
      <IndexPageCards />
      <ArgumentSection />
    </MainWrapper>
  );
}
