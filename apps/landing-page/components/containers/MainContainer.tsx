import React from 'react';
import Header from '../Header';

type MainContainerProps = { children: React.ReactNode };

function MainContainer({ children }: MainContainerProps) {
  return (
    <div className=" container relative mx-auto p-4 md:min-h-screen">
      <Header />
      {children}
    </div>
  );
}

export default MainContainer;
