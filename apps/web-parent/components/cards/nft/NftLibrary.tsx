import { covalentItem, nft_data } from './NftContent';
import NftCard from './NftCard';

function covalentListToNftList(covalentlist: covalentItem[]) {
  const nftList: nft_data[] = [];
  for (const item of covalentlist) {
    if (item.type !== 'nft') continue;
    for (const nft of item.nft_data) {
      nft.token_url =
        'https://tftw-nfts.fra1.digitaloceanspaces.com/gif/1634.gif';
      nft.contract_name = item.contract_name;
      nftList.push(nft);
    }
  }
  return nftList;
}

function NftLibrary({ covalentList }: { covalentList: covalentItem[] }) {
  const list = covalentListToNftList(covalentList);

  return (
    <div className="flex flex-wrap gap-4">
      {list.map((nftElem: nft_data) => (
        <NftCard nft={nftElem} />
      ))}
    </div>
  );
}

export default NftLibrary;
