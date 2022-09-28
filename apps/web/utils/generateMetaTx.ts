/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Abi } from 'abitype';
import { BigNumber, Contract, ContractInterface, providers } from 'ethers';

const EIP712Domain = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' },
];

const ForwardRequest = [
  { name: 'from', type: 'address' },
  { name: 'to', type: 'address' },
  { name: 'value', type: 'uint256' },
  { name: 'gas', type: 'uint256' },
  { name: 'nonce', type: 'uint256' },
  { name: 'data', type: 'bytes' },
  { name: 'validUntil', type: 'uint256' },
];

// get timestamp in seconds
function getTimestamp() {
  return Math.floor(Date.now() / 1000);
}

async function buildForwardRequest(
  forwarder: Contract,
  input: { from: string; to: string; data: string },
) {
  // get the nonce
  const nonce = await forwarder
    .getNonce(input.from)
    .then((nonce: BigNumber) => nonce.toNumber());
  return {
    value: 0,
    gas: 1e6,
    nonce,
    ...input,
    validUntil: getTimestamp() + 300,
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
      ForwardRequest,
    },
    domain: {
      ...domain,
      chainId,
      verifyingContract,
    },
    primaryType: 'ForwardRequest',
  };
}

type GenerateMetaTransactionParams = {
  contractAddress: string;
  contractInterface: ContractInterface | Abi;
  forwarderAddress: string;
  forwarderInterface: ContractInterface | Abi;
  provider: providers.Provider;
  domain: Domain;
  chainId: number;
  from: string;
  functionName: string;
  args: any;
};

export async function generateMetaTransaction({
  forwarderAddress,
  forwarderInterface,
  contractAddress,
  contractInterface,
  provider,
  domain,
  chainId,
  from,
  functionName,
  args,
}: GenerateMetaTransactionParams) {
  const contract = new Contract(
    contractAddress,
    contractInterface as any,
    provider,
  );
  const forwarder = new Contract(
    forwarderAddress,
    forwarderInterface as any,
    provider,
  );

  const data = contract.interface.encodeFunctionData(functionName, args);

  const request = await buildForwardRequest(forwarder, {
    from,
    to: contract.address,
    data,
  });
  const typeData = getMetaTxTypeData(domain, chainId, forwarder.address);

  const { EIP712Domain: _unused, ...types } = typeData.types;

  return {
    domain: typeData.domain,
    types: types,
    value: request,
  };
}
