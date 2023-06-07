import TokenForm from "@/Components/TokenForm";
import Header from "@/Components/Header";

import { useEffect, useState } from "react";

import useTokens from "@/hooks/useTokens";
import useUpateToken from "@/hooks/useUpateToken";
import readCoinsMarkets from "@/ApiQueries/CoinGeckoApi/readCoinsMarkets";
import parseCoinGeckoApiToken from "@/helpers/parseCoinGeckoApiToken";

const HomePage: React.FC<{}> = ({}) => {
  const [data, setData] = useState<CoinGeckoApiToken[]>([]);
  const { data: tokens = [], error } = useTokens();
  const { mutate: updateTokenMutation } = useUpateToken();

  useEffect(() => {
    if (tokens.length) {
      const tokensString = tokens.map((token) => token.name).join();
      fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${tokensString}&sparkline=true&price_change_percentage=1h,24h,7d&precision=2`
      )
        .then((data) => data.json())
        .then((data) => setData(data));

      // const tokenStrings = tokens.map((token) => token.name);
      // readCoinsMarkets(tokenStrings as string[]).then((coinGeckoApiTokens) => {
      //   setData(coinGeckoApiTokens.map((coinGeckoApiToken) => parseCoinGeckoApiToken(coinGeckoApiToken)));
      // });
    }
  }, [tokens]);

  const addToken = (tokenName: string) => {

  };
  
  const removeToken = (id: number) => {
    const payload: OwnApiToken = { id: id, active: 0 };
    updateTokenMutation(payload);
  };

  return (
    <main className="p-2">
      <Header />
      <TokenForm addToken={addToken} />

      <div className="mt-4">
        {(error !== undefined) && (error !== null) && (
          <div>An error occured retrieving the tokens from our api</div>
        )}

        {tokens && !("error" in tokens) && (
          <ul>
            {tokens.map((token) => (
              <li key={token.id}>
                <button onClick={() => removeToken(token.id as number)}>
                  XXX
                </button>{" "}
                {token.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default HomePage;
