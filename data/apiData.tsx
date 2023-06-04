import bitcoinData from "@/data/bitcoin";
import ethereumData from "@/data/ethereum";

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
    chartData: bitcoinData.prices as CoinGeckoApiDataPoint[],
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
    chartData: ethereumData.prices as CoinGeckoApiDataPoint[],
  },
];

export default apiData;