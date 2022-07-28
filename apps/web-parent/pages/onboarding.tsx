import MainWrapper from '../components/wrappers/MainWrapper';
import OnBoardingForm from '../components/auth/OnBoardingForm';

function OnBoarding() {
  return (
    <MainWrapper>
      <section className="relative grid min-h-[85vh] grid-cols-1">
        <div className="mx-auto flex w-72 flex-col items-center justify-center gap-8">
          <OnBoardingForm />
        </div>
      </section>
    </MainWrapper>
  );
}

export default OnBoarding;
