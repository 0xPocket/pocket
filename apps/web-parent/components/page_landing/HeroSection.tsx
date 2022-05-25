import { Button } from '@lib/ui';

type HeroSectionProps = {};

function HeroSection({}: HeroSectionProps) {
  return (
    <section className="relative z-0 flex min-h-[85vh] items-center ">
      <div className="container relative mx-auto grid h-full grid-cols-2">
        <div className="z-10 mt-[-200px]">
          <span className="text-4xl">The best place for your kid</span>
          <div className="max-w-fit bg-gradient-blue-text bg-clip-text text-[100px] font-bold leading-[120px] text-transparent">
            <span className="">to start his</span>
            <span className="mt-[-20px] block">Web3 journey</span>
          </div>
          <div className="mt-16 flex flex-col gap-4 pl-16">
            <span className="max-w-sm text-lg">
              Help us by answering a few questions and be selected for our beta
              and more
            </span>
            <form className=" sm:flex">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-md border border-gray-light px-5 py-3 placeholder-gray focus:border-primary-dark focus:ring-primary-dark dark:text-gray sm:max-w-xs"
                placeholder="Enter your email"
              />
              <Button className="ml-4">Get Started</Button>
            </form>
          </div>
        </div>
      </div>
      <div className="absolute bottom-[-100px] right-0 h-[800px] w-[1800px] bg-light-radial-herosection dark:opacity-10"></div>
    </section>
  );
}

export default HeroSection;
