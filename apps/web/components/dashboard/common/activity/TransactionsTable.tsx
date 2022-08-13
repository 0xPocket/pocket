import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { AssetTransfersResultWithMetadata } from '@lib/types/interfaces';
import { AssetTransfersCategory } from '@alch/alchemy-sdk';
import moment from 'moment';
import { useState } from 'react';
import { PageSwitchers } from 'web/components/dashboard/common/activity/PageSwitchers';

type TransactionsTableProps = {
  transactionsList: AssetTransfersResultWithMetadata[];
};

function transformCategory(category: AssetTransfersCategory) {
  if (category === 'erc20') return 'Crypto';
  if (
    category === 'erc721' ||
    category === 'erc1155' ||
    category === 'specialnft'
  )
    return 'NFT';
  return category;
}

function formatValue(value: number | null) {
  let format = value?.toFixed(2) === '0.00' ? '0' : value?.toFixed(2);
  if (format === undefined) format = '1';
  return `${format} `;
}

const columnHelper = createColumnHelper<AssetTransfersResultWithMetadata>();

const columns = [
  columnHelper.accessor('metadata.blockTimestamp', {
    cell: (info) => (
      <span className="ml-1">{moment(info.getValue()).format('D/MM')}</span>
    ),
    header: () => <span className="ml-1">Date</span>,
    id: 'Date',
  }),
  columnHelper.accessor((row) => `${formatValue(row.value)} ${row.asset}`, {
    id: 'Amount',
  }),
  columnHelper.accessor('category', {
    cell: (info) => <span>{transformCategory(info.getValue())}</span>,
    id: 'Category',
  }),
];

export function TransactionsTable({
  transactionsList,
}: TransactionsTableProps) {
  const [data] = useState([...transactionsList]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="container-classic rounded-lg">
      {transactionsList.length ? (
        <>
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  className="mt-1 grid grid-cols-3 gap-4"
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
                <tr className="grid grid-cols-3 gap-4" key={row.id}>
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
        <p className="w-full text-center">{'No transactions for now.'}</p>
      )}
    </div>
  );
}
