import { env } from '../env';

import sgMail from '@sendgrid/mail';

sgMail.setApiKey(env.SENDGRID_API_KEY);

const SENDGRID_EMAIL_TEMPLATES = {
  email_verification: 'd-801f7f84d63f46d08f5f89e9fa85ca09',
  child_invitation: 'd-230f8a8c70e94752923780db5775e57f',
};

type SendgridTemplateKeys = keyof typeof SENDGRID_EMAIL_TEMPLATES;

type EmailContext = {
  email_verification: {
    name: string;
    url: string;
  };
  child_invitation: {
    name: string;
    url: string;
  };
};

type EmailOptions<T extends SendgridTemplateKeys> = {
  to: string;
  template: T;
  context: EmailContext[T];
};

export async function sendEmail<Key extends SendgridTemplateKeys>(
  opts: EmailOptions<Key>,
) {
  return sgMail.send({
    from: `Pocket <${env.MAIL_USER}>`,
    templateId: SENDGRID_EMAIL_TEMPLATES[opts.template],
    personalizations: [
      {
        to: [
          {
            email: opts.to,
          },
        ],
        dynamicTemplateData: opts.context,
      },
    ],
  });
}
