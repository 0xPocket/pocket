import { PrismaClient } from '@lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { getStartedFormSchema } from '../../components/HeroSection';
import { formSchema } from '../survey';

type Data = z.infer<typeof formSchema>;
type GetStartedData = z.infer<typeof getStartedFormSchema>;

const prisma = new PrismaClient();

const form = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const data = req.body as GetStartedData;

    try {
      const validation = getStartedFormSchema.parse(data);
      await prisma.survey.create({
        data: {
          ...validation,
        },
      });
      return res.status(201).json({ message: 'Success !' });
    } catch (e) {
      return res.status(400).json({ message: 'Error with the form !' });
    }
  } else if (req.method === 'PUT') {
    const data = req.body as Data;

    try {
      const validation = formSchema.parse(data);
      await prisma.survey.update({
        where: {
          email: validation.email!,
        },
        data: {
          ...validation,
          email: validation.email!,
        },
      });
      return res.status(201).json({ message: 'Success !' });
    } catch (e) {
      return res.status(400).json({ message: 'Error with the form !' });
    }
  }
  return res.status(200).json({ name: 'John Doe' });
};

export default form;
