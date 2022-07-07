import { nft_data } from './NftContent';
import Image from 'next/image';

function NftCard({ nft }: { nft: nft_data }) {
  return (
    <div className="dark:danger w-48 rounded-lg border-dark border-opacity-5 bg-white shadow-lg dark:border-white-darker dark:bg-dark-light">
      <Image src={nft.token_url} className="rounded-t-lg" width={300} height={300} alt={nft.token_id} />
      <p
        title={nft.contract_name}
        className="overflow-hidden text-ellipsis whitespace-nowrap mb-4 mx-2"
      >
        {nft.contract_name}
      </p>
      <div className="my-2 mx-2">#{nft.token_id}</div>
    </div>
  );
}

export default NftCard;
