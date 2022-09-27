import { Abi } from 'abitype';
import { BigNumber, Contract, ContractInterface, providers } from 'ethers';
import { EIP712Domain, ForwardRequest } from './TypedData';

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

  console.log('typeData', typeData);
  return {
    domain: typeData.domain,
    types: types,
    value: request,
  };
}
