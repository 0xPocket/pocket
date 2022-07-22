import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
        header: () => 'Token Name',
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
        cell: (row) => (
          <div className="text-right tracking-wider">{row.getValue()}</div>
        ),
      },
      {
        header: 'Value',
        accessorFn: (row) => {
          const roundValue = Math.floor(Number(row.quote) * 100) / 100;
          return roundValue;
        },
        cell: (row) => (
          <div className="text-right tracking-wider">{row.getValue()} $</div>
        ),
        id: 'quote',
        filterFn: (row) => {
          return row.getValue('quote') > 0.1;
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
    <table className="w-full">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <div
                      className={`${
                        header.column.getCanSort() &&
                        'cursor-pointer select-none'
                      } mb-2 flex items-center text-xl ${
                        header.index !== 0 && 'justify-end'
                      }`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {{
                        asc: (
                          <FontAwesomeIcon icon={faArrowUp} className="ml-2" />
                        ),
                        desc: (
                          <FontAwesomeIcon
                            icon={faArrowDown}
                            className="ml-2"
                          />
                        ),
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
              className={`${
                index % 2 === 1 && ''
              } border-b border-dark border-opacity-10 font-light dark:border-bright-bg dark:border-opacity-10`}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="py-2">
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
