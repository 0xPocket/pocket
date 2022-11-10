import { sendEmailWrapper } from "@pocket/emails";
import { env } from "config/env/server";
import {
  generateVerificationToken,
  hashToken,
  saveVerificationToken,
} from "./jwt";

type SendVerificationEmailParams = {
  email: string;
  name: string;
};

export async function sendVerificationEmail(
  params: SendVerificationEmailParams
) {
  const token = generateVerificationToken();

  const ONE_DAY_IN_SECONDS = 86400;
  const expires = new Date(Date.now() + ONE_DAY_IN_SECONDS * 1000);

  await saveVerificationToken({
    identifier: params.email,
    expires,
    token: hashToken(token),
  });

  const urlParams = new URLSearchParams({ token, email: params.email });

  await sendEmailWrapper({
    to: params.email,
    template: "email_verification",
    props: {
      name: params.name,
      link: `${env.APP_URL}/verify-email?${urlParams}`,
    },
  });

  return "SENT";
}
