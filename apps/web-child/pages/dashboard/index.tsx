import SectionContainer from '../../components/containers/SectionContainer';
import MainWrapper from '../../components/wrappers/MainWrapper';

type IndexProps = {};

function Index({}: IndexProps) {
  return (
    <MainWrapper authProtected>
      <SectionContainer>
        <h1>My Dashboard</h1>
      </SectionContainer>
    </MainWrapper>
  );
}

export default Index;
