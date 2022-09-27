import { faAngleRight, faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
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
  return (
    <div className="mb-12 flex items-center space-x-4">
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
  );
};

export default Breadcrumb;
