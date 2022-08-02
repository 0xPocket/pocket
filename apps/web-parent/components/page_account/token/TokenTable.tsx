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
        header: '',
        accessorKey: 'logo_url',
        cell: ({ getValue }) => (
          <div className="flex w-8 items-center justify-center">
            <img src={getValue() as string} alt="" />
          </div>
        ),
      },
      {
        header: () => 'Token Name',
        accessorKey: 'contract_name',
        cell: ({ getValue }) => {
          return <div>{getValue() as number}</div>;
        },
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
        cell: ({ getValue }) => (
          <div className="text-right tracking-wider">
            {getValue() as number}
          </div>
        ),
      },
      {
        header: 'Value',
        accessorFn: (row) => {
          const roundValue = Math.floor(Number(row.quote) * 100) / 100;
          return roundValue;
        },
        cell: (cell) => (
          <div className="text-right tracking-wider">
            <>{cell.getValue()} $</>
          </div>
        ),
        id: 'quote',
        filterFn: (row) => {
          return (row.getValue('quote') as number) > 0.1;
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
                        header.index !== 1 && 'justify-end'
                      } `}
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
        {table.getRowModel().rows.map((row) => {
          return (
            <tr
              key={row.id}
              className={`border-b border-dark border-opacity-10 font-light dark:border-bright-bg dark:border-opacity-10`}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className={`py-2`}>
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