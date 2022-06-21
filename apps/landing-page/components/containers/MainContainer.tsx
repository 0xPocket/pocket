import React from 'react';
import Header from '../Header';

type MainContainerProps = { children: React.ReactNode };

function MainContainer({ children }: MainContainerProps) {
  return (
    <div className="relative min-h-screen w-screen overflow-hidden">
      <Header />
      {children}
    </div>
  );
}

export default MainContainer;
