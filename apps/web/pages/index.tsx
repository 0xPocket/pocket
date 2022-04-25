import { GetServerSideProps } from 'next';
import { useAuth } from '../contexts/auth';

export default function Web() {
  const { user, logout, oAuthLogin } = useAuth();

  return (
    <div>
      {user && (
        <h1 className="m-2 flex h-32 w-16 flex-col px-8 text-red-400">
          Welcome {user?.id}
        </h1>
      )}
      {!user && (
        <button onClick={() => oAuthLogin('google')}>LOGIN WITH GOOGLE</button>
      )}
      {user && <button onClick={() => logout()}>Logout</button>}
    </div>
  );
}
