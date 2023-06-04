import { API_URL } from "./globals";

const coinsMarketsQueryFn = (tokens: string[]): Promise<ApiToken[]> =>
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
        })

export default coinsMarketsQueryFn;