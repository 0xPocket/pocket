import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';

const transporter = nodemailer.createTransport(
  {
    host: process.env.MAIL_HOST,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
    port: Number(process.env.MAIL_PORT),
  },
  {
    from: `"No Reply" <${process.env.MAIL_FROM}>`,
  },
);

const EMAIL_TEMPLATES = {
  child_invitation: `<p>Hey {{name}},</p>
  <p>You've been invited to join Pocket !</p>
  <p>Please use the link below to complete your registration</p>
  <p>
    <a href='{{url}}'>Complete registration</a>
  </p>

  <p>If you did not request this email you can safely ignore it.</p>`,
  email_verification: `<p>Hey {{name}},</p>
  <p>Please use the link below to verify your email</p>
  <p>
    <a href='{{url}}'>Verify email</a>
  </p>

  <p>If you did not request this email you can safely ignore it.</p>`,
};

type EmailOptions = {
  to: string;
  subject: string;
  template: keyof typeof EMAIL_TEMPLATES;
  context?: {
    [key: string]: any;
  };
};

export function sendEmail(opts: EmailOptions) {
  const template = handlebars.compile(EMAIL_TEMPLATES[opts.template]);
  const replacements = opts.context;
  const htmlToSend = template(replacements);

  return transporter.sendMail({
    to: opts.to,
    subject: opts.subject,
    html: htmlToSend,
  });
}
