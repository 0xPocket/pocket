import SectionContainer from '../../components/containers/SectionContainer';
import MainWrapper from '../../components/wrappers/MainWrapper';

type indexProps = {};

function index({}: indexProps) {
  return (
    <MainWrapper>
      <SectionContainer>
        <h1>Hello Bro</h1>
      </SectionContainer>
    </MainWrapper>
  );
}

export default index;
