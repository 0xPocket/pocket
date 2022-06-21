import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import Question from '../components/form/Question';
import Introduction from '../components/form/Introduction';
import Conclusion from '../components/form/Conclusion';
import { GetServerSidePropsContext } from 'next';

type IndexProps = {
  email?: string;
};

export const formSchema = z.object({
  email: z.string().email().nullish(),
  cryptoKnowledge: z.enum(['Oui', 'Non']),
  childKnowledge: z.enum(['Oui', 'Non', "Je n'ai pas d'enfants"]).optional(),
});

type FormValues = {
  email: string;
  cryptoKnowledge: string;
  childKnowledge: string;
};

export function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { query } = ctx;
  return {
    props: {
      email: query.email || null,
    },
  };
}

function Index({ email }: IndexProps) {
  const { register, handleSubmit, watch } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email,
    },
  });
  const watchAll = watch();
  const [step, setStep] = useState(0);

  console.log(watchAll);
  const onSubmit = async (data: FormValues) => {
    const res = await fetch('/api/form', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  };

  const steps = useMemo(() => {
    return [
      <Introduction onClick={() => setStep((step) => step + 1)} />,
      <Question
        register={register('cryptoKnowledge')}
        header="Possédez vous des cryptomonnaies ou des NFTs ?"
      />,
      <Question
        register={register('childKnowledge')}
        header=" Vos enfants vous ont-ils déjà parlé de NFT, cryptomonnaies ou encore
        play to earn ?"
      />,
      <Conclusion />,
    ];
  }, [register]);

  const currentStep = steps[step];

  useEffect(() => {
    const subscription = watch((value, { name, type }) =>
      setStep((val) => val + 1),
    );
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-screen flex-col items-center justify-center gap-2"
    >
      {currentStep}

      {/* <button type="submit" className="flex">
        Submit
      </button> */}
    </form>
  );
}

export default Index;
