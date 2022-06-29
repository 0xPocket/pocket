import { ReactElement } from 'react';
import MainWrapper from '../components/wrappers/MainWrapper';
import { NextPageWithLayout } from './_app';

const ChildrenSignup: NextPageWithLayout = () => {
  return (
    <section className="">
      <div>You must connect</div>
      {/* <div>Balance : {balance} ETH</div> */}
    </section>
  );
};

ChildrenSignup.getLayout = function getLayout(page: ReactElement) {
  return <MainWrapper>{page}</MainWrapper>;
};

export default ChildrenSignup;
