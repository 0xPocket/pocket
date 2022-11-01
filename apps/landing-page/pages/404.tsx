import { NextPage } from 'next';
import Error from 'next/error';
import MainContainer from '../components/containers/MainContainer';

const ErrorPage: NextPage = () => {
  return (
    <MainContainer>
      <Error statusCode={404} />
    </MainContainer>
  );
};

export default ErrorPage;
