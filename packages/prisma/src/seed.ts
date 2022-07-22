import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.userParent.upsert({
    where: {
      id: "solaldunckel",
    },
    create: {
      id: "solaldunckel",
      firstName: "Solal",
      lastName: "Dunckel",
      email: "solaldunckel@gmail.com",
      address: "0x9DA96cb647116313129EAb5BB81E87940fAD6f60",
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
      email: "damianmusk@gmail.com",
      status: "ACTIVE",
      userParent: {
        connect: {
          id: "solaldunckel",
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
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
