import { NextPage } from 'next';
import Error from 'next/error';
import { FormattedMessage } from 'react-intl';
import MainContainer from '../components/containers/MainContainer';

const ErrorPage: NextPage = () => {
  return (
    <MainContainer>
      <Error
        statusCode={404}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        title={(<FormattedMessage id={'not_found'} />) as any}
      />
    </MainContainer>
  );
};

export default ErrorPage;
