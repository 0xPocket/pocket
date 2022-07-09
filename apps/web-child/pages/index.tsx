import { useAccount, useBalance } from 'wagmi';
import ClaimDashboard from '../components/dashboard/ClaimDashboard';
import MainWrapper from '../components/wrappers/MainWrapper';
import { useAuth } from '../contexts/auth';
import { NextPageWithLayout } from './_app';

const ChildrenSignup: NextPageWithLayout = () => {
  const { user, loggedIn } = useAuth();
  const { address } = useAccount();
  const { data, status } = useBalance({
    addressOrName: address,
  });

  return (
    <section className="flex flex-col items-center justify-center">
      {user ? (
        <div>Welcome {user?.firstName} !</div>
      ) : (
        <div>You must connect</div>
      )}
      {data && (
        <>
          <div>
            Balance : {data.formatted} {data.symbol}
          </div>
          <ClaimDashboard />
        </>
      )}
    </section>
  );
};

ChildrenSignup.getLayout = (page) => {
  return <MainWrapper>{page}</MainWrapper>;
};

export default ChildrenSignup;
