import { useCallback } from "react";

import TokenForm from "@/Components/TokenForm";
import Header from "@/Components/Header";
import useTokens from "@/hooks/useTokens";
import useAddToken from "@/hooks/useAddToken";
import useUpateToken from "@/hooks/useUpateToken";
import parseCoinGeckoApiToken from "@/helpers/parseCoinGeckoApiToken";
import OverviewTable from "@/Components/OverviewTable";
import useCoinGeckoTokens from "@/hooks/useCoinGeckoTokens";
import { useQueryClient } from "@tanstack/react-query";

const HomePage: React.FC<{}> = ({}) => {
  const queryClient = useQueryClient();
  const { data: ownApiTokens = [], error: ownApiError } = useTokens();
  const { mutate: updateTokenMutate } = useUpateToken(); // to archive (remove) token
  const { mutate: addTokenMutate } = useAddToken();
  const { data: coinGeckoApiTokens = [], error: coinGeckoApiError } =
    useCoinGeckoTokens();

  const checkForRefetch = () => {
    if (ownApiTokens.length !== coinGeckoApiTokens.length)
      queryClient.invalidateQueries(["coinGeckoTokens"]);
  };

  checkForRefetch();

  const parseCoinGeckoApiTokens = (coinGeckoApiTokens: CoinGeckoApiToken[]) => {
    // We need to bind the id of our own api (a number) to the object containing the token data
    // that we get back from CoinGecko, so we now which id we need to give as parameter to the
    // mutate function that deletes/ archives a token when the user clicks on the bin icon.
    const coinGeckoTokens: Token[] = [];
    coinGeckoApiTokens.forEach((coinGeckoApiToken) => {
      const ownApiToken = ownApiTokens.filter(
        (token) => token.name === coinGeckoApiToken.id
      )[0];
      if (ownApiToken?.id) {
        coinGeckoTokens.push(
          parseCoinGeckoApiToken(coinGeckoApiToken, ownApiToken.id)
        );
      }
    });
    return coinGeckoTokens;
  };

  const addToken = async (tokenName: string) => {
    addTokenMutate(tokenName);
    queryClient.invalidateQueries(["coinGeckoTokens"]);
  };

  const archiveToken = useCallback(
    (tokenId: number) => {
      // set "active" to zero to mark token as "archived".
      updateTokenMutate({ id: tokenId, active: 0 });
      // we do not need to invalidate the query ["coinGeckoTokens"] here,
      // because we only display tokens for every token id present in 
      // ownApiTokens[] (see custom hook useTokens())
    },
    [updateTokenMutate]
  );

  return (
    <main className="p-2">
      <Header />
      <TokenForm addToken={addToken} />
      <div className="mt-4">
        {coinGeckoApiTokens && (
          <OverviewTable
            data={parseCoinGeckoApiTokens(coinGeckoApiTokens)}
            removeToken={archiveToken}
          />
        )}
      </div>
    </main>
  );
};

export default HomePage;
