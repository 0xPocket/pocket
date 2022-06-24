import React from 'react';
import Header from '../Header';

type MainContainerProps = { children: React.ReactNode };

function MainContainer({ children }: MainContainerProps) {
  return (
    <div className=" container relative mx-auto min-h-screen w-screen">
      <Header />
      {children}
    </div>
  );
}

export default MainContainer;
