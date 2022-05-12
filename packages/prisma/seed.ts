import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.userParent.create({
    data: {
      id: "elonmusk",
      firstName: "Elon",
      lastName: "Musk",
      email: "elonmusk@gmail.com",
      emailVerified: new Date(),
      account: {
        create: {
          type: "credentials",
          provider: "local",
          password:
            "$2a$10$RBiyQ3DOgSBdvnP7KOMFSeszgtwdKtSvG5fW3jIGgqNX65o61npl2", // elonmusk
        },
      },
      wallet: {
        create: {
          publicKey: "0x71be63f3384f5fb98995898a86b02fb2426c5788", // Account #11 from Hardhat
          privateKey:
            "0x701b615bbdfb9de65240bc28bd21bbc0d996645a3dd57e7b12bc2bdf6f192c82", // Account #11 from Hardhat
        },
      },
    },
  });

  await prisma.userChild.create({
    data: {
      id: "damianmusk",
      firstName: "Damian",
      lastName: "Musk",
      email: "damianmusk@gmail.com",
      userParent: {
        connect: {
          id: "elonmusk",
        },
      },
      web3Account: {
        create: {
          address: "0x2546bcd3c84621e976d8185a91a922ae77ecec30", // Account #16 from Hardhat
          nonce: "adgadghahasfah",
        },
      },
    },
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
