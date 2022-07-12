import { CovalentReturn, UserChild } from '@lib/types/interfaces';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import axios from 'axios';
import NftLibrary from './NftLibrary';
import { useAlchemy } from '../../../contexts/alchemy';
import { getNftsForOwner, OwnedNftsResponse } from '@alch/alchemy-sdk';

type NftContentProps = {
  child: UserChild;
};

const fetchList = () => {
  const APIKEY = 'ckey_d68ffbaf2bdf47b6b58e84fada7';
  const baseURL = 'https://api.covalenthq.com/v1';
  const blockchainChainId = '1';
  const address = '0xb3E5A0060cb17FEBb7ecC339e4F2C4398D062f59';
  const res = axios.get<{ data: CovalentReturn }>(
    `${baseURL}/${blockchainChainId}/address/${address}/balances_v2/?quote-currency=USD&format=JSON&nft=true&no-nft-fetch=true&key=${APIKEY}`,
  );

  return res.then((res) => {
    console.log(res.data);
    return res.data.data;
  });
};

function NftContent({ child }: NftContentProps) {
  const { alchemy } = useAlchemy();

  const { isLoading, data: content } = useQuery(
    ['child-nft-content', child.id],
    () => getNftsForOwner(alchemy, child.web3Account.address),
    {
      enabled: !!child,
      onError: () => toast.error("Could not retrieve user's token"),
    },
  );

  return (
    <div>
      <h2>Nft Library</h2>
      {!isLoading && content && <NftLibrary nftContent={content} />}
    </div>
  );
}

export default NftContent;
