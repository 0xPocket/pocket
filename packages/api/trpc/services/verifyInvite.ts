import { TRPCError } from "@trpc/server";
import { hashToken, useVerificationToken } from "./jwt";

type VerifyInviteParams = {
  token: string;
  identifier: string;
};

/**
 * Verify an invite token, throws a TRPCError if the token is invalid
 * @param params token and identifier
 */

export async function verifyInvite(params: VerifyInviteParams) {
  const invite = await useVerificationToken({
    token: hashToken(params.token),
    identifier: params.identifier,
  });

  const invalidInvite = !invite || invite.expires.valueOf() < Date.now();

  if (invalidInvite) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid invite.",
    });
  }

  return invite;
}
