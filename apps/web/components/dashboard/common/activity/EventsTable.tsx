import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import moment from 'moment';
import { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import FormattedMessage from '../../../common/FormattedMessage';
import { Event } from '../../../../hooks/useGetClaimsQuery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowDownLong,
  faArrowUpLong,
} from '@fortawesome/free-solid-svg-icons';

type EventTableProps = {
  logs: Event[];
};

const getBadge = (category: Event['category']) => {
  switch (category) {
    case 'Claim':
      return (
        <span className="cat-badge-green">
          <FormattedMessage id="claim.noun" />{' '}
          <FontAwesomeIcon icon={faArrowDownLong} />
        </span>
      );
    case 'Deposit':
      return (
        <span className="cat-badge-blue">
          <FormattedMessage id="deposit.noun" />{' '}
          <FontAwesomeIcon icon={faArrowUpLong} />
        </span>
      );
  }
};

const columnHelper = createColumnHelper<Event>();

function EventsTable({ logs }: EventTableProps) {
  const intl = useIntl();

  const [data] = useState([...logs]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('timestamp', {
        header: () => (
          <span>
            <FormattedMessage id="date" />
          </span>
        ),
        cell: (info) => (
          <span>
            {moment(info.getValue() * 1000)
              .locale(intl.locale)
              .fromNow()}
          </span>
        ),
        id: 'Date',
      }),

      columnHelper.accessor((row) => `${row.value} ${row.symbol}`, {
        header: () => (
          <span>
            <FormattedMessage id="amount" />
          </span>
        ),
        cell: (info) => <div className="text-right">{info.getValue()}</div>,
        id: 'Amount',
      }),
      columnHelper.accessor('category', {
        header: () => (
          <span>
            <FormattedMessage id="category" />
          </span>
        ),
        cell: (info) => (
          <div className="text-right">{getBadge(info.getValue())}</div>
        ),
        id: 'Category',
      }),
    ],
    [intl],
  );

  const [sorting] = useState<SortingState>([{ id: 'Date', desc: true }]);

  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  });

  return (
    <>
      {logs.length ? (
        <div className="table-container">
          <table className="table">
            <thead className="table-head">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      <div
                        className={`table-header ${
                          header.index !== 0 && 'justify-end'
                        } `}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="table-body">
              {table.getRowModel().rows.map((row) => (
                <tr className="table-row" key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="table-cell text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="my-8 w-full text-center text-xl">
          <FormattedMessage id="dashboard.common.activity.events.empty" />
        </p>
      )}
    </>
  );
}

export default EventsTable;
