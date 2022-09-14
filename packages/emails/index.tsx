// import { SES } from "@aws-sdk/client-ses";
import { buildSendMail, ComponentMail } from "mailing-core";
import nodemailer from "nodemailer";
// import * as aws from "@aws-sdk/client-ses";
import VerifyEmail from "./emails/VerifyEmail";

// aws
// username : AKIAQRVDICXIZZD2TEM5
// password : BI1wTpF7OhHwPw+xidzbrmuZ0B0du7PH9dhivPxFNGcw

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use TLS
  auth: {
    user: "hello@gopocket.fr",
    pass: "vcogsffaqhzmwxpd",
  },
  // TODO: reject in prod ?
  tls: {
    rejectUnauthorized: false,
  },
});

// const ses = new SES({
//   credentials: {
//     accessKeyId: "AKIAQRVDICXI7Z6Y5NV6",
//     secretAccessKey: "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",
//   },
//   region: "eu-west-",
// });

// const transport = nodemailer.createTransport({
//   port: 465,
//   host: "email-smtp.eu-west-3.amazonaws.com",
//   secure: true,
//   auth: {
//     user: "AKIAQRVDICXIX2RPRWFW",
//     pass: "BA6xflDoqOmRjgoaeNk1vAl2U7M2u0ED08VF2rrDdTse",
//   },
//   // TODO: reject in prod ?
// });

const sendMail = buildSendMail({
  transport,
  defaultFrom: "hello@gopocket.fr",
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

export function sendEmailWrapper<Key extends EmailTemplateKeys>(
  config: EmailWrapperProps<Key>
) {
  const { props, template, ...rest } = config;
  const templateFn = TEMPLATES[template];

  return sendMail({
    ...rest,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    subject: templateFn.subject,
    component: templateFn.component(props as any),
  });
}

export default sendMail;
