import { sendEmailWrapper } from "@pocket/emails";
import { hashToken, saveVerificationToken } from "./jwt";

import crypto from "crypto";
type SendVerificationEmailParams = {
  email: string;
  name: string;
};

function generateRandomCode() {
  return crypto.randomInt(100000, 999999).toString();
}

const TEN_MINUTES_IN_SECONDS = 600;

export async function sendCodeVerificationEmail(
  params: SendVerificationEmailParams
) {
  const code = generateRandomCode();

  const expires = new Date(Date.now() + TEN_MINUTES_IN_SECONDS * 1000);

  await saveVerificationToken({
    identifier: params.email,
    expires,
    token: hashToken(code),
  });

  await sendEmailWrapper({
    to: params.email,
    template: "email_code_verification",
    subject: `${code} is your Pocket verification code`,
    props: {
      name: params.name,
      code,
    },
  });

  return "SENT";
}
