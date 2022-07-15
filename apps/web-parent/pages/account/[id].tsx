import { UserChild } from '@lib/types/interfaces';
import { useQuery } from 'react-query';
import { useAxios } from '../../hooks/axios.hook';
import MainWrapper from '../../components/wrappers/MainWrapper';
import { SectionContainer } from '@lib/ui';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import ChildSettingsForm from '../../components/forms/ChildSettingsForm';
import AddfundsForm from '../../components/forms/AddfundsForm';
import { useSmartContract } from '../../contexts/contract';
import TokenContent from '../../components/page_account/token/TokenContent';
import NftContent from '../../components/page_account/nft/NftContent';
import AccountCard from '../../components/page_account/card/AccountCard';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.query.id;

  return {
    props: {
      id: id,
    },
  };
}

function Account({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const axios = useAxios();
  const { contract } = useSmartContract();

  const { isLoading, data: child } = useQuery<UserChild>(
    ['child', id],
    () =>
      axios
        .get<UserChild>('http://localhost:3000/api/users/children/' + id)
        .then((res) => {
          return res.data;
        }),
    {
      staleTime: 60 * 1000,
      retry: false,
    },
  );

  const { data: childConfig } = useQuery(
    'config',
    async () => await contract?.childToConfig(child!.web3Account.address),
    {
      enabled: !!child,
    },
  );

  /**
   * TODO: transaction history take the place of token balance
   * TODO: token balance go on its own row, with a pie chart and table
   */

  return (
    <MainWrapper authProtected>
      <SectionContainer>
        {isLoading ? (
          <>Loading</>
        ) : child ? (
          <div className="space-y-20">
            <div className="grid grid-cols-2 gap-8">
              <AccountCard child={child} config={childConfig} />
              <div className="flex flex-col justify-center gap-4">
                <AddfundsForm child={child} />
                <ChildSettingsForm child={child} config={childConfig} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <NftContent child={child} />
              <h2>Transaction history</h2>
            </div>
            <TokenContent child={child} />
          </div>
        ) : (
          <div>User not found</div>
        )}
        <div className="absolute right-[-700px] bottom-[-200px] -z-50 h-[1080px] w-[1920px] bg-dark-radial-herosection dark:opacity-10"></div>
      </SectionContainer>
    </MainWrapper>
  );
}

export default Account;
