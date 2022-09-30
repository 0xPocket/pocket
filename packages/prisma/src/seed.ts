import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ELON MUSK 0xBcd4042DE499D14e55001CcbB24a551F3b954096
  await prisma.user.upsert({
    where: {
      id: "elonmusk",
    },
    create: {
      id: "elonmusk",
      name: "Elon Musk",
      email: "elonmusk@gmail.com",
      emailVerified: new Date(),
      address: "0xBcd4042DE499D14e55001CcbB24a551F3b954096",
      type: "Parent",
      newUser: false,
      parent: {
        connectOrCreate: {
          where: {
            userId: "elonmusk",
          },
          create: {},
        },
      },
    },
    update: {},
  });

  // DAMIAN => DB/CONTRAT 0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec
  await prisma.user.upsert({
    where: {
      id: "damianmusk",
    },
    create: {
      id: "damianmusk",
      name: "Damian",
      email: "damianmusk@gmail.com",
      emailVerified: new Date(),
      address: "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec",
      type: "Child",
      newUser: false,
      child: {
        connectOrCreate: {
          where: {
            userId: "damianmusk",
          },
          create: {
            initialCeiling: 50,
            initialPeriodicity: "2592000",
            parentUserId: "elonmusk",
          },
        },
      },
    },
    update: {},
  });

  // XAVIER => DB 0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097
  await prisma.user.upsert({
    where: {
      id: "xaviermusk",
    },
    create: {
      id: "xaviermusk",
      name: "Xavier",
      email: "xaviermusk@gmail.com",
      emailVerified: new Date(),
      address: "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097",
      type: "Child",
      newUser: false,
      child: {
        connectOrCreate: {
          where: {
            userId: "xaviermusk",
          },
          create: {
            initialCeiling: 50,
            initialPeriodicity: "2592000",
            parentUserId: "elonmusk",
          },
        },
      },
    },
    update: {},
  });

  // LOLA => DB/CONTRAT/ADD FUNDS 0xcd3B766CCDd6AE721141F452C550Ca635964ce71
  await prisma.user.upsert({
    where: {
      id: "lolamusk",
    },
    create: {
      id: "lolamusk",
      name: "Lola",
      email: "lolamusk@gmail.com",
      emailVerified: new Date(),
      address: "0xcd3B766CCDd6AE721141F452C550Ca635964ce71",
      type: "Child",
      newUser: false,
      child: {
        connectOrCreate: {
          where: {
            userId: "lolamusk",
          },
          create: {
            initialCeiling: 50,
            initialPeriodicity: "2592000",
            parentUserId: "elonmusk",
          },
        },
      },
    },
    update: {},
  });

  await prisma.childConfig.upsert({
    where: {
      id: 0,
    },
    create: {
      id: 0,
      name: "Amber Heard",
      email: "amberheard@gmail.com",
      initialCeiling: 50,
      initialPeriodicity: "2592000",
      parentUserId: "elonmusk",
    },
    update: {},
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
