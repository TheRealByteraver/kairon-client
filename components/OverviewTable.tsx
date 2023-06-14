import Image from "next/image";

import {
  createColumnHelper,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import WeekChart from "@/components/WeekChart";
import { useMemo, useState } from "react";
import TrashCanIcon from "./UI/Icons/TrashCanIcon";
import Link from "next/link";

const OverviewTable: React.FC<{
  data: Token[];
  removeToken: (tokenId: number) => void;
}> = ({ data, removeToken }) => {
  // color utility
  const getTrendColor = (trend: number) =>
    trend < 0 ? "text-red-500" : "text-green-500";

  // Utility fn for creating column definitions
  const columnHelper = createColumnHelper<Token>();

  // Column definitions
  const defaultColumns = useMemo(
    () => [
      // Accessor Columns
      columnHelper.accessor("symbol", {
        // we don't want to display the ticker as a separate column but we need
        // to include it here or we can't use it in the "name" column below.
        // TMaybe there is a better way to do this...?
        header: undefined,
        cell: () => null,
      }),
      columnHelper.accessor("apiId", {
        header: undefined,
        cell: () => null,
      }),
      // Accessor Column
      columnHelper.accessor("id", {
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
              <TrashCanIcon />
            </button>
          </div>
        ),
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
          <Link href={`/${props.row.getValue("id")}`}>
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
          </Link>
        ),
      }),


      columnHelper.accessor("currentPrice", {        
        header: "Price",        
        cell: (props) => {
          const val: number = props.row.getValue("currentPrice");
          return <div>${val.toLocaleString("en-US")}</div>;
        },
      }),

      // {
      //   header: "price",
      //   accessor: "currentPrice",
      //   cell: (props: any) => {
      //     const val: number = props.row.getValue("currentPrice");
      //     if (val !== undefined) {
      //       return <div>${val.toLocaleString("en-US")}</div>;
      //     }
      //     return <div>N/A</div>;
      //   },
      // },

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

  const [sorting, setSorting] = useState<SortingState>([])

  const reactTable = useReactTable({
    data: data,
    columns: defaultColumns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // debugAll: true,
  });

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <table className="w-[1280px] border-collapse font-bold leading-10 text-right">
        <thead>
          {reactTable.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-t border-gray-400">
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} className="">
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
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
          {reactTable.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id} className="border-t border-gray-400">
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OverviewTable;
