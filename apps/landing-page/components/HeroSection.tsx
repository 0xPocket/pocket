import { faAt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type HeroSectionProps = {};

export const getStartedFormSchema = z.object({
  email: z.string().email(),
});

type FormValues = {
  email: string;
};

function HeroSection({}: HeroSectionProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(getStartedFormSchema),
  });
  const router = useRouter();

  const onSubmit = async (data: FormValues) => {
    await fetch('/api/form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    router.push('/survey?email=' + data.email);
  };

  return (
    <section className="relative flex min-h-[100vh] items-center ">
      <div className="container relative mx-auto grid h-full grid-cols-1 md:grid-cols-10">
        <div className="col-span-4 flex flex-col gap-4 ">
          <div className=" max-w-fit bg-gradient-blue-text bg-clip-text text-[40px] font-bold leading-[50px] text-transparent lg:text-[70px] lg:leading-[80px]">
            <span className="">
              Accompagnez vos enfants vers le web de demain.
            </span>
          </div>
          <div className="text-3xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi sit in
            obcaecati aspernatur accusantium ipsa sapiente odio consequuntur,
          </div>
          <div className="flex gap-8 text-[rgb(57,179,245)]">
            <a href="">Le web3 ?</a>
            <a>Notre produit</a>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 flex max-w-fit items-center gap-4 rounded-md bg-bright pl-4 text-white-darker"
          >
            <FontAwesomeIcon icon={faAt} />
            <input
              className="h-full outline-none"
              placeholder="Adresse email"
              type="email"
              {...register('email')}
            />

            <input
              type="submit"
              value="Commencer"
              className="relative flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-primary px-4 py-3 text-bright dark:bg-primary-dark"
            />
          </form>
        </div>
        <div className=" relative col-span-6 scale-150">
          <Image
            src="/assets/hero_ilu.svg"
            alt="caca"
            layout="fill"
            objectFit="contain"
          />
        </div>
      </div>
      <div className="absolute bottom-[-100px] right-0 -z-50 h-[800px] w-[1800px] bg-light-radial-herosection dark:opacity-10"></div>
    </section>
  );
}

export default HeroSection;
