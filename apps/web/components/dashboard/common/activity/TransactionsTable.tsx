import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { AssetTransfersResultWithMetadata } from '@lib/types/interfaces';
import { AssetTransfersCategory } from '@alch/alchemy-sdk';
import moment from 'moment';

type TransactionsTableProps = {
  transactionsList: AssetTransfersResultWithMetadata[];
};

function transformCategory(category: AssetTransfersCategory) {
  switch (category) {
    case 'erc20':
      return 'Crypto';
    case 'erc721':
    case 'erc1155':
    case 'specialnft':
      return 'NFT';
    default:
      return category;
  }
}

const colorCat = (category: string) => {
  switch (category) {
    case 'erc20':
      return '#fff';
    case 'erc721':
    case 'erc1155':
    case 'specialnft':
      return '#abd';
    default:
      return '#CCC';
  }
};

const getBadge = (category: string) => {
  switch (category) {
    case 'erc20':
      return <span className="cat-badge-green">Crypto</span>;
    case 'erc721':
    case 'erc1155':
    case 'specialnft':
      return <span className="cat-badge-blue">NFT</span>;
    default:
      return <span className="cat-badge-dark">{category}</span>;
  }
};

function formatValue(value: number | null) {
  let format = value?.toFixed(2) === '0.00' ? '0' : value?.toFixed(2);
  if (format === undefined) format = '1';
  return `${format} `;
}

const columnHelper = createColumnHelper<AssetTransfersResultWithMetadata>();

const columns = [
  columnHelper.accessor('metadata.blockTimestamp', {
    cell: (info) => moment(info.getValue()).format('DD/MM'),
    header: () => <span>Date</span>,
    id: 'Date',
  }),
  columnHelper.accessor(
    (row) => `${formatValue(row.value)} ${row.asset ?? ''}`,
    {
      cell: (info) => <div className=" text-right">{info.getValue()}</div>,
      header: () => <span>Amount</span>,
      id: 'Amount',
    },
  ),
  columnHelper.accessor('category', {
    cell: (info) => (
      <div className="text-right">
        {getBadge(info.getValue())}
        {/* <span
          className="nft-cat-badge"
          style={{ backgroundColor: colorCat(info.getValue()) }}
        >
          {transformCategory(info.getValue())}
        </span> */}
      </div>
    ),
    header: () => <span>Category</span>,
    id: 'Category',
  }),
];

export function TransactionsTable({
  transactionsList,
}: TransactionsTableProps) {
  const table = useReactTable({
    data: transactionsList,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      {transactionsList.length ? (
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
                <tr key={row.id} className="table-row">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="table-cell">
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
        <p className="w-full text-center">{'No transactions to display.'}</p>
      )}
    </>
  );
}
