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
    cell: (info) => <span>{info.getValue()}</span>,
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
        <>
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  className="mt-1 grid grid-cols-2 gap-4"
                  key={headerGroup.id}
                >
                  {headerGroup.headers.map((header) => (
                    <td key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr className="grid grid-cols-2 gap-4" key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
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
        </>
      ) : (
        <p className="w-full text-center">{'No top-ups for now.'}</p>
      )}
    </>
  );
}

export default EventsTable;
