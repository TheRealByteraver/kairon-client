import TokenForm from "@/Components/TokenForm";
import useTokens from "@/ApiQueries/ownApi/readAllTokens";
import Header from "@/Components/Header";
import { useEffect, useState } from "react";
import useUpateToken from "@/ApiQueries/ownApi/updateToken";

const HomePage: React.FC<{}> = ({}) => {
  const [data, setData] = useState<CoinGeckoApiToken[]>([]);
  const { data: tokens = [], error } = useTokens();
  const { mutate } = useUpateToken();

  useEffect(() => {
    if (tokens.length) {
      // console.log('tokens.length:', tokens.length);
      console.log("tokens:", tokens);

      const tokenStrArr = tokens.map((token) => token.id);

      fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${tokenStrArr.join()}&sparkline=true&price_change_percentage=1h,24h,7d&precision=2`
      )
        .then((data) => data.json())
        .then((data) => setData(data));

      // readCoinsMarkets(tokens).then((apiTokens) => {
      //   settokenData(
      //     apiTokens.map((apiToken) => parseCoinGeckoApiToken(apiToken))
      //   );
      // });
    }
  }, [tokens]);

  console.log("data:", data);

  const handleDelete = (id: string) => {
    const payload = { id: id, active: 0 };
    mutate(payload);
  };

  const addToken = (token: string) => {
    // addTokenMutation.mutate(token);
    // queryClient.invalidateQueries(["GET /token"]);
    // setRefetch(true);
  };
  const removeToken = (token: string) => {
    // archiveTokenMutation.mutate(token);
    // queryClient.invalidateQueries(["GET /token"]);
    // setRefetch(true);
  };

  return (
    <main className="p-2">
      <Header />
      <TokenForm addToken={addToken} />

      <div className="mt-4">
        {error && <div>An error occured retrieving the tokens from our api</div>}

        {tokens && !("error" in tokens) && (
          <ul>
            {tokens.map((token) => (
              <li key={token.id}>
                <button onClick={() => handleDelete(token.id)}>XXX</button>{" "}
                {token.id}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default HomePage;
