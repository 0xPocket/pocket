import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useRef, useState } from 'react';
import Question from '../components/form/Question';
import Introduction from '../components/form/Introduction';
import Conclusion from '../components/form/Conclusion';
import { GetServerSidePropsContext } from 'next';
import AnimationLayer from '../components/form/AnimationLayer';
import Header from '../components/Header';
import QuestionText from '../components/form/QuestionText';

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
  const [step, setStep] = useState(0);
  const submitRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (data: FormValues) => {
    await fetch('/api/form', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  };

  useEffect(() => {
    const subscription = watch((data, { name }) => {
      if (name !== 'email') setStep((val) => val + 1);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const questions = useMemo(() => {
    const questions = [
      <Question
        register={register('cryptoKnowledge')}
        header="Possédez vous des cryptomonnaies ou des NFTs ?"
        options={['Oui', 'Non']}
      />,
      <Question
        register={register('childKnowledge')}
        header=" Vos enfants vous ont-ils déjà parlé de NFT, cryptomonnaies ou encore
play to earn ?"
        options={['Oui', 'Non', "Je n'ai pas d'enfants"]}
      />,
    ];

    if (!email) {
      questions.unshift(
        <QuestionText
          register={register('email')}
          header="Une adresse email pour vous tenir informé ?"
          onClick={() => setStep((val) => val + 1)}
        />,
      );
    }
    return questions;
  }, [register, email]);

  useEffect(() => {
    if (step === questions.length + 1) {
      submitRef.current?.click();
    }
  }, [step, questions, handleSubmit]);

  return (
    <>
      <Header />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative h-screen w-screen overflow-hidden"
      >
        <AnimationLayer show={step === 0} questionsLength={questions.length}>
          <Introduction onClick={() => setStep((step) => step + 1)} />
        </AnimationLayer>

        {questions.map((question, index) => (
          <AnimationLayer
            show={step === index + 1}
            step={index + 1}
            questionsLength={questions.length}
            key={index}
          >
            {question}
          </AnimationLayer>
        ))}

        <AnimationLayer
          show={step === questions.length + 1}
          questionsLength={questions.length}
        >
          <Conclusion />
        </AnimationLayer>
        <input type="submit" className="hidden" ref={submitRef} />
      </form>
    </>
  );
}

export default Index;
