import { tokens } from "@/QueryFunctions/globals";

import wait from "@/QueryFunctions/wait";
import coinsMarketsQueryFn from "@/QueryFunctions/coinsMarketsQueryFn";
import coinsIdMarketChartRangeQueryFn from "@/QueryFunctions/coinsIdMarketChartRangeQueryFn";

import { useQuery } from "@tanstack/react-query";

// resources:
// https://tanstack.com/query/v4/docs/react/guides/query-functions
// https://medium.com/doctolib/react-query-cachetime-vs-staletime-ec74defc483e
// https://www.youtube.com/watch?v=Nm0inP3B_zs&list=PLC3y8-rFHvwjTELCrPrcZlo6blLBUspd2&index=2&ab_channel=Codevolution

import OverviewTable from "./OverviewTable";

const ApiContainer: React.FC<{}> = () => {

  // a delay of 10s is too short. 10-30 calls per minute my ass ;)
  const API_FETCH_DELAY = 12 * 1000;


  const coinsMarketsQuery = useQuery({
    cacheTime: 300 * 1000,
    // refetchInterval: 30 * 1000,
    staleTime: 300 * 1000,
    // "queryKey" is always an array and should be unique across all queries
    queryKey: ["/coins/markets"],
    // force error with: queryFn: () => Promise.reject("The error message here")
    queryFn: () => coinsMarketsQueryFn(tokens),
  });

  const coinsIdMarketChartRangeQuery = useQuery({
    retry: 5, // Number of retry attempts on error
    retryDelay: (retryAttempt) => retryAttempt * 10 * 1000,
    cacheTime: 1200 * 1000,
    // refetchInterval: 45 * 1000,
    staleTime: 600 * 1000,
    queryKey: ["/coins/{id}/market_chart/range"],
    queryFn: (): Promise<ApiChartData[]> => {
      const epoch = Math.trunc(new Date().getTime() / 1000);
      const epochWeekDelta = 24 * 3600 * 7;
      const domain: [number, number] = [epoch - epochWeekDelta, epoch];
      return Promise.all(
        tokens.map((token, index) =>
          wait<ApiChartData>(API_FETCH_DELAY * (index + 1)).then(() =>
            coinsIdMarketChartRangeQueryFn(token, domain)
          )
        )
      );
    },
  });

  // Get a list tokens
  const getApiTokens = () => {
    if (coinsMarketsQuery.isLoading) return "loading";
    if (coinsMarketsQuery.isError)
      return `error: ${JSON.stringify(coinsMarketsQuery.error)}`;
    return coinsMarketsQuery.data;
  };

  const getApiChartsData = () => {
    if (coinsIdMarketChartRangeQuery.isLoading) return "loading";
    if (coinsIdMarketChartRangeQuery.isError)
      return `error: ${JSON.stringify(coinsIdMarketChartRangeQuery.error)}`;
    return coinsIdMarketChartRangeQuery.data;
  };

  const getData = (): Token[] | null => {
    const apiTokens = getApiTokens();
    const apiChartsData = getApiChartsData();
    if (typeof apiTokens === "string") return null; // TODO (quick hack)

    return tokens.map((token, index) => {
      const apiToken = apiTokens[index];

      let trendHourly = undefined,
        trendDaily = undefined,
        trendWeekly = undefined;
      let apiChartData = undefined;

      if (typeof apiChartsData !== "string") {
        apiChartData = apiChartsData[index].prices;

        const lastChartIndex = apiChartData.length - 1;
        const lastValue = apiChartData[lastChartIndex][1];

        // get timeDelta (the interval between two data points) expressed in seconds
        const timeDelta =
          (apiChartData[lastChartIndex][0] -
            apiChartData[lastChartIndex - 1][0]) /
          1000;
        // check how many indices we need to go back to fetch the datapoint of an hour ago
        const hourIndexInterval = Math.round(3600 / timeDelta); // should be "1"

        const hourAgoValue =
          apiChartData[lastChartIndex - hourIndexInterval][1];
        const dayAgoValue =
          apiChartData[lastChartIndex - hourIndexInterval * 24][1];
        const weekAgoValue = apiChartData[0][1];
        const hourDelta = lastValue - hourAgoValue;
        const dayDelta = lastValue - dayAgoValue;
        const weekDelta = lastValue - weekAgoValue;

        // calculate percentages
        trendHourly = Math.round((hourDelta * 1000) / hourAgoValue) / 10;
        trendDaily = Math.round((dayDelta * 1000) / dayAgoValue) / 10;
        trendWeekly = Math.round((weekDelta * 1000) / weekAgoValue) / 10;
      }

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
        chartData: apiChartData,
      };
    });
  };

  const data = getData();
  if (!data) {
    return <div>Loading...</div>;
  }
  
  return <OverviewTable data={data} />;
  // return <OverviewTable tokenData={tokenData} trendData={trendData} />;
};

export default ApiContainer;
