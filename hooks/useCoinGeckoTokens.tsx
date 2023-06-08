import readCoinsMarkets from "@/ApiQueries/CoinGeckoApi/readCoinsMarkets";

import { useQuery } from "@tanstack/react-query";

const useCoinGeckoTokens = (ownApiTokens: OwnApiToken[]) => {
  const tokenStrings = ownApiTokens.map(ownApiToken => ownApiToken.name);
  return useQuery(["coinGeckoTokens"], () => readCoinsMarkets(tokenStrings));
}

export default useCoinGeckoTokens;