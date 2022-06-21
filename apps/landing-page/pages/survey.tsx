import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import Question from '../components/form/Question';
import Introduction from '../components/form/Introduction';
import Conclusion from '../components/form/Conclusion';

type IndexProps = {};

export const formSchema = z.object({
  cryptoKnowledge: z.enum(['Oui', 'Non']),
  childKnowledge: z.enum(['Oui', 'Non', "Je n'ai pas d'enfants"]).optional(),
  email: z.string().email(),
});

type FormValues = {
  cryptoKnowledge: string;
  childKnowledge: string;
  email: string;
};

function Index({}: IndexProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  const [step, setStep] = useState(0);

  const onSubmit = async (data: FormValues) => {
    const res = await fetch('/api/form', {
      method: 'POST',
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
      <Question register={register('email')} header="Test3?" />,
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
