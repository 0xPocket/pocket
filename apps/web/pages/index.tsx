import Header from '../components/header/Header';
import MainWrapper from '../components/wrappers/MainWrapper';

export default function Web() {
  return (
    <MainWrapper>
      <section className="flex h-screen items-center justify-center bg-primary">
        <span className="text-4xl">Hero Section</span>
      </section>
    </MainWrapper>
  );
}
