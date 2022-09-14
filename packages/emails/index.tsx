import * as dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

import { buildSendMail, ComponentMail } from "mailing-core";
import nodemailer from "nodemailer";
import VerifyEmail from "./emails/VerifyEmail";

const transport = nodemailer.createTransport({
  port: 465,
  host: "email-smtp.eu-west-3.amazonaws.com",
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendMail = buildSendMail({
  transport,
  defaultFrom: "Pocket <noreply@gopocket.fr>",
  configPath: "./mailing.config.json",
});

const TEMPLATES = {
  email_verification: {
    component: (props: Omit<InferProps<typeof VerifyEmail>, "body">) => (
      <VerifyEmail
        body={<>Please click on the link below to verify your email:</>}
        ctaText="Verify Email"
        {...props}
      />
    ),
    subject: "Verify your Pocket email address",
  },
  child_invitation: {
    component: (props: Omit<InferProps<typeof VerifyEmail>, "body">) => (
      <VerifyEmail
        body={
          <>
            You've been invited to join Pocket !
            <br /> Please click on the link below to complete your registration:
          </>
        }
        ctaText="Complete registration"
        {...props}
      />
    ),
    subject: "You've been invited to join Pocket !",
  },
};

type EmailTemplateKeys = keyof typeof TEMPLATES;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InferProps<T extends React.FC<any>> = T extends (props: infer P) => any
  ? P
  : never;

type EmailTemplateProps = {
  [key in EmailTemplateKeys]: InferProps<typeof TEMPLATES[key]["component"]>;
};

type EmailWrapperProps<Key extends EmailTemplateKeys> = ComponentMail & {
  template: Key;
  props: EmailTemplateProps[Key];
};

// generate random string
const generateRandomString = (length: number) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

function sendMailWithHeader(props: ComponentMail) {
  return sendMail({
    ...props,
    headers: {
      "List-Unsubscribe": "<mailto:unsubscribe@gopocket.fr>",
      "X-Entity-Ref-ID": generateRandomString(16),
    },
  });
}

export function sendEmailWrapper<Key extends EmailTemplateKeys>(
  config: EmailWrapperProps<Key>
) {
  const { props, template, ...rest } = config;
  const templateFn = TEMPLATES[template];

  return sendMailWithHeader({
    ...rest,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    subject: templateFn.subject,
    component: templateFn.component(props as any),
  });
}

export default sendMailWithHeader;
