import { AES, enc, SHA256 } from 'crypto-js';
import { providers, Wallet } from 'ethers';

export const getSigner = (encryptedPrivateKey: string, password: string) => {
  const provider = new providers.JsonRpcProvider('http://localhost:8545');
  const encryptedPassword = SHA256(password).toString();

  const decryptedPK = AES.decrypt(
    encryptedPrivateKey,
    encryptedPassword,
  ).toString(enc.Utf8);
  return new Wallet(decryptedPK, provider);
};
