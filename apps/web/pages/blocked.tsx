import PageWrapper from '../components/common/wrappers/PageWrapper';

function Blocked() {
  return (
    <PageWrapper noFooter noHeader>
      <h3 className="text-center">
        Your country is not allowed to use this service.
      </h3>
    </PageWrapper>
  );
}

export default Blocked;
