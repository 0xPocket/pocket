import { PrismaClient } from "@prisma/client";
import { AES, SHA256 } from "crypto-js";
const prisma = new PrismaClient();

async function main() {
  await prisma.userParent.upsert({
    where: {
      id: "elonmusk",
    },
    create: {
      id: "elonmusk",
      firstName: "Elon",
      lastName: "Musk",
      email: "elonmusk@gmail.com",
      emailVerified: new Date(),
      account: {
        create: {
          type: "credentials",
          provider: "local",
          password: SHA256("elonmusk").toString(), // elonmusk
        },
      },
      wallet: {
        create: {
          publicKey: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8", // Account #1 from Anvil
          encryptedPrivateKey: AES.encrypt(
            "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", // Account #1 from Anvil
            SHA256("elonmusk").toString()
          ).toString(),
        },
      },
    },
    update: {},
  });

  await prisma.userChild.upsert({
    where: {
      id: "damianmusk",
    },
    create: {
      id: "damianmusk",
      firstName: "Damian",
      lastName: "Musk",
      email: "damianmusk@gmail.com",
      status: "ACTIVE",
      userParent: {
        connect: {
          id: "elonmusk",
        },
      },
      web3Account: {
        create: {
          address: "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc", // Account #2 from Anvil
          nonce: "adgadghahasfah",
        },
      },
    },
    update: {},
  });

  await prisma.userChild.upsert({
    where: {
      id: "xaviermusk",
    },
    create: {
      id: "xaviermusk",
      firstName: "Xavier",
      lastName: "Musk",
      email: "xaviermusk@gmail.com",
      status: "LINKED",
      userParent: {
        connect: {
          id: "elonmusk",
        },
      },
      web3Account: {
        create: {
          address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", // Account #2 from Anvil
          nonce: "adgadghahasfah",
        },
      },
    },
    update: {},
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
