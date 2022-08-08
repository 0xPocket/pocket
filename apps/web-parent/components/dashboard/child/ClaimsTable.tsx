import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import moment from 'moment';
import { useState } from 'react';
import { PageSwitchers } from '../../page_account/activity/PageSwitchers';
// import { PageSwitchers } from './PageSwitchers';

type ClaimsTableProps = {
  logs: claim[];
};

type claim = {
  symbol: string;
  value: string;
  timestamp: number;
};

const columnHelper = createColumnHelper<claim>();

const columns = [
  columnHelper.accessor('timestamp', {
    header: () => <span className="ml-1">Date</span>,
    id: 'Date',
    cell: (info) => (
      <span className="ml-1">{moment(info.getValue()).format('D/MM')}</span>
    ),
  }),

  columnHelper.accessor((row) => `${row.value} ${row.symbol}`, {
    id: 'Amount',
  }),
];

export function ClaimsTable({ logs }: ClaimsTableProps) {
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
          {logs.length > 10 && (
            <PageSwitchers
              previousPage={table.previousPage}
              getCanPreviousPage={table.getCanPreviousPage}
              nextPage={table.nextPage}
              getCanNextPage={table.getCanNextPage}
            />
          )}
        </>
      ) : (
        <p className="w-full text-center">{'No claim for now.'}</p>
      )}
    </div>
  );
}
