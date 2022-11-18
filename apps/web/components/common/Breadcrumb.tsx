import {
  faAngleRight,
  faArrowLeft,
  faHome,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC, ReactNode } from 'react';

type route = {
  name: string;
  path: string | null;
};

type BreadcrumbProps = {
  children?: ReactNode;
  routes: route[];
};

const Breadcrumb: FC<BreadcrumbProps> = ({ routes }) => {
  const router = useRouter();

  const splittedPathname = router.asPath.split('/').filter(Boolean);

  return (
    <>
      {splittedPathname.length !== 0 && (
        <div className="mb-12 flex items-center space-x-4 md:hidden">
          <button onClick={() => router.back()} className="text-2xl">
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        </div>
      )}
      <div className="mb-12 hidden items-center space-x-4 md:flex">
        {routes.length === 0 ? (
          <p>
            <FontAwesomeIcon icon={faHome} className="mr-2" /> Home
          </p>
        ) : (
          <>
            <Link href="/">
              <a>
                <FontAwesomeIcon icon={faHome} className="mr-2" /> Home
              </a>
            </Link>
            <FontAwesomeIcon icon={faAngleRight} />
          </>
        )}

        {routes.map((route, i) => (
          <div key={i} className="flex items-center">
            {route.path ? (
              <Link href={route.path}>
                <a>{route.name}</a>
              </Link>
            ) : (
              <p>{route.name}</p>
            )}
            {i !== routes.length - 1 && (
              <FontAwesomeIcon icon={faAngleRight} className="ml-4" />
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Breadcrumb;
