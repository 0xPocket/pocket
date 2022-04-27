import Header from '../header/Header';

type MainWrapperProps = {
  children: React.ReactNode;
  header?: Boolean;
};

function MainWrapper({ children, header = true }: MainWrapperProps) {
  return (
    <div className="min-h-screen">
      {header && <Header />}
      {children}
    </div>
  );
}

export default MainWrapper;
