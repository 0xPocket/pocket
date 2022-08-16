import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground',
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const createTransporter = async () => {
  const accessToken = await oauth2Client
    .getAccessToken()
    .then((res) => res.token);

  if (!accessToken) {
    return null;
  }

  const transporter = nodemailer.createTransport(
    {
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USER,
        accessToken,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      },
    },
    {
      from: `"Pocket" <${process.env.MAIL_FROM}>`,
    },
  );

  return transporter;
};

const EMAIL_TEMPLATES = {
  child_invitation: {
    subject: `You've been invited to join Pocket !`,
    body: `<p>Hey {{name}},</p>
  <p>You've been invited to join Pocket !</p>
  <p>Please use the link below to complete your registration</p>
  <p>
    <a href='{{url}}'>Complete registration</a>
  </p>

  <p>If you did not request this email you can safely ignore it.</p>`,
  },
  email_verification: {
    subject: 'Verify your Pocket email address',
    body: `<p>Hey {{name}},</p>
  <p>Please use the link below to verify your email</p>
  <p>
    <a href='{{url}}'>Verify email</a>
  </p>

  <p>If you did not request this email you can safely ignore it.</p>`,
  },
};

type EmailTemplateKeys = keyof typeof EMAIL_TEMPLATES;

type EmailContext = {
  name: string;
  url: string;
};

type EmailOptions = {
  to: string;
  template: EmailTemplateKeys;
  context: EmailContext;
};

export async function sendEmail(opts: EmailOptions) {
  const transporter = await createTransporter();

  if (!transporter) {
    return null;
  }

  await transporter.verify();

  const emailTemplate = EMAIL_TEMPLATES[opts.template];

  const template = handlebars.compile(emailTemplate.body);
  const htmlToSend = template(opts.context);

  return transporter.sendMail({
    to: opts.to,
    subject: emailTemplate.subject,
    html: htmlToSend,
  });
}
