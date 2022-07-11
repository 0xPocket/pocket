import ClaimDashboard from '../components/dashboard/ClaimDashboard';
import MainWrapper from '../components/wrappers/MainWrapper';
import { useAuth } from '../contexts/auth';
import { NextPageWithLayout } from './_app';

const ChildrenSignup: NextPageWithLayout = () => {
  const { user, loggedIn } = useAuth();

  return (
    <section className="flex flex-col items-center justify-center">
      {user ? (
        <>
          <div>Welcome {user?.firstName} !</div>
          <ClaimDashboard />
        </>
      ) : (
        <div>You must connect</div>
      )}
    </section>
  );
};

ChildrenSignup.getLayout = (page) => {
  return <MainWrapper>{page}</MainWrapper>;
};

export default ChildrenSignup;
