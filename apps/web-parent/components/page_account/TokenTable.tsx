import { CovalentItem } from '@lib/types/interfaces';
import {
  ColumnDef,
  useReactTable,
  flexRender,
  getCoreRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { ethers } from 'ethers';
import { useMemo, useState } from 'react';

type TokenTableProps = {
  tokenList: CovalentItem[];
};

function TokenTable({ tokenList }: TokenTableProps) {
  const defaultColumns = useMemo<ColumnDef<CovalentItem>[]>(
    () => [
      {
        header: 'Token Name',
        accessorKey: 'contract_name',
        cell: (data) => data.getValue(),
      },
      {
        header: 'Balance',
        accessorFn: (row) => {
          const bal = ethers.utils.formatUnits(
            row.balance,
            row.contract_decimals,
          );
          return Math.floor(Number(bal) * 100) / 100;
        },
      },
      {
        header: 'Value',
        accessorKey: 'quote',
        id: 'quote',
        filterFn: (row) => {
          console.log(row.getValue('quote'));
          return row.getValue('quote') > 1;
        },
      },
    ],
    [],
  );
  const [columns] = useState(() => [...defaultColumns]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    { id: 'quote', value: 'quote' },
  ]);

  const table = useReactTable<CovalentItem>({
    data: tokenList,
    enableFilters: true,
    columns,
    state: {
      columnVisibility,
      sorting,
      columnFilters,
    },
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="w-full bg-dark-light">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className="bg-dark">
            {headerGroup.headers.map((header) => {
              return (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? 'cursor-pointer select-none'
                          : '',
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  )}
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row, index) => {
          return (
            <tr
              key={row.id}
              className={`${index % 2 === 1 && 'bg-dark'} font-light`}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default TokenTable;
