import { Wallet, providers } from "ethers";
import { ParentContract } from "./Parent";

require("dotenv").config({ path: "../../contract.env" });

async function main() {
  const provider = new providers.JsonRpcProvider("http://localhost:8545");
  const parentWallet = new Wallet(
    "0x701b615bbdfb9de65240bc28bd21bbc0d996645a3dd57e7b12bc2bdf6f192c82",
    provider
  );
  const parent = new ParentContract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
    parentWallet
  );

  await parent.addChild(
    {
      active: true,
      balance: 0,
      ceiling: 20,
      parent: "0x71be63f3384f5fb98995898a86b02fb2426c5788",
      lastClaim: 0,
      periodicity: 0,
    },
    "0x2546bcd3c84621e976d8185a91a922ae77ecec30"
  );
}

main().catch((e) => console.error(e));
