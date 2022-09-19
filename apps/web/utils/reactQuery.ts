import { BigNumber, ethers } from 'ethers';

/**
 *
 * @param data a big number representing an eth value (eg: user balance)
 * @param nbrChar number of char to keep after dot
 * @returns string
 */
export const roundBigNumbertoString = (
  data: BigNumber | undefined,
  nbrChar: number,
) => {
  if (data) {
    const ethString = ethers.utils.formatEther(data);
    return ethString.slice(0, ethString.indexOf('.') + 1 + nbrChar);
  }
};
