import { Magic } from "@magic-sdk/admin";
import { env } from "config/env/server";

const magicAdmin = new Magic(env.MAGIC_LINK_SECRET_KEY);

export async function verifyDidToken(didToken: string) {
  try {
    magicAdmin.token.validate(didToken);

    const userAddress = magicAdmin.token.getPublicAddress(didToken);
    const userMetadata = await magicAdmin.users.getMetadataByPublicAddress(
      userAddress
    );

    if (!userMetadata.email) {
      throw new Error("No email.");
    }

    return {
      address: userAddress,
      email: userMetadata.email,
    };
  } catch (e) {
    return null;
  }
}
