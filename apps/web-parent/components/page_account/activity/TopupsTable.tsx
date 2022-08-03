import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { UserChild } from '@lib/types/interfaces';
import { useState } from 'react';
import { PageSwitchers } from './PageSwitchers';

type TopupsTableProps = {
  child: UserChild;
  logs: topup[];
};

type topup = {
  symbol: string;
  value: string;
  timestamp: number;
};

const columnHelper = createColumnHelper<topup>();

const columns = [
  columnHelper.accessor('timestamp', {
    cell: (info) => <span className="ml-1">{info.getValue()}</span>,
    header: () => <span className="ml-1">Date</span>,
    id: 'Date',
  }),

  columnHelper.accessor((row) => `${row.value} ${row.symbol}`, {
    id: 'Amount',
  }),
];

export function TopupsTable({ logs }: TopupsTableProps) {
  const [data] = useState([...logs]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="container-classic rounded-lg">
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
          <PageSwitchers
            previousPage={table.previousPage}
            getCanPreviousPage={table.getCanPreviousPage}
            nextPage={table.nextPage}
            getCanNextPage={table.getCanNextPage}
          />
        </>
      ) : (
        <p className="w-full text-center">{'No top-ups for now.'}</p>
      )}
    </div>
  );
}
