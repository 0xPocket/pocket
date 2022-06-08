import { AES, enc, SHA256 } from 'crypto-js';
import { providers, Wallet } from 'ethers';

export const getSigner = (encryptedPrivateKey: string, password: string) => {
  const provider = new providers.JsonRpcProvider('http://localhost:8545');
  const encryptedPassword = sha256(password);

  const decryptedPK = decryptPK(encryptedPrivateKey, encryptedPassword);
  return new Wallet(decryptedPK, provider);
};

export function encryptPK(privateKey: string, passwordHash: string) {
  return AES.encrypt(privateKey, passwordHash).toString();
}

export function decryptPK(encryptedPK: string, passwordHash: string) {
  return AES.decrypt(encryptedPK, passwordHash).toString(enc.Utf8);
}

export function sha256(inputString: string) {
  const hash = SHA256(inputString);
  return hash.toString(enc.Hex);
}

export type EncryptedWallet = {
  publicKey: string;
  encryptedPrivateKey: string;
};

export function generateWallet(password: string): EncryptedWallet {
  const wallet = Wallet.createRandom();

  const hashedPassword = sha256(password);

  return {
    publicKey: wallet.address,
    encryptedPrivateKey: encryptPK(wallet.privateKey, hashedPassword),
  };
}
