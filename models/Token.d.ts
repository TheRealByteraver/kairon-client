interface Token {
  id: string; // e.g. bitcoin, ethereum etc
  marketCapRank: number;
  symbol: string; // e.g. btc, eth etc
  name: string; // e.g. Bitcoin, Ethereum etc
  image: string;
  currentPrice: number;
  // trends are expressed in percentages
  trendHourly: number | undefined; 
  trendDaily: number | undefined;
  trendWeekly: number | undefined;
  totalVolume: number;
  marketCap: number;
  chartData: CoinGeckoApiDataPoint[] | undefined;
}
