import { FormInputText } from '@lib/ui';
import { useForm } from 'react-hook-form';

type HeroSectionProps = {};
type GetStartedDataForm = {
  email: string;
};

function HeroSection({}: HeroSectionProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GetStartedDataForm>();

  const onSubmit = (data: GetStartedDataForm) => {
    console.log(data);
  };

  return (
    <section className="relative z-0 flex min-h-[85vh] items-center ">
      <div className="container relative mx-auto grid h-full grid-cols-1 md:grid-cols-2">
        <div className="z-10 mt-[-200px]">
          <span className="text-2xl lg:text-4xl">
            The best place for your kid
          </span>
          <div className="max-w-fit bg-gradient-blue-text bg-clip-text text-[50px] font-bold  leading-[75px] text-transparent lg:text-[100px] lg:leading-[120px]">
            <span className="">to start his</span>
            <span className="mt-[-20px] block">Web3 journey</span>
          </div>
          <div className="mt-16 flex flex-col gap-4 pl-16">
            <span className="max-w-sm text-lg">
              Help us by answering a few questions and be selected for our beta
              and more
            </span>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex items-start gap-4"
            >
              <FormInputText
                placeHolder="Enter your email"
                label="email"
                type="email"
                registerValues={register('email', {
                  required: 'This field is required',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Entered value does not match email format',
                  },
                })}
                error={errors.email}
              />
              <input
                type="submit"
                value="Get started"
                className="relative flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-primary px-4 py-3 text-bright dark:bg-primary-dark"
              />
            </form>
          </div>
        </div>
      </div>
      <div className="absolute bottom-[-100px] right-0 -z-50 h-[800px] w-[1800px] bg-light-radial-herosection dark:opacity-10"></div>
    </section>
  );
}

export default HeroSection;
