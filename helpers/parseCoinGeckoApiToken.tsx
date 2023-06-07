
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

const parseCoinGeckoApiToken = (apiToken: CoinGeckoApiToken): Token => {
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
};

export default parseCoinGeckoApiToken;