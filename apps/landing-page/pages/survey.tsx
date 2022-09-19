import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useRef, useState } from 'react';
import Question from '../components/form/Question';
import Conclusion from '../components/form/Conclusion';
import AnimationLayer from '../components/form/AnimationLayer';
import QuestionText from '../components/form/QuestionText';
import MainContainer from '../components/containers/MainContainer';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';
import ReCAPTCHA from 'react-google-recaptcha';

export const formSchema = z.object({
  email: z.string().email(),
  cryptoKnowledge: z.enum(['Oui', 'Non']).optional(),
  childKnowledge: z.enum(['Oui', 'Non', "Je n'ai pas d'enfants"]).optional(),
  childPlayToEarn: z.enum(['Oui', 'Non', "Je n'ai pas d'enfants"]).optional(),
  gavePocketMoney: z
    .enum(['Oui, via un compte bancaire', 'Oui, en éspèces', 'Non'])
    .optional(),
  contact: z.enum(['Oui', 'Non']).optional(),
  captcha: z.string().nullish(),
});

type FormValues = z.infer<typeof formSchema>;

function Index() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [step, setStep] = useState(1);
  const submitRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation((data: FormValues) =>
    fetch('/api/form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  );

  const onSubmit = async (data: FormValues) => {
    const token = await recaptchaRef.current?.executeAsync();
    mutation.mutate({
      ...data,
      captcha: token,
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
      // <Question
      //   register={register('cryptoKnowledge')}
      //   title="question.cryptoKnowledge"
      //   options={['choices.yes', 'choices.no']}
      //   values={['Oui', 'Non']}
      // />,
      // <Question
      //   register={register('childKnowledge')}
      //   title="question.childKnowledge"
      //   options={['choices.yes', 'choices.no', 'choices.nochild']}
      //   values={['Oui', 'Non', "Je n'ai pas d'enfants"]}
      // />,
      // <Question
      //   register={register('childPlayToEarn')}
      //   title="question.childPlayToEarn"
      //   options={['choices.yes', 'choices.no', 'choices.nochild']}
      //   values={['Oui', 'Non', "Je n'ai pas d'enfants"]}
      // />,
      // <Question
      //   register={register('gavePocketMoney')}
      //   title="question.gavePocketMoney"
      //   options={['choices.bankaccount', 'choices.cash', 'choices.no']}
      //   values={[
      //     'Oui, via un compte bancaire',
      //     'Oui, en espèces',
      //     "Je n'ai pas d'enfants",
      //   ]}
      // />,
      <Question
        register={register('contact')}
        title="question.contact.title"
        options={['choices.yes', 'choices.no']}
        values={['Oui', 'Non']}
      />,
    ];

    if (!router.query.email) {
      questions.unshift(
        <QuestionText
          register={register('email')}
          header="question.email"
          onClick={() => setStep((val) => val + 1)}
          error={errors.email}
        />,
      );
    } else {
      setValue('email', router.query.email as string);
    }
    return questions;
  }, [register, router.query, setValue, errors.email]);

  useEffect(() => {
    if (step >= questions.length + 1) {
      submitRef.current?.click();
    }
  }, [step, questions, handleSubmit]);

  const onReCAPTCHAChange = (captchaCode: string | null) => {
    // If the reCAPTCHA code is null or undefined indicating that
    // the reCAPTCHA was expired then return early
    if (!captchaCode || !recaptchaRef) {
      return;
    }
    // Reset the reCAPTCHA so that it can be executed again if user
    // submits another email.
    recaptchaRef.current?.reset();
  };

  return (
    <MainContainer>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative h-screen overflow-hidden"
      >
        <ReCAPTCHA
          ref={recaptchaRef}
          size="invisible"
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_PUBLIC_KEY!}
          hidden={true}
          onChange={onReCAPTCHAChange}
        />
        <AnimationLayer show={step === 0} questionsLength={questions.length}>
          {/* <Introduction onClick={() => setStep((step) => step + 1)} /> */}
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
