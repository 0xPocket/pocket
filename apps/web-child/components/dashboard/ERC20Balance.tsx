import React from 'react';
import { useAccount, useBalance, useContractWrite, useToken } from 'wagmi';

const ERC20Balance: React.FC = () => {
  const { address } = useAccount();
  const { data: erc20data } = useToken({
    address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
  });

  const { data } = useBalance({
    addressOrName: address,
    token: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    formatUnits: erc20data?.decimals,
    watch: true,
  });

  // const { write } = useContractWrite({
  //   addressOrName: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
  //   contractInterface:
  //     '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"caretaker","type":"address"},{"indexed":true,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"CaretakerLoved","type":"event"},{"inputs":[],"name":"clean","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"feed","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getAlive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getBoredom","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getHunger","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getSleepiness","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getStatus","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getUncleanliness","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"love","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"play","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"sleep","outputs":[],"stateMutability":"nonpayable","type":"function"}]',
  //   functionName: 'feed',
  // });

  // return <button onClick={() => write()}>Feed</button>;

  if (!data) {
    return <div>Loading..</div>;
  }

  return (
    <div>
      USDC Balance : {data.formatted} {erc20data?.symbol}
    </div>
  );
};

export default ERC20Balance;
