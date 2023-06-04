import { API_URL } from "./globals";

const coinsIdMarketChartRangeQueryFn = async (
  token: string,
  domain: [number, number]
): Promise<ApiChartData> => {
  // console.log('fetching', token, 'with delay of', API_FETCH_DELAY * (index + 1));
  return fetch(
    `${API_URL}/coins/${token}/market_chart/range?vs_currency=usd&from=${domain[0]}&to=${domain[1]}`
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
    });
};

export default coinsIdMarketChartRangeQueryFn;
