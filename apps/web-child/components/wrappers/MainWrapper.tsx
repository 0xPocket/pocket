import Header from '../header/Header';
import { useAuth } from '@lib/nest-auth/next';
import { Router, useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AuthGuard from './AuthGuard';

type MainWrapperProps = {
  children: React.ReactNode;
  noHeader?: Boolean;
  authProtected?: Boolean;
};

function MainWrapper({
  children,
  noHeader = false,
  authProtected = false,
}: MainWrapperProps) {
  if (!authProtected) {
    return (
      <div className="min-h-screen">
        {!noHeader && <Header />}
        {children}
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen">
        {!noHeader && <Header />}
        {children}
      </div>
    </AuthGuard>
  );
}

export default MainWrapper;
