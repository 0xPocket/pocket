type HeroSectionProps = {};

function HeroSection({}: HeroSectionProps) {
  return (
    <section className="relative z-0 h-[950px] overflow-hidden">
      <div className="container relative mx-auto grid h-full grid-cols-2">
        <div className="z-10 mt-[-200px] flex  flex-col justify-center">
          <span className="text-4xl">The best place for your kid</span>
          <div className="max-w-fit bg-gradient-blue-text bg-clip-text text-[100px] font-bold leading-[120px] text-transparent">
            <span className="">to start his</span>
            <span className="mt-[-20px] block">Web3 journey</span>
          </div>
          <div className="mt-16 flex flex-col gap-4 pl-16">
            <span className="max-w-sm text-lg">
              Stay connected to your child while you keep an eye over his
              discovery of the web3
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
                className="w-full rounded-md border border-gray-light px-5 py-3 placeholder-gray focus:border-primary-dark focus:ring-primary-dark sm:max-w-xs"
                placeholder="Enter your email"
              />
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-primary px-5 py-3 text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="absolute bottom-[-100px] right-0 h-[800px] w-[1800px] bg-light-radial-herosection"></div>
    </section>
  );
}

export default HeroSection;
