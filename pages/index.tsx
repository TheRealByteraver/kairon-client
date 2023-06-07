import TokenForm from "@/Components/TokenForm";
import Header from "@/Components/Header";

import { useEffect, useState } from "react";

import useTokens from "@/hooks/useTokens";
import useAddToken from "@/hooks/useAddToken";
import useUpateToken from "@/hooks/useUpateToken";
import readCoinsMarkets from "@/ApiQueries/CoinGeckoApi/readCoinsMarkets";
import parseCoinGeckoApiToken from "@/helpers/parseCoinGeckoApiToken";
import OverviewTable from "@/Components/OverviewTable";

const HomePage: React.FC<{}> = ({}) => {
  // const [data, setData] = useState<CoinGeckoApiToken[]>([]);
  const [data, setData] = useState</*CoinGeckoApi*/ Token[]>([]);
  const { data: tokens = [], error } = useTokens();
  const { mutate: updateTokenMutate } = useUpateToken();
  const { mutate: addTokenMutate } = useAddToken();

  useEffect(() => {
    if (tokens.length) {
      // const tokensString = tokens.map((token) => token.name).join();
      // fetch(
      //   `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${tokensString}&sparkline=true&price_change_percentage=1h,24h,7d&precision=2`
      // )
      //   .then((data) => data.json())
      //   .then((data) => setData(data));

      const tokenStrings = tokens.map((token) => token.name);
      readCoinsMarkets(tokenStrings as string[]).then((coinGeckoApiTokens) => {
        setData(
          coinGeckoApiTokens.map((coinGeckoApiToken) =>
            parseCoinGeckoApiToken(coinGeckoApiToken)
          )
        );
      });
    }
  }, [tokens]);

  const addToken = (tokenName: string) => {
    addTokenMutate(tokenName);
  };

  const archiveToken = (tokenName: string) => {
    console.log('archiveToken() called! with param', tokenName);
    console.log('tokens are:', tokens);
    const tokenToArchive = tokens.filter(token => token.name === tokenName);
    if (tokenToArchive.length === 1) {
      const token = tokenToArchive[0];
      console.log('found token to delete:', token);
      const payload: OwnApiToken = { id: token.id, active: 0 };
      updateTokenMutate(payload); 
    }
  };

  return (
    <main className="p-2">
      <Header />
      <TokenForm addToken={addToken} />

      <div className="mt-4">
        {data && <OverviewTable data={data} removeToken={archiveToken} />}


        {/* {error !== undefined && error !== null && (
          <div>An error occured retrieving the tokens from our api</div>
        )}

        {tokens && !("error" in tokens) && (
          <ul>
            {tokens.map((token) => (
              <li key={token.id}>
                <button onClick={() => archiveToken(token.id as number)}>
                  XXX
                </button>{" "}
                {token.name}
              </li>
            ))}
          </ul>
        )} */}
      </div>
    </main>
  );
};

export default HomePage;
