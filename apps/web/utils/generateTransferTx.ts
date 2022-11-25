import { env } from 'config/env/client';
import { BigNumber, Contract, ethers, providers } from 'ethers';
import { hexZeroPad } from 'ethers/lib/utils';
import { ERC20PermitAbi } from 'pocket-contract/abi';

const EIP712Domain = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'verifyingContract', type: 'address' },
  { name: 'salt', type: 'bytes32' },
];

const TransferWithAuthorization = [
  { name: 'from', type: 'address' },
  { name: 'to', type: 'address' },
  { name: 'value', type: 'uint256' },
  { name: 'validAfter', type: 'uint256' },
  { name: 'validBefore', type: 'uint256' },
  { name: 'nonce', type: 'bytes32' },
];

async function buildTransferRequest(input: {
  from: string;
  to: string;
  value: string;
}) {
  // get the nonce
  const nonce = BigNumber.from(ethers.utils.randomBytes(32));

  return {
    ...input,
    nonce: nonce._hex,
    validAfter: 0,
    validBefore: Math.floor(Date.now() / 1000) + 3600,
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
      TransferWithAuthorization,
    },
    domain: {
      ...domain,
      salt: hexZeroPad(BigNumber.from(chainId).toHexString(), 32),
      verifyingContract,
    },
    primaryType: 'Permit',
  };
}

type GenerateTransferTxParams = {
  erc20Address: string;
  from: string;
  to: string;
  value: string;
  provider: providers.Provider;
  domain: Domain;
};

export async function generateTransferTx({
  erc20Address,
  provider,
  from,
  to,
  value,
  domain,
}: GenerateTransferTxParams) {
  const erc20Contract = new Contract(erc20Address, ERC20PermitAbi, provider);

  const request = await buildTransferRequest({
    from,
    to,
    value,
  });
  const typeData = getMetaTxTypeData(
    domain,
    env.CHAIN_ID,
    erc20Contract.address,
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { EIP712Domain: _unused, ...types } = typeData.types;

  return {
    domain: typeData.domain,
    types: types,
    value: request,
  };
}
