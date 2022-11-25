import {
  generateVerificationToken,
  hashToken,
  saveVerificationToken,
} from "./jwt";

const ONE_DAY_IN_SECONDS = 86400;

async function generateToken(params: object) {
  const token = generateVerificationToken();
  const expires = new Date(Date.now() + ONE_DAY_IN_SECONDS * 1000);

  await saveVerificationToken({
    identifier: JSON.stringify(params),
    token: hashToken(token),
    expires: expires,
  });

  return token;
}

type GenerateLinkParamsProps = {
  childId: string;
  parentId: string;
};

export async function generateLinkParams(params: GenerateLinkParamsProps) {
  const token = await generateToken(params);

  return new URLSearchParams({
    token,
    ...params,
  });
}

type GenerateRegisterParamsProps =
  | {
      childId: string;
      email: string;
    }
  | {
      parentId: string;
      email: string;
    };

export async function generateRegisterParams(
  params: GenerateRegisterParamsProps,
  type: "Child" | "Parent"
) {
  const token = await generateToken(params);

  return new URLSearchParams({
    token,
    ...params,
    type,
  });
}
