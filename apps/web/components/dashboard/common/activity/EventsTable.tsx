import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import moment from 'moment';

type EventTableProps = {
  logs: Event[];
};

type Event = {
  symbol: string;
  value: string;
  timestamp: number;
};

const columnHelper = createColumnHelper<Event>();

const columns = [
  columnHelper.accessor('timestamp', {
    header: () => <span>Date</span>,
    cell: (info) => <span>{moment(info.getValue()).format('D/MM')}</span>,
    id: 'Date',
  }),

  columnHelper.accessor((row) => `${row.value} ${row.symbol}`, {
    header: () => <span>Amount</span>,
    cell: (info) => <div className="text-right">{info.getValue()}</div>,
    id: 'Amount',
  }),
];

function EventsTable({ logs }: EventTableProps) {
  const table = useReactTable({
    data: logs,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
          {'No transactions to display.'}
        </p>
      )}
    </>
  );
}

export default EventsTable;
