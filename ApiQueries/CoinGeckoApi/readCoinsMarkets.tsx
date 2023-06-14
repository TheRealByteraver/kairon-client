import { COINGECKO_API_URL } from "./globals";

const readCoinsMarkets = async (
  tokens: string[]
): Promise<CoinGeckoApiToken[]> => {
  // sanitize array of tokens:
  const tokenArr = tokens.filter(token => token.trim().length > 0);

  // The return below is necessary because querying CoinGecko without
  // specifying any Token id will return a list of the first 100 tokens
  // (highest in value first, descending)
  if (tokenArr.length === 0) return [];

  return (
    fetch(
      `${COINGECKO_API_URL}/coins/markets?vs_currency=usd&ids=${tokenArr.join()}&sparkline=true&price_change_percentage=1h,24h,7d&precision=2`
    )
      .then((response) => response.json())
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
  );
};

export default readCoinsMarkets;
