import Link from 'next/link';

type NavProps = {};

function Nav({}: NavProps) {
  return (
    <div className="ml-16 flex items-end gap-16">
      <Link href="/dashboard" passHref={true}>
        <a>Dashboard</a>
      </Link>
      <Link href="/#" passHref={true}>
        <a>F.A.Q.</a>
      </Link>
      <Link href="/#" passHref={true}>
        <a>Blog</a>
      </Link>
    </div>
  );
}

export default Nav;
