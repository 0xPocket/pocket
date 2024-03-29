import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

type NavLinkProps = {
  children: string;
  href: string;
  exact?: boolean;
};

export function NavLink({ children, href, exact = false }: NavLinkProps) {
  const { pathname } = useRouter();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link href={href}>
      <a className={`${isActive && 'active'} `}>{children}</a>
    </Link>
  );
}

type TitleProps = { children: React.ReactNode; href?: string };

function Title({ children, href }: TitleProps) {
  return (
    <Link href={href ? href : '/'} passHref>
      <div className="cursor-pointer text-4xl font-bold">{children}</div>
    </Link>
  );
}

function BlockLeft({ children }: { children: React.ReactNode }) {
  return <div className="flex">{children}</div>;
}

function Nav({
  show = true,
  children,
}: {
  show?: boolean;
  children: React.ReactNode;
}) {
  return (
    <>{show && <div className="ml-16 flex items-end gap-16">{children}</div>}</>
  );
}

function BlockRight({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-8">{children}</div>
  );
}

type HeaderProps = {
  children: React.ReactNode;
};

export function Header({ children }: HeaderProps) {
  return (
    <header className="z-50 flex">
      <div className="flex h-28 w-full items-center justify-between xl:mx-8">
        {children}
      </div>
    </header>
  );
}

Header.NavLink = NavLink;
Header.Nav = Nav;
Header.Title = Title;
Header.BlockLeft = BlockLeft;
Header.BlockRight = BlockRight;
