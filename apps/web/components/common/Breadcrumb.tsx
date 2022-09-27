import { faAngleRight, faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Head from 'next/head';
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

const generateRoute = (route: route, lastEl: boolean) => {
  console.log();

  return (
    <>
      {route.path ? <a href={route.path}>{route.name}</a> : <p>{route.name}</p>}
      {!lastEl && <FontAwesomeIcon icon={faAngleRight} />}
    </>
  );
};

const Breadcrumb: FC<BreadcrumbProps> = ({ routes }) => {
  return (
    <div className="mb-12 flex items-center space-x-4">
      <Head>
        <title>
          {routes.length === 0 ? 'Home' : routes[routes.length - 1].name} |
          Pocket
        </title>
      </Head>
      {routes.length === 0 ? (
        <>
          <FontAwesomeIcon icon={faHome} className="mr-2" /> Home
        </>
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

      {routes.map((route, i) => {
        return generateRoute(route, i === routes.length - 1);
      })}
    </div>
  );
};

export default Breadcrumb;
