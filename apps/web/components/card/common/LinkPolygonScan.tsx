import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import type { FC } from 'react';
import FormattedMessage from '../../common/FormattedMessage';

type LinkPolygonScanProps = {
  address: string;
};

const LinkPolygonScan: FC<LinkPolygonScanProps> = ({ address }) => {
  return (
    <Link href={`https://polygonscan.com/address/${address}`}>
      <a className="py-3" target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="mr-2" />
        <FormattedMessage id="dashboard.parent.card.see-on-polygon" />
      </a>
    </Link>
  );
};

export default LinkPolygonScan;
