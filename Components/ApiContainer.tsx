import wait from "@/QueryFunctions/wait";
import coinsMarketsQueryFn from "@/QueryFunctions/coinsMarketsQueryFn";
import coinsIdMarketChartRangeQueryFn from "@/QueryFunctions/coinsIdMarketChartRangeQueryFn";

import { useQuery, useQueryClient } from "@tanstack/react-query";

// resources:
// https://tanstack.com/query/v4/docs/react/guides/query-functions
// https://medium.com/doctolib/react-query-cachetime-vs-staletime-ec74defc483e
// https://www.youtube.com/watch?v=Nm0inP3B_zs&list=PLC3y8-rFHvwjTELCrPrcZlo6blLBUspd2&index=2&ab_channel=Codevolution

import OverviewTable from "./OverviewTable";

const ApiContainer: React.FC<{ tokens: string[] }> = ({ tokens }) => {
  // a delay of 10s is too short. 10-30 calls per minute my ass ;)
  const API_FETCH_DELAY = 19 * 1000;

  const queryClient = useQueryClient();

  const coinsMarketsQuery = useQuery({
    cacheTime: 300 * 1000,
    // refetchInterval: 30 * 1000,
    staleTime: 300 * 1000,
    // "queryKey" is always an array and should be unique across all queries
    queryKey: ["/coins/markets"],
    // force error with: queryFn: () => Promise.reject("The error message here")
    queryFn: () => {
      console.log("now running coinsMarketsQuery for tokens:", tokens);
      return coinsMarketsQueryFn(tokens);
    },
  });

  const coinsIdMarketChartRangeQuery = useQuery({
    // retry == number of retry attempts on error
    retry: 5,
    retryDelay: (retryAttempt) => retryAttempt * 10 * 1000,
    cacheTime: 1200 * 1000,
    // refetchInterval: 45 * 1000,
    staleTime: 600 * 1000,
    queryKey: ["/coins/{id}/market_chart/range"],
    queryFn: (): Promise<CoinGeckoApiChartData[]> => {
      console.log(
        "now running coinsIdMarketChartRangeQuery for tokens:",
        tokens
      );
      const epoch = Math.trunc(new Date().getTime() / 1000);
      const epochWeekDelta = 24 * 3600 * 7;
      const domain: [number, number] = [epoch - epochWeekDelta, epoch];
      return Promise.all(
        tokens.map((token, index) =>
          wait<CoinGeckoApiChartData>(API_FETCH_DELAY * (index + 1)).then(() =>
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

    return tokens
      .map((token, index) => {
        console.log('token: ', token, ', index: ', index);

        if (apiTokens[index] === undefined) {
          console.log('invalidating queries for new token', token);
          queryClient.invalidateQueries(["/coins/markets"]);
          queryClient.invalidateQueries(["/coins/{id}/market_chart/range"]);
        }
        
        return token;
      })
      .filter((token, index) => apiTokens[index] !== undefined) // prevent crash on token add
      .map((token, index) => {
        const apiToken = apiTokens[index];

        let trendHourly = undefined,
          trendDaily = undefined,
          trendWeekly = undefined;
        let coinGeckoApiChartData = undefined;

        if (typeof apiChartsData !== "string") {
          coinGeckoApiChartData = apiChartsData[index].prices;

          const lastChartIndex = coinGeckoApiChartData.length - 1;

          // the coin gecko api sometimes returns empty arrays (no history)
          if (lastChartIndex <= 0) {
            coinGeckoApiChartData = undefined;
          } else {
            const lastValue = coinGeckoApiChartData[lastChartIndex][1];

            // get timeDelta (the interval between two data points) expressed in seconds
            const timeDelta =
              (coinGeckoApiChartData[lastChartIndex][0] -
                coinGeckoApiChartData[lastChartIndex - 1][0]) /
              1000;
            // check how many indices we need to go back to fetch the datapoint of an hour ago
            const hourIndexInterval = Math.round(3600 / timeDelta); // should be "1"

            if (lastChartIndex >= hourIndexInterval * 24) {
              const hourAgoValue =
                coinGeckoApiChartData[lastChartIndex - hourIndexInterval][1];
              const dayAgoValue =
                coinGeckoApiChartData[
                  lastChartIndex - hourIndexInterval * 24
                ][1];
              const weekAgoValue = coinGeckoApiChartData[0][1];
              const hourDelta = lastValue - hourAgoValue;
              const dayDelta = lastValue - dayAgoValue;
              const weekDelta = lastValue - weekAgoValue;

              // calculate percentages
              trendHourly = Math.round((hourDelta * 1000) / hourAgoValue) / 10;
              trendDaily = Math.round((dayDelta * 1000) / dayAgoValue) / 10;
              trendWeekly = Math.round((weekDelta * 1000) / weekAgoValue) / 10;
            }
          }
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
          chartData: coinGeckoApiChartData,
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
