import { useCallback, useEffect, useState } from "react";

import TokenForm from "@/Components/TokenForm";
import Header from "@/Components/Header";

import useTokens from "@/hooks/useTokens";
import useAddToken from "@/hooks/useAddToken";
import useUpateToken from "@/hooks/useUpateToken";
import readCoinsMarkets from "@/ApiQueries/CoinGeckoApi/readCoinsMarkets";
import parseCoinGeckoApiToken from "@/helpers/parseCoinGeckoApiToken";
import OverviewTable from "@/Components/OverviewTable";

const HomePage: React.FC<{}> = ({}) => {
  const [data, setData] = useState<Token[]>([]);
  const { data: tokens = [], error } = useTokens();
  const { mutate: updateTokenMutate } = useUpateToken(); // to archive (remove) token
  const { mutate: addTokenMutate } = useAddToken();

  useEffect(() => {
    if (tokens.length) {
      // We need to bind the id of our own api (a number) to the object containing the token data
      // that we get back from CoinGecko, so we now which id we need to give as parameter to the 
      // mutate function that deletes/ archives a token when the user clicks on the little bin.
      const tokenStrings = tokens.map((token) => token.name);
      readCoinsMarkets(tokenStrings as string[]).then((coinGeckoApiTokens) => {
        setData(
          coinGeckoApiTokens.map(coinGeckoApiToken => {
            const ownApiToken = tokens.filter(token => token.name === coinGeckoApiToken.id)[0];
            return parseCoinGeckoApiToken(coinGeckoApiToken, ownApiToken.id as number);
          })
        );
      });
    }
  }, [tokens]);

  const addToken = (tokenName: string) => {
    addTokenMutate(tokenName);
  };

  const archiveToken = useCallback((tokenId: number) => {
    updateTokenMutate({ id: tokenId, active: 0 }); 
  }, [updateTokenMutate]);

  return (
    <main className="p-2">
      <Header />
      <TokenForm addToken={addToken} />
      <div className="mt-4">
        {data && <OverviewTable data={data} removeToken={archiveToken} />}
      </div>
    </main>
  );
};

export default HomePage;
