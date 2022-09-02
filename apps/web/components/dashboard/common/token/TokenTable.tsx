import {
  faArrowDown,
  faArrowUp,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
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
            {getValue() ? <img src={getValue() as string} alt="" /> : <>lol</>}
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
      },
    ],
    [],
  );
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    { id: 'quote', value: 'quote' },
  ]);

  const table = useReactTable<CovalentItem>({
    data: tokenList,
    enableFilters: true,
    columns: defaultColumns,
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
    <div className="table-container">
      <table className="table">
        <thead className="table-head">
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
                        } table-header ${header.index !== 1 && 'justify-end'} `}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: (
                            <FontAwesomeIcon
                              icon={faArrowUp}
                              className="ml-2"
                            />
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
        <tbody className="table-body">
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id} className="table-row">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="table-cell">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TokenTable;
