import { PrismaClient } from '@lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { formSchema } from '../survey';

type Data = z.infer<typeof formSchema>;

const prisma = new PrismaClient();

const form = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = req.body as Data;

  if (req.method === 'POST') {
    try {
      const validation = formSchema
        .transform((val) => {
          return {
            ...val,
            cryptoKnowledge: val.cryptoKnowledge === 'Oui' ? true : false,
          };
        })
        .parse(data);
      await prisma.survey.create({
        data: {
          ...validation,
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
