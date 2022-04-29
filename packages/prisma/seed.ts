import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.userParent.create({
    data: {
      id: "elonmusk",
      firstName: "Elon",
      lastName: "Musk",
      email: "elonmusk@gmail.com",
      wallet: {
        create: {
          publicKey: "whatever",
          privateKey: "itsprivate",
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
