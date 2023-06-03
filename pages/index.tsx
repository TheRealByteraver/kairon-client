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

import bitcoinData from "@/data/bitcoin";
import ethereumData from "@/data/ethereum";
import WeekChart from "@/Components/WeekChart";

// const inter = Inter({ subsets: ['latin'] })

const API_URL = "https://api.coingecko.com/api/v3";

const tokens = ["bitcoin", "ethereum"];

interface Token {
  id: string; // e.g. bitcoin, ethereum etc
  marketCapRank: number;
  symbol: string; // e.g. btc, eth etc
  name: string; // e.g. Bitcoin, Ethereum etc
  image: string;
  currentPrice: number;
  trendHourly: number; // trends are expressed in percentages and can be negative
  trendDaily: number;
  trendWeekly: number;
  totalVolume: number;
  marketCap: number;
  chartData: ApiDataPoint[];
}

const apiData: Token[] = [
  {
    id: "bitcoin",
    marketCapRank: 1,
    symbol: "btc",
    name: "Bitcoin",
    image:
      "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579",
    currentPrice: 18836.5,
    trendHourly: 0.3,
    trendDaily: -5.5,
    trendWeekly: -4.9,
    totalVolume: 37487827262,
    marketCap: 360647792952,
    chartData: bitcoinData.prices as ApiDataPoint[],
  },
  {
    id: "ethereum",
    marketCapRank: 2,
    symbol: "eth",
    name: "Ethereum",
    image:
      "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
    currentPrice: 1520.79,
    trendHourly: 0.3,
    trendDaily: -8.3,
    trendWeekly: -0.3,
    totalVolume: 19400566194,
    marketCap: 183158649788,
    chartData: ethereumData.prices as ApiDataPoint[],
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
    columnHelper.accessor("symbol", {
      // we don't want to display the ticker as a separate column but we need
      // to include it here or we can't use it in the "name" column below.
      // There should be a better way but this works right now.
      id: undefined,
      header: undefined,
      cell: () => null,
    }),
    columnHelper.accessor("image", {
      // same remarks as for "ticker" above
      id: undefined,
      header: undefined,
      cell: () => null,
    }),
    columnHelper.accessor("name", {
      id: "name",
      header: () => <div className="w-full text-left">Coin</div>,
      cell: (props) => (
        <div className="flex items-center">
          <div className="mx-1">
            <Image
              width="25"
              height="25"
              src={props.row.getValue("image")}
              alt=""
            />
          </div>
          <span className="mx-1 font-bold">{props.row.getValue("name")} </span>
          <span className="uppercase text-gray-500">
            {props.row.getValue("symbol")}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor("currentPrice", {
      header: "Price",
      cell: (props) => {
        const val: number = props.row.getValue("currentPrice");
        return <div>${val.toLocaleString("en-US")}</div>;
      },
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
        const val: number = props.row.getValue("trendDaily");
        const twColor = getTrendColor(val);
        return <div className={`${twColor} `}>{val}%</div>;
      },
    }),
    columnHelper.accessor("trendWeekly", {
      header: "7d",
      cell: (props) => {
        const val: number = props.row.getValue("trendWeekly");
        const twColor = getTrendColor(val);
        return <div className={`${twColor} `}>{val}%</div>;
      },
    }),
    columnHelper.accessor("totalVolume", {
      header: "Total Volume",
      cell: (props) => {
        const val: number = props.row.getValue("totalVolume");
        return <>${val.toLocaleString("en-US")}</>;
      },
    }),
    columnHelper.accessor("marketCap", {
      header: "Mkt Cap",
      cell: (props) => {
        const val: number = props.row.getValue("marketCap");
        return <>${val.toLocaleString("en-US")}</>;
      },
    }),
    columnHelper.accessor("chartData", {
      header: "Last 7 Days",
      cell: (props) => {
        return (
          <div className="ml-auto w-[160px] h-[56px]">
            <WeekChart data={props.row.getValue("chartData")} />
          </div>
        );
      },
    }),
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
        <table className="border-collapse w-full font-bold leading-10 text-right">
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
        </table>
        <div className="h-4" />
      </div>
    </main>
  );
}
