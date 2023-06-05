import coinsMarketsQueryFn from "@/QueryFunctions/coinsMarketsQueryFn";

import { useQuery } from "@tanstack/react-query";

import OverviewTable from "./OverviewTable";

const ApiContainer: React.FC<{
  tokens: string[];
  removeToken: (token: string) => void;
}> = ({ tokens, removeToken }) => {
  const coinsMarketsQuery = useQuery({
    // cacheTime: 300 * 1000,
    refetchInterval: 30 * 1000,
    // staleTime: 300 * 1000,
    // "queryKey" is always an array and should be unique across all queries
    queryKey: ["/coins/markets"],
    // force error with: queryFn: () => Promise.reject("The error message here")
    queryFn: () => {
      console.log("now running coinsMarketsQuery for tokens:", tokens);
      return coinsMarketsQueryFn(tokens);
    },
  });

  // Get a list tokens
  const getApiTokens = () => {
    if (coinsMarketsQuery.isLoading) return "loading";
    if (coinsMarketsQuery.isError)
      return `error: ${JSON.stringify(coinsMarketsQuery.error)}`;
    return coinsMarketsQuery.data;
  };

  const getData = (): Token[] | null => {
    const apiTokens = getApiTokens();
    if (typeof apiTokens === "string") return null; // TODO (quick hack)

    const prepareChartData = (data: number[]): ChartDataPoint[] => {
      // find the lowest value (the lowest price) in the dataset
      const yMin = data.reduce(
        (prev, cur) => (prev < cur ? prev : cur),
        data[0]
      );

      return data.map((dataPoint, index) => ({
        xAxisValue: index,
        yAxisValue: dataPoint - yMin,
      }));
    };

    return apiTokens.map((apiToken) => {
      let trendHourly =
        Math.round(apiToken.price_change_percentage_1h_in_currency * 10) / 10;
      let trendDaily =
        Math.round(apiToken.price_change_percentage_24h_in_currency * 10) / 10;
      let trendWeekly =
        Math.round(apiToken.price_change_percentage_7d_in_currency * 10) / 10;

      return {
        id: apiToken.id, // e.g. bitcoin, ethereum etc
        marketCapRank: apiToken.market_cap_rank,
        symbol: apiToken.symbol, // e.g. btc, eth etc
        name: apiToken.name, // e.g. Bitcoin, Ethereum etc
        image: apiToken.image,
        currentPrice: apiToken.current_price,
        trendHourly,
        trendDaily,
        trendWeekly,
        totalVolume: apiToken.total_volume,
        marketCap: apiToken.market_cap,
        chartData: prepareChartData(apiToken.sparkline_in_7d.price),
      };
    });
  };

  const data = getData();

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <OverviewTable
      data={data}
      removeToken={removeToken}
    />
  );
  // return <OverviewTable tokenData={tokenData} trendData={trendData} />;
};

export default ApiContainer;
