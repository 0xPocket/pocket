import { AES, enc } from 'crypto-js';
import { providers, Wallet } from 'ethers';

export const getSigner = (
  encryptedPrivateKey: string,
  encryptedPassword: string,
) => {
  const provider = new providers.JsonRpcProvider('http://localhost:8545');

  const decryptedPK = AES.decrypt(
    encryptedPrivateKey,
    encryptedPassword,
  ).toString(enc.Utf8);
  return new Wallet(decryptedPK, provider);
};
