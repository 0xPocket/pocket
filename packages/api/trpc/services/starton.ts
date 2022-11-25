import { Address } from "abitype";
import { env } from "config/env/server";
import axios from "axios";
import { Forwarder } from "pocket-contract/typechain-types";

type StartonSmartContractCallResponse = {
  id: string;
  to: string;
  transactionHash: Address;
  projectId: string;
  createdAt: string;
  updatedAt: string;
};

const http = axios.create({
  baseURL: "https://api.starton.io/v2",
  headers: {
    "x-api-key": env.STARTON_KEY,
  },
});

type ExecuteParams = Forwarder["functions"]["execute"] extends (
  ...args: infer P
) => unknown
  ? P
  : never;

export const startonRelayer = async (params: ExecuteParams) => {
  return http
    .post<StartonSmartContractCallResponse>(
      `/smart-contract/${env.NETWORK_KEY}/${env.TRUSTED_FORWARDER}/call`,
      {
        functionName:
          "execute((address,address,uint256,uint256,uint256,bytes,uint256),bytes32,bytes32,bytes,bytes)",
        signerWallet: env.SIGNER_WALLET, // test wallet
        speed: "fast",
        params,
      }
    )
    .then((res) => res.data);
};
