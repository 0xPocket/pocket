import { UserChild } from '@lib/types/interfaces';

type AccountProps = {
  userChild: UserChild;
};

export async function getServerSideProps() {
  return {
    props: {}, // will be passed to the page component as props
  };
}

function Account({ userChild }: AccountProps) {
  return (
    <div>
      <h1> {} </h1>
    </div>
  );
}

export default Account;
