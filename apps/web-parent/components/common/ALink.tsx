import Link from 'next/link';

type ALinkProps = {
  href: string;
  text: string;
  external?: boolean;
  className?: string;
};

function ALink({ href, text, external = false, className }: ALinkProps) {
  return (
    <Link href={href} passHref={true}>
      <a
        className={className + ' text-primary-dark'}
        target={external ? '_blank' : ''}
      >
        {text} {external && <span>ext</span>}
      </a>
    </Link>
  );
}

export default ALink;
