import { ethers } from 'ethers';

const EIP712_DOMAIN_TYPEHASH = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes(
    'EIP712Domain(string name,string version,address verifyingContract,bytes32 salt)'
  )
);

const NAME = 'USD Coin (PoS)';

async function main() {
  const HASH = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ['bytes32', 'bytes32', 'bytes32', 'address', 'bytes32'],
      [
        EIP712_DOMAIN_TYPEHASH,
        ethers.utils.keccak256(ethers.utils.toUtf8Bytes(NAME)),
        ethers.utils.keccak256(ethers.utils.toUtf8Bytes('1')),
        '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
        ethers.utils.hexZeroPad(ethers.BigNumber.from(137).toHexString(), 32),
      ]
    )
  );
  console.log(HASH);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
