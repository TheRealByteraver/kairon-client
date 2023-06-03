import Link from "next/link";
import { useMemo } from "react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// import apiData from "@/data/apiData"; // mock data

import OverviewTable from "@/Components/OverviewTable";

const API_URL = "https://api.coingecko.com/api/v3";
const tokens = ["bitcoin", "ethereum", "tether"];

// resource: https://medium.com/doctolib/react-query-cachetime-vs-staletime-ec74defc483e
const refetchInterval = 120000; // 30000; // in ms
const staleTime = 120000; // make sure not to perform another request for two minutes after the first successful one

const HomePage: React.FC<{}> = ({}) => {
  // const data = useMemo(() => apiData, []); // mock data, memoized

  const coinsMarketsQuery = useQuery({
    refetchInterval,
    staleTime,
    queryKey: ["/coins/markets"], // this is always an array and should be unique
    // force error with: queryFn: () => Promise.reject("The error message here")
    queryFn: (): Promise<ApiToken[]> =>
      fetch(
        `${API_URL}/coins/markets?vs_currency=usd&ids=${tokens.join()}&precision=2&order=market_cap_desc`
      )
        .then((response) => response.json())
        .then((body) => {
          console.log("api response: ", body);
          return body;
        })
        .then((response) => {
          if (response.error !== undefined) {
            console.log("response.error:", response.error);
            throw new Error(response.error);
          }
          return response;
        })
        .catch((error) => {
          throw new Error(error);
        }),
  });

  const coinsIdMarketChartRangeQuery = useQuery({
    refetchInterval,
    staleTime,
    queryKey: ["/coins/{id}/market_chart/range"], // this is always an array and should be unique
    // force error with: queryFn: () => Promise.reject("The error message here")
    queryFn: (): Promise<ApiChartData[]> => {
      const epoch = Math.trunc(new Date().getTime() / 1000);
      const epochWeekDelta = 24 * 3600 * 7;

      return Promise.all(
        tokens.map((token) =>
          fetch(
            `${API_URL}/coins/${token}/market_chart/range?vs_currency=usd&from=${
              epoch - epochWeekDelta
            }&to=${epoch}`
          )
            .then((response) => response.json())
            .then((body) => {
              console.log("api response for", token, ":", body);
              return body;
            })
            .then((response) => {
              if (response.error !== undefined) {
                console.log("response.error:", response.error);
                throw new Error(response.error);
              }
              return response;
            })
            .catch((error) => {
              throw new Error(error);
            })
        )
      );
    },
  });

  // Get a list tokens
  const getApiTokens = () => {
    if (coinsMarketsQuery.isLoading) return "loading";
    if (coinsMarketsQuery.isError) return `error: ${JSON.stringify(coinsMarketsQuery.error)}`;
    return coinsMarketsQuery.data;
  };

  const getApiChartsData = () => {
    if (coinsIdMarketChartRangeQuery.isLoading) return "loading";
    if (coinsIdMarketChartRangeQuery.isError) return  `error: ${JSON.stringify(coinsIdMarketChartRangeQuery.error)}`;
    return coinsIdMarketChartRangeQuery.data;
  }

  const getData = (): Token[] | null => {
    const apiTokens = getApiTokens();
    const apiChartsData = getApiChartsData();
    if (typeof apiTokens === 'string' || typeof apiChartsData === 'string') return null; // TODO (quick hack)
    return tokens.map((token, index) => {
      const apiToken = apiTokens[index];
      const apiChartData = apiChartsData[index].prices;

      const lastChartIndex = apiChartData.length - 1;
      const lastValue = apiChartData[lastChartIndex][1];


      // get timeDelta (the interval between two data points) expressed in seconds
      const timeDelta = (apiChartData[lastChartIndex][0] - apiChartData[lastChartIndex - 1][0]) / 1000;
      // check how many indices we need to go back to fetch the datapoint of an hour ago
      const hourIndexInterval = Math.round(3600 / timeDelta); // should be "1"

      const hourAgoValue = apiChartData[lastChartIndex - hourIndexInterval][1];
      const dayAgoValue = apiChartData[lastChartIndex - hourIndexInterval * 24][1];
      const weekAgoValue = apiChartData[0][1];
      const hourDelta = lastValue - hourAgoValue;
      const dayDelta = lastValue - dayAgoValue;
      const weekDelta = lastValue - weekAgoValue;

      // calculate percentages
      const trendHourly = Math.round(hourDelta * 1000 / hourAgoValue) / 10;
      const trendDaily = Math.round(dayDelta * 1000 / dayAgoValue) / 10;
      const trendWeekly = Math.round(weekDelta * 1000 / weekAgoValue) / 10;

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
        chartData: apiChartData
      }
    });
  }

  const data = getData();
  
  // return <>{JSON.stringify({ data: getData()})}</>

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
        {data && <OverviewTable data={data} />}        
      </div>
    </main>
  );
};

export default HomePage;
