import Image from "next/image";
// import { Inter } from 'next/font/google'
import Link from "next/link";

import {
  createColumnHelper,
  getCoreRowModel,
  flexRender,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";

// const inter = Inter({ subsets: ['latin'] })

const API_URL = "https://api.coingecko.com/api/v3";

const tokens = ["bitcoin", "ethereum"];

type Token = {
  // id: string;
  name: string; // e.g. Bitcoin, Ethereum etc
  imageUrl: string;
  ticker: string; // e.g. BTC, ETH etc
  price: number;
  trendHourly: number; // trends are expressed in percentages and can be negative
  trendDaily: number;
  trendWeekly: number;
  totalVolume: number;
  marketCap: number;
  chartWeekly: string; // temp, should be object
};

const apiData: Token[] = [
  {
    // id: "1",
    name: "Bitcoin",
    imageUrl:
      "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579",
    ticker: "BTC",
    price: 18836.5,
    trendHourly: 0.3,
    trendDaily: -5.5,
    trendWeekly: -4.9,
    totalVolume: 37487827262,
    marketCap: 360647792952,
    chartWeekly: "",
  },
  {
    // id: "2",
    name: "Ethereum",
    imageUrl:
      "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
    ticker: "ETH",
    price: 1520.79,
    trendHourly: 0.3,
    trendDaily: -8.3,
    trendWeekly: -0.3,
    totalVolume: 19400566194,
    marketCap: 183158649788,
    chartWeekly: "",
  },
];

export default function Home() {
  const data = useMemo(() => apiData, []);

  // Utility fn for creating column definitions
  const columnHelper = createColumnHelper<Token>();

  // color utility
  const getTrendColor = (trend: number) =>
    trend < 0 ? "text-red-500" : "text-green-500";

  // Column definitions
  const defaultColumns = [
    // Display Column
    columnHelper.display({
      id: "actions",
      cell: () => <button>x</button>, // cell: (props) => <RowActions row={props.row} />,
    }),
    // Accessor Columns
    columnHelper.accessor("ticker", {
      // we don't want to display the ticker as a separate column but we need
      // to include it here or we can't use it in the "name" column below.
      // There should be a better way but this works right now.
      id: undefined,
      header: undefined,
      cell: () => null,
    }),
    columnHelper.accessor("imageUrl", {
      // same remarks as for "ticker" above
      id: undefined,
      header: undefined,
      cell: () => null,
    }),
    columnHelper.accessor("name", {
      id: "name",
      cell: (props) => (
        <div className="flex items-center">
          <div className="mx-1">
            <Image
              width="25"
              height="25"
              src={props.row.getValue("imageUrl")}
              alt=""
            />
          </div>
          <span className="mx-1 font-bold">{props.row.getValue("name")} </span>
          <span className="text-gray-500">{props.row.getValue("ticker")}</span>
        </div>
      ),
    }),
    columnHelper.accessor("price", {
      header: "Price",
      cell: (props) => <div>${props.row.getValue("price")}</div>,
    }),
    columnHelper.accessor("trendHourly", {
      header: "1h",
      cell: (props) => {
        const val: number = props.row.getValue("trendHourly");
        const twColor = getTrendColor(val);
        return <div className={`${twColor} `}>{val}%</div>;
      },
    }),
    columnHelper.accessor("trendDaily", {
      header: "24h",
      cell: (props) => {
        const val: number  = props.row.getValue("trendDaily");
        const twColor = getTrendColor(val);
        return <div className={`${twColor} `}>{val}%</div>;
      },
    }),
    columnHelper.accessor("trendWeekly", {
      header: "7d",
      cell: (props) => {
        const val: number  = props.row.getValue("trendWeekly");
        const twColor = getTrendColor(val);
        return <div className={`${twColor} `}>{val}%</div>;
      },
    }),
    columnHelper.accessor("totalVolume", {
      header: "Total Volume",
      cell: (props) => <>${props.row.getValue("totalVolume")}</>,
    }),
    columnHelper.accessor("marketCap", {
      header: "Mkt Cap",
      cell: (props) => <>${props.row.getValue("marketCap")}</>,
    }),
    columnHelper.accessor("chartWeekly", { header: "Last 7 Days" }),
  ];

  const reactTable = useReactTable({
    data: data, // should be memoized
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
    debugAll: true,
  });

  // const columns = useMemo(() => defaultColumns, [defaultColumns]); // defs need to be outside

  return (
    <main>
      <header>
        <nav>
          <Link href="/archive">Archive</Link>
        </nav>
      </header>
      <form>
        <label>
          Token ID
          <input
            type="text"
            className="mx-2 border-2 border-black rounded-lg"
          />
        </label>
        <button type="submit">ADD</button>
      </form>

      <div className="p-2 mt-4">
        <table className="border-collapse w-full font-bold leading-10">
          {" "}
          {/* table-fixed  */}
          <thead>
            {reactTable.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-t border-gray-400">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {reactTable.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t border-gray-400">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          {/* <tfoot>
            {reactTable.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot> */}
        </table>
        <div className="h-4" />
        {/* <button onClick={() => rerender()} className="border p-2">
        Rerender
      </button> */}
      </div>
    </main>
  );
}
