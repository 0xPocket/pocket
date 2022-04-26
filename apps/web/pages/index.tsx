import { useAuth } from '@lib/nest-auth/next';

const LoginButton = () => {
  const { status, signIn } = useAuth();

  if (status === 'loading') return <div>loading...</div>;

  return (
    <>
      <button onClick={() => signIn('github')}>LOGIN WITH GITHUB</button>
      <button onClick={() => signIn('facebook')}>LOGIN WITH FACEBOOK</button>
    </>
  );
};
export default function Web() {
  const { session } = useAuth();

  return (
    <div>
      {session && (
        <h1 className="m-2 flex h-32 w-16 flex-col px-8 text-red-400">
          Welcome {session?.id}
        </h1>
      )}
      {!session && <LoginButton />}
    </div>
  );
}
