/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Abi } from 'abitype';
import { env } from 'config/env/client';
import {
  BigNumber,
  Contract,
  ContractInterface,
  ethers,
  providers,
} from 'ethers';

const EIP712Domain = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'verifyingContract', type: 'address' },
  { name: 'salt', type: 'bytes32' },
];

const Permit = [
  { name: 'owner', type: 'address' },
  { name: 'spender', type: 'address' },
  { name: 'value', type: 'uint256' },
  { name: 'nonce', type: 'uint256' },
  { name: 'deadline', type: 'uint256' },
];

// get timestamp in seconds
function getTimestamp() {
  return Math.floor(Date.now() / 1000);
}

async function buildPermitRequest(
  erc20: Contract,
  input: { owner: string; spender: string; value: string },
) {
  // get the nonce
  const nonce = await erc20
    .nonces(input.owner)
    .then((nonce: BigNumber) => nonce.toNumber());
  return {
    ...input,
    nonce,
    deadline: getTimestamp() + 300,
  };
}

type Domain = {
  name: string;
  version: string;
};

function getMetaTxTypeData(
  domain: Domain,
  chainId: number,
  verifyingContract: string,
) {
  return {
    types: {
      EIP712Domain,
      Permit,
    },
    domain: {
      ...domain,
      salt: ethers.utils.hexZeroPad(
        ethers.BigNumber.from(chainId).toHexString(),
        32,
      ),
      verifyingContract,
    },
    primaryType: 'Permit',
  };
}

type GeneratePermitTxParams = {
  erc20Address: string;
  erc20Interface: ContractInterface | Abi;
  owner: string;
  spender: string;
  value: string;
  provider: providers.Provider;
  domain: Domain;
  functionName: string;
};

export async function generatePermitTx({
  erc20Address,
  erc20Interface,
  provider,
  owner,
  spender,
  value,
  domain,
}: GeneratePermitTxParams) {
  const erc20Contract = new Contract(
    erc20Address,
    erc20Interface as any,
    provider,
  );

  const request = await buildPermitRequest(erc20Contract, {
    owner,
    spender,
    value,
  });
  const typeData = getMetaTxTypeData(
    domain,
    env.CHAIN_ID,
    erc20Contract.address,
  );

  const { EIP712Domain: _unused, ...types } = typeData.types;

  return {
    domain: typeData.domain,
    types: types,
    value: request,
  };
}
