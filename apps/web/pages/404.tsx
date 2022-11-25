import { NextPage } from 'next';
import Error from 'next/error';
import { FormattedMessage } from 'react-intl';
import PageWrapper from '../components/common/wrappers/PageWrapper';

const ErrorPage: NextPage = () => {
  return (
    <PageWrapper>
      <Error
        statusCode={404}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        title={(<FormattedMessage id={'not_found'} />) as any}
      />
    </PageWrapper>
  );
};

export default ErrorPage;
