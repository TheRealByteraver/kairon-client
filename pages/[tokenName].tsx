import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Header from "@/components/Header";
import readCoinsMarkets from "@/ApiQueries/CoinGeckoApi/readCoinsMarkets";
import TokenDetails from "@/components/TokenDetails";

const TokenDetailPage: React.FC<{}> = ({}) => {
  const router = useRouter();
  const { tokenName } = router.query;

  const [data, setData] = useState<CoinGeckoApiToken>();

  useEffect(() => {
    if (tokenName && tokenName !== "") {
      readCoinsMarkets([tokenName as string]).then((coinGeckoApiTokens) =>
        setData(coinGeckoApiTokens[0])
      );
    }
  }, [tokenName]);

  return (
    <main className="p-2">
      <Header />
      {!data && <p>Loading data for &ldquo;{tokenName}&rdquo;...</p>}

      {data && <TokenDetails token={data} />}
    </main>
  );
};

export default TokenDetailPage;
