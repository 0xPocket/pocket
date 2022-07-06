import {
  ColumnDef,
  useReactTable,
  flexRender,
  getCoreRowModel,
  SortingState,
  getSortedRowModel,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { covalentItem } from './TokenContent';

type TokenTableProps = {
  tokenList: covalentItem[];
};

function TokenTable({ tokenList }: TokenTableProps) {
  const defaultColumns = useMemo<ColumnDef<covalentItem>[]>(
    () => [
      {
        header: 'Token Name',
        accessorKey: 'contract_name',
        cell: (data) => data.getValue(),
      },
      {
        header: 'Balance',
        accessorKey: 'balance',
      },
      {
        header: 'Value',
        accessorKey: 'quote',
      },
    ],
    [],
  );
  const [columns] = useState(() => [...defaultColumns]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});

  const table = useReactTable<covalentItem>({
    data: tokenList,
    columns,
    state: {
      columnVisibility,
      sorting,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    // debugTable: true,
    // debugHeaders: true,
    // debugColumns: true,
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
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
        {table.getRowModel().rows.map((row) => {
          return (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => {
                return (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default TokenTable;
