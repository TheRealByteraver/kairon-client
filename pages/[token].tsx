// "use client" does not work
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import readAllTokens from "@/ApiQueries/ownApi/readAllTokens";
import Header from "@/Components/Header";
import Image from "next/image";
import { useRouter } from "next/router";

const TokenDetails: React.FC<{ token: CoinGeckoApiToken }> = ({ token }) => {
  return (
    <div className="p-2">
      <h1 className="mt-8 flex items-center">
        <div className="mx-1">
          <Image width="30" height="30" src={token.image} alt="" />
        </div>
        <span className="mx-1 font-bold  text-2xl">
          {token.name} (<span className="uppercase">{token.symbol}</span>)
        </span>
      </h1>
      <h2 className="ml-2 mt-2 text-3xl font-bold">
        <span className="">${token.current_price.toLocaleString("en-US")}</span>

        {token.price_change_percentage_24h < 0 ? (
          <span className="ml-4 text-red-500 text-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="inline w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181"
              />
            </svg>
            {token.price_change_percentage_24h.toFixed(1)}%
          </span>
        ) : (
          <span className="ml-4 text-green-500 text-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="inline w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
              />
            </svg>
            {token.price_change_percentage_24h.toFixed(1)}%
          </span>
        )}
      </h2>
      {/* container for bottom part with two columns */}
      <div className="mt-24 w-1/2 h-12">
        {/* color bar container */}
        <div className="w-full h-2.5 bg-gray-300 rounded-full overflow-hidden">
          {/* TODO: don't use fixed width of 30% :) */}
          <div className="w-[50%] h-full bg-gradient-to-r from-orange-400 to-green-500"></div>
        </div>
        {/* legend container */}
        <div className="flex justify-between font-bold">
          <div>${token.low_24h.toLocaleString('en-US',{minimumFractionDigits:2, maximumFractionDigits:2})}</div>
          <div>24H Range</div>
          <div>${token.high_24h.toLocaleString('en-US',{minimumFractionDigits:2, maximumFractionDigits:2})}</div>
        </div>

      </div>
      <div className="w-full h-36 border-2 border-red-500">
        <div className="w-1/2 h-full inline-block border-2 border-green-500">
          <ul className="w-full h-full inline-block border-2 border-fuchsia-500">
            <li className="flex justify-between">
              <p>Market Cap</p><p>{token.market_cap.toLocaleString('en-US',{minimumFractionDigits:2, maximumFractionDigits:2})}</p> 
            </li>
            <li></li>
            <li></li>
          </ul>
        </div>
        <div className="w-1/2 h-full inline-block border-2 border-sky-500">
          <ul className="">
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const TokenDetailPage: React.FC<{}> = ({}) => {
  const router = useRouter();
  const tokenParam = router.query.token;
  const queryClient = useQueryClient();
  const data: CoinGeckoApiToken[] | undefined = queryClient.getQueryData([
    "GET /coins/markets",
  ]);

  const getToken = () => {
    // console.log('data:', data);
    // console.log('tokenParam:', tokenParam);
    if (data && tokenParam) {
      const token = data.filter((token) => token.id === tokenParam);
      if (token.length === 1) {
        return token[0];
      }
    }
    return undefined;
  };

  const token = getToken();
  console.log("token data:", token);

  return (
    <main className="p-2">
      <Header />
      {/* I'd rather redirect the user to the home page but client side routing doesn't work in 
      this component for some reason :( (NextJs issue) */}
      {!data && (
        <p>
          No data found for {tokenParam}, click &ldquo;Home&rdquo; in the
          navigation and add your token there first.
        </p>
      )}

      {token && <TokenDetails token={token} />}
    </main>
  );
};

export default TokenDetailPage;
