import { Wallet, providers } from "ethers";
import { ParentContract } from "./Parent";

require("dotenv").config();

async function main() {
  const provider = new providers.JsonRpcProvider("http://localhost:8545");
  const parentWallet = new Wallet(
    "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", // Elon Musk's Wallet
    provider
  );
  const parent = new ParentContract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
    parentWallet
  );

  const tx = await parent.addChild(
    20,
    0,
    "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc"
  ); // Damian Musk's Wallet
  const res = await provider.sendTransaction(tx);
  console.log("Contract seeding complete !");
}

main().catch((e) => console.error(e));
