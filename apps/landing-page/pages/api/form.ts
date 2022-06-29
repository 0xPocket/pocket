import { PrismaClient } from '@lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { formSchema } from '../survey';

type Data = z.infer<typeof formSchema>;

const prisma = new PrismaClient();

const form = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const data = req.body as Data;
    try {
      console.log(data);
      const validation = formSchema.parse(data);
      await prisma.survey.upsert({
        where: {
          email: validation.email,
        },
        create: {
          ...validation,
        },
        update: { ...validation },
      });
      return res.status(201).json({ message: 'Success !' });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: 'Error with the form !' });
    }
  }
  return res.status(400).json({ message: 'Invalid request' });
};

export default form;
