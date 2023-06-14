import readCoinsMarkets from "@/ApiQueries/CoinGeckoApi/readCoinsMarkets";

import { useQuery, useQueryClient } from "@tanstack/react-query";

const useCoinGeckoTokens = () => {
  const queryClient = useQueryClient();

  return useQuery({
    refetchInterval: 30000,
    queryKey: ["coinGeckoTokens"],
    queryFn: () => {
      const ownApiTokensQueryCache = queryClient.getQueryData(["tokens"]);
      let ownApiTokens: OwnApiToken[] = [];
      if (ownApiTokensQueryCache) {
        ownApiTokens = ownApiTokensQueryCache as OwnApiToken[];
      }
      const tokenStrings = ownApiTokens.map((ownApiToken) => ownApiToken.name);
      return readCoinsMarkets(tokenStrings);
    },
  });
};

export default useCoinGeckoTokens;
