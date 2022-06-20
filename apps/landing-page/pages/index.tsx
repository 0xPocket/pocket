import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    console.log(data);
    const res = await fetch('/api/form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  };

  console.log(errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <p>Possédez-vous des cryptomonnaies ou des NFTs ?</p>
      <label>
        <input {...register('cryptoKnowledge')} type="radio" value="Oui" />
        Oui
      </label>
      <label>
        <input {...register('cryptoKnowledge')} type="radio" value="Non" />
        Non
      </label>

      <p>
        Vos enfants vous ont-ils déjà parlé de NFT, cryptomonnaies ou encore
        play to earn ?
      </p>
      <label>
        <input {...register('childKnowledge')} type="radio" value="Oui" />
        Oui
      </label>
      <label>
        <input {...register('childKnowledge')} type="radio" value="Non" />
        Non
      </label>
      <label>
        <input
          {...register('childKnowledge')}
          type="radio"
          value="Je n'ai pas d'enfants"
        />
        {"Je n'ai pas d'enfants"}
      </label>

      <p>Une adresse email pour vous tenir informé ?</p>
      <label>
        <input {...register('email')} placeholder="Votre reponse" />
      </label>

      <button type="submit" className="flex">
        Submit
      </button>
    </form>
  );
}

export default Index;
