import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CovalentReturn } from '@lib/types/interfaces';
import axios from 'axios';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import TokenTable from './TokenTable';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { UserChild } from '.prisma/client';

type TokenContentProps = {
  child: UserChild;
};

const fetchUsers = () => {
  const APIKEY = 'ckey_d68ffbaf2bdf47b6b58e84fada7';
  const baseURL = 'https://api.covalenthq.com/v1';
  const blockchainChainId = '137';
  const address = '0xD408c5DdcBf297dcAa745009277007429719E205';
  const res = axios.get(
    `${baseURL}/${blockchainChainId}/address/${address}/balances_v2/?key=${APIKEY}`,
  );
  return res.then((res) => res.data.data);
};

function TokenContent({ child }: TokenContentProps) {
  console.log(child);
  const { isLoading, data: content } = useQuery<CovalentReturn>(
    ['child-token-content', child.id],
    fetchUsers,
    {
      enabled: !!child,
      onError: () => toast.error("Could not retrieve user's token"),
    },
  );

  return (
    <div>
      {!isLoading && content?.items ? (
        <TokenTable tokenList={content.items} />
      ) : (
        <FontAwesomeIcon icon={faSpinner} spin />
      )}
    </div>
  );
}

export default TokenContent;