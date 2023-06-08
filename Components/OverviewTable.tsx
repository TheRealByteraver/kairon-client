import Image from "next/image";

import {
  createColumnHelper,
  getCoreRowModel,
  flexRender,
  useReactTable,
} from "@tanstack/react-table";

import WeekChart from "@/Components/WeekChart";
import { useMemo } from "react";

const OverviewTable: React.FC<{
  data: Token[];
  removeToken: (tokenId: number) => void;
}> = ({ data, removeToken }) => {
  
  // Utility fn for creating column definitions
  const columnHelper = createColumnHelper<Token>();

  // color utility
  const getTrendColor = (trend: number) =>
    trend < 0 ? "text-red-500" : "text-green-500";

  // Column definitions
  const defaultColumns = useMemo(
    () => [
      columnHelper.accessor("apiId", {
        // we don't want to display the ticker as a separate column but we need
        // to include it here or we can't use it in the "name" column below.
        // There should be a better way but this works right now.
        // id: undefined,
        header: undefined,
        cell: () => null,
      }),
      // Accessor Column
      columnHelper.accessor("id", {
        // we don't want to display the ticker as a separate column but we need
        // to include it here or we can't use it in the "name" column below.
        // There should be a better way but this works right now.
        // id: undefined,
        header: undefined,
        cell: () => null,
      }),
      // Display Column
      columnHelper.display({
        id: "actions",
        cell: (props) => (
          <div className="flex justify-center items-center -mr-2">
            <button
              onClick={() => removeToken(props.row.getValue("apiId"))}
              className="w-6 h-6"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
          </div>
        ),
      }),
      // Accessor Columns
      columnHelper.accessor("symbol", {
        // we don't want to display the ticker as a separate column but we need
        // to include it here or we can't use it in the "name" column below.
        // TMaybe there is a better way to do this...?
        header: undefined,
        cell: () => null,
      }),
      columnHelper.accessor("image", {
        // same remarks as for "symbol" above
        header: undefined,
        cell: () => null,
      }),
      columnHelper.accessor("marketCapRank", {
        header: () => <div className="w-full text-center">#</div>,
        cell: (props) => {
          const val: number = props.row.getValue("marketCapRank");
          return <div className="mr-4">{val}</div>;
        },
      }),
      columnHelper.accessor("name", {
        id: "name",
        header: () => <div className="w-full ml-2 text-left">Coin</div>,
        cell: (props) => (
          <button className="w-full text-left">
            {/* Link */}
            <div className="flex items-center">
              <div className="mx-1">
                <Image
                  width="25"
                  height="25"
                  src={props.row.getValue("image")}
                  alt=""
                />
              </div>
              <span className="mx-1 font-bold">
                {props.row.getValue("name")}
              </span>
              <span className="uppercase text-gray-500">
                {props.row.getValue("symbol")}
              </span>
            </div>
          </button>
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
          if (val !== undefined) {
            const twColor = getTrendColor(val);
            return <div className={`${twColor} `}>{val}%</div>;
          }
          return <div>N/A</div>;
        },
      }),
      columnHelper.accessor("trendDaily", {
        header: "24h",
        cell: (props) => {
          const val: number = props.row.getValue("trendDaily");
          if (val !== undefined) {
            const twColor = getTrendColor(val);
            return <div className={`${twColor} `}>{val}%</div>;
          }
          return <div>N/A</div>;
        },
      }),
      columnHelper.accessor("trendWeekly", {
        header: "7d",
        cell: (props) => {
          const val: number = props.row.getValue("trendWeekly");
          if (val !== undefined) {
            const twColor = getTrendColor(val);
            return <div className={`${twColor} `}>{val}%</div>;
          }
          return <div>N/A</div>;
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
    ],
    [columnHelper, removeToken]
  );

  const reactTable = useReactTable({
    data: data, // should be memoized
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
    // debugAll: true,
  });

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <table className="w-[1280px] border-collapse font-bold leading-10 text-right">
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
  );
};

export default OverviewTable;
