import Bitcoin from './Bitcoin';
import Dollar from './Dollar';
import Ethereum from './Ethereum';
import Euro from './Euro';

type CoinsProps = {};

function Coins({}: CoinsProps) {
  return (
    <>
      <Dollar />
      <Bitcoin />
      <Ethereum />
      <Euro />
    </>
  );
}

export default Coins;
