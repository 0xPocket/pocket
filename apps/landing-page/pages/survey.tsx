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
import MainContainer from '../components/containers/MainContainer';
import { useMutation } from 'react-query';

type IndexProps = {
  email?: string;
};

export const formSchema = z.object({
  email: z.string().email(),
  cryptoKnowledge: z.enum(['Oui', 'Non']).optional(),
  childKnowledge: z.enum(['Oui', 'Non', "Je n'ai pas d'enfants"]).optional(),
  childPlayToEarn: z.enum(['Oui', 'Non', "Je n'ai pas d'enfants"]).optional(),
  gavePocketMoney: z
    .enum(['Oui, via un compte bancaire', 'Oui, en éspèces', 'Non'])
    .optional(),
  contact: z.enum(['Oui', 'Non']).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { query } = ctx;
  return {
    props: {
      email: query.email || null,
    },
  };
}

function Index({ email }: IndexProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email ? email : '',
    },
  });
  const [step, setStep] = useState(0);
  const submitRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation((data: FormValues) =>
    fetch('/api/form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  );

  const onSubmit = async (data: FormValues) => {
    mutation.mutate(data);
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
        title="Possédez-vous des crypto-monnaies ou des NFTs ?"
        options={['Oui', 'Non']}
      />,
      <Question
        register={register('childKnowledge')}
        title="En avez-vous déjà discuté avec vos enfants ?"
        options={['Oui', 'Non', "Je n'ai pas d'enfants"]}
      />,
      <Question
        register={register('childPlayToEarn')}
        title="Vos enfants vous ont-ils parlé de play-to-earn ?"
        options={['Oui', 'Non', "Je n'ai pas d'enfants"]}
      />,
      <Question
        register={register('gavePocketMoney')}
        title="Donnez-vous de l'argent de poche à vos enfants ?"
        options={['Oui, via un compte bancaire', 'Oui, en espèces', 'Non']}
      />,
      <Question
        register={register('contact')}
        title="Acceptez-vous d'être contacté par email par notre équipe ?"
        subtitle="Nous aimerions discuter avec vous !"
        options={['Oui', 'Non']}
      />,
    ];

    if (!email) {
      questions.unshift(
        <QuestionText
          register={register('email')}
          header="Une adresse email pour vous tenir informé ?"
          onClick={() => setStep((val) => val + 1)}
          error={errors.email}
        />,
      );
    }
    return questions;
  }, [register, email, errors.email]);

  useEffect(() => {
    if (step === questions.length + 1) {
      submitRef.current?.click();
    }
  }, [step, questions, handleSubmit]);

  return (
    <MainContainer>
      <Header />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative h-screen overflow-hidden"
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
    </MainContainer>
  );
}

export default Index;
