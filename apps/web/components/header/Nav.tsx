import { useAuth } from '@lib/nest-auth/next';
import Link from 'next/link';

type NavProps = {};

function Nav({}: NavProps) {
  return (
    <div className="ml-8 flex items-end gap-8">
      <Link href="/dashboard" passHref={true}>
        <a>Dashboard</a>
      </Link>
    </div>
  );
}

export default Nav;
