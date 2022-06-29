import Header from '../header/Header';

type MainWrapperProps = {
  children: React.ReactNode;
  noHeader?: boolean;
  authProtected?: boolean;
};

function MainWrapper({ children, noHeader = false }: MainWrapperProps) {
  return (
    <div className="min-h-screen">
      {!noHeader && <Header />}
      {children}
    </div>
  );
}

export default MainWrapper;
