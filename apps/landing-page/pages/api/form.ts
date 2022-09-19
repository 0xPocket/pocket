import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { formSchema } from '../survey';
import { prisma } from '../../lib/prisma';
import { env } from 'config/env/server';

type Data = z.infer<typeof formSchema>;

type reCaptchaResponse = {
  success: boolean;
  challenge_ts: string;
  hostname: string;
};

async function validateCaptcha(captcha: string | null | undefined) {
  if (!captcha) {
    return false;
  }
  return fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${env.RECAPTCHA_SECRET_KEY}&response=${captcha}`,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
      method: 'POST',
    },
  ).then((response) =>
    (response.json() as Promise<reCaptchaResponse>).then(
      (data) => data.success,
    ),
  );
}

const form = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const data = req.body as Data;
    try {
      const validation = formSchema.parse(data);
      const captchaValidation = await validateCaptcha(data.captcha);

      if (!captchaValidation) {
        return res.status(400).json({ error: 'Invalid captcha' });
      }

      await prisma.survey.upsert({
        where: {
          email: validation.email,
        },
        create: {
          email: validation.email,
          contact: validation.contact,
        },
        update: { email: validation.email, contact: validation.contact },
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
